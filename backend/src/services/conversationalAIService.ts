import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import EventEmitter from 'events';
import WebSocket from 'ws';

export class ConversationalAIService extends EventEmitter {
    private deepgramClient: any;
    private deepgramLive: any;
    private genAI: GoogleGenerativeAI;
    private model: any;
    private conversationHistory: any[] = [];
    private systemPrompt: string;
    private twilioWs: WebSocket | null = null;
    private streamSid: string = '';
    private isSpeaking: boolean = false;

    constructor() {
        super();
        
        // Initialize Deepgram
        this.deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);
        
        // Initialize Gemini
        const geminiKey = process.env.GEMINI_API_KEY || '';
        if (!geminiKey) {
            console.warn('GEMINI_API_KEY is not set. Gemini calls will likely fail.');
        }
        this.genAI = new GoogleGenerativeAI(geminiKey);
        this.model = this.genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
            }
        });
        
        // System prompt for sales agent
        this.systemPrompt = `You are a professional sales agent for a software company. Your role is to:

1. Be friendly, conversational, and enthusiastic
2. Introduce your company's three main products:
   - CRM Tool: Manage customer relationships, automate follow-ups
   - Analytics Platform: Real-time dashboards, predictive insights
   - Automation Software: Eliminate repetitive tasks, save time
3. Share pricing when asked: $99 (basic), $499 (professional), $999 (enterprise)
4. Offer to schedule demos when customers show interest
5. Handle objections gracefully and keep the conversation flowing
6. Keep responses concise (2-3 sentences max)
7. Use natural, conversational language - no robotic responses
8. Ask follow-up questions to understand customer needs

Remember: You're having a real phone conversation, so be natural and engaging!`;

        this.conversationHistory = [
            {
                role: 'system',
                parts: [{ text: this.systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood! I\'m ready to have natural sales conversations.' }]
            }
        ];
    }

    setTwilioWebSocket(ws: WebSocket, streamSid: string) {
        this.twilioWs = ws;
        this.streamSid = streamSid;
    }

    async startDeepgramConnection() {
    this.deepgramLive = this.deepgramClient.listen.live({
    model: "nova-2",
    language: "en-US",
    encoding: "mulaw",
    sample_rate: 8000,
    smart_format: true,
    });

        this.deepgramLive.on(LiveTranscriptionEvents.Open, () => {
            console.log('Deepgram connection opened');
            
            this.deepgramLive.on(LiveTranscriptionEvents.Transcript, async (data: any) => {
                const transcript = data.channel?.alternatives?.[0]?.transcript;
                
                if (transcript && transcript.trim().length > 0) {
                    console.log('User said:', transcript);
                    this.emit('transcript', transcript);
                    
                    // Get AI response and convert to speech
                    const responseText = await this.getAIResponse(transcript);
                    await this.generateAndSendTTS(responseText);
                }
            });

            this.deepgramLive.on(LiveTranscriptionEvents.Error, (error: any) => {
                console.error('Deepgram error:', error);
                this.emit('error', error);
            });

            this.deepgramLive.on(LiveTranscriptionEvents.Close, () => {
                console.log('Deepgram connection closed');
                this.emit('close');
            });
        });

        return this.deepgramLive;
    }

    async getAIResponse(userMessage: string): Promise<string> {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // Generate response using Gemini
            try {
                const chat = this.model.startChat({ history: this.conversationHistory.slice(0, -1) });
                // Log prompt size for debugging
                console.log('Sending chat request to Gemini; message length:', userMessage?.length || 0);
                const result = await chat.sendMessage(userMessage);
                const response = result.response.text();

                // Add AI response to history
                this.conversationHistory.push({
                    role: 'model',
                    parts: [{ text: response }]
                });

                // Keep conversation history manageable (last 20 messages)
                if (this.conversationHistory.length > 22) {
                    this.conversationHistory = [
                        this.conversationHistory[0],
                        this.conversationHistory[1],
                        ...this.conversationHistory.slice(-20)
                    ];
                }

                console.log('AI Response:', response);
                return response;
            } catch (inner) {
                console.error('Gemini chat/sendMessage error:', inner);
                console.error('Conversation history snapshot:', JSON.stringify(this.conversationHistory.slice(-10), null, 2));
                throw inner;
            }


        } catch (error) {
            console.error('Error getting AI response (top-level):', error);
            console.error('Last user message:', userMessage);
            console.error('Recent conversation history:', JSON.stringify(this.conversationHistory.slice(-10), null, 2));
            if (process.env.DEBUG_AI === 'true') {
                // Re-throw so controllers can include error details in dev responses
                throw error;
            }
            return "I apologize, I'm having trouble processing that. Could you please repeat?";
        }
    }

    // Strategist pipeline has been moved to strategistAIService to keep
    // conversational (call-based) flows separate from NestGPT strategist flows.

    sendAudioToDeepgram(audioData: Buffer) {
        if (this.deepgramLive) {
            this.deepgramLive.send(audioData);
        }
    }

    async generateAndSendTTS(text: string) {
        try {
            console.log('Generating TTS for:', text);
            
            // Prevent overlapping speech
            if (this.isSpeaking) {
                console.log('Already speaking, queuing or skipping...');
                return;
            }
            
            this.isSpeaking = true;
            
            // Use Deepgram TTS to generate audio
            const response = await this.deepgramClient.speak.request(
                { text },
                {
                    model: 'aura-asteria-en',
                    encoding: 'mulaw',
                    sample_rate: 8000,
                }
            );

            const stream = await response.getStream();
            if (stream) {
                const reader = stream.getReader();
                let audioChunks: Uint8Array[] = [];

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value) {
                        audioChunks.push(value);
                    }
                }

                // Combine all chunks
                const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
                const audioBuffer = new Uint8Array(totalLength);
                let offset = 0;
                for (const chunk of audioChunks) {
                    audioBuffer.set(chunk, offset);
                    offset += chunk.length;
                }

                console.log(`Generated ${audioBuffer.length} bytes of audio`);
                
                // Send audio back to Twilio
                await this.sendAudioToTwilio(Buffer.from(audioBuffer));
            }
            
            this.isSpeaking = false;
        } catch (error) {
            console.error('Error generating TTS:', error);
            this.isSpeaking = false;
        }
    }

    async sendAudioToTwilio(audioBuffer: Buffer) {
        if (!this.twilioWs || !this.streamSid) {
            console.error('Twilio WebSocket not initialized');
            return;
        }

        // Check WebSocket state
        if (this.twilioWs.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not open, state:', this.twilioWs.readyState);
            return;
        }

        console.log(`Sending ${audioBuffer.length} bytes to Twilio in chunks...`);
        
        // Send clear message first to clear any buffered audio
        const clearMessage = {
            event: 'clear',
            streamSid: this.streamSid
        };
        this.twilioWs.send(JSON.stringify(clearMessage));

        // Send audio in chunks with proper timing
        const chunkSize = 160; // 20ms of audio at 8kHz mulaw
        const chunkDelayMs = 20; // 20ms delay between chunks to match audio duration
        
        let chunkCount = 0;
        for (let i = 0; i < audioBuffer.length; i += chunkSize) {
            const chunk = audioBuffer.slice(i, Math.min(i + chunkSize, audioBuffer.length));
            const base64Audio = chunk.toString('base64');
            
            const mediaMessage = {
                event: 'media',
                streamSid: this.streamSid,
                media: {
                    payload: base64Audio
                }
            };
            
            this.twilioWs.send(JSON.stringify(mediaMessage));
            chunkCount++;
            
            // Add small delay to prevent overwhelming the WebSocket
            // Only delay between chunks, not after the last one
            if (i + chunkSize < audioBuffer.length) {
                await new Promise(resolve => setTimeout(resolve, chunkDelayMs));
            }
        }

        console.log(`Sent ${chunkCount} audio chunks to Twilio`);

        // Send mark event to signal completion
        const markMessage = {
            event: 'mark',
            streamSid: this.streamSid,
            mark: {
                name: 'audio_complete'
            }
        };
        this.twilioWs.send(JSON.stringify(markMessage));
    }

    close() {
        if (this.deepgramLive) {
            this.deepgramLive.finish();
        }
        this.twilioWs = null;
        this.streamSid = '';
        this.isSpeaking = false;
    }

    resetConversation() {
        this.conversationHistory = [
            {
                role: 'user',
                parts: [{ text: this.systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood! I\'m ready to have natural sales conversations.' }]
            }
        ];
    }
}

export default ConversationalAIService;
