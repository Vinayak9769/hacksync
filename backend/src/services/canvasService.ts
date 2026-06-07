import {
  CanvasState,
  CanvasLayer,
  CreateCanvasRequest,
  LayerBounds,
} from '../types/canvas';
import CanvasModel from '../models/canvasModel';

class CanvasService {
  private readonly cloudflareModel = '@cf/black-forest-labs/flux-1-schnell';

  private toCanvasState(doc: any): CanvasState {
    return {
      id: doc.canvasId,
      name: doc.name,
      width: doc.width,
      height: doc.height,
      aspectRatio: doc.aspectRatio,
      backgroundColor: doc.backgroundColor,
      primaryImagePrompt: doc.primaryImagePrompt,
      layers: doc.layers || [],
      version: doc.version || 1,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.getTime() : doc.createdAt || Date.now(),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.getTime() : doc.updatedAt || Date.now(),
      metadata: doc.metadata,
    };
  }

  /* =========================
     CANVAS CORE
  ========================== */

  async createCanvas(userId: string, request: CreateCanvasRequest): Promise<CanvasState> {
    const canvasId = this.generateId();
    const now = Date.now();
    const dimensions = this.getCanvasDimensions(request.aspectRatio || '1:1');

    // Create primary image layer
    const primaryLayer: CanvasLayer = {
      id: this.generateLayerId(),
      type: 'primary-image',
      name: 'Primary Image',
      zIndex: 0,
      bounds: { x: 0, y: 0, width: dimensions.width, height: dimensions.height },
      visible: true,
      locked: false,
      opacity: 1,
      imageData: {
        userPrompt: request.imagePrompt,
        generationStatus: 'pending',
      },
      createdAt: now,
      updatedAt: now,
    };

    const doc = await CanvasModel.create({
      userId,
      canvasId,
      name: request.name,
      width: dimensions.width,
      height: dimensions.height,
      aspectRatio: request.aspectRatio || '1:1',
      backgroundColor: '#ffffff',
      primaryImagePrompt: request.imagePrompt,
      layers: [primaryLayer],
      version: 1,
      metadata: {
        brandName: request.brandName,
        brandColors: request.brandColors,
      },
    });

    // Generate the primary image immediately (non-blocking)
    this.generateLayerImage(userId, canvasId, primaryLayer.id, request.imagePrompt).catch(error => {
      console.error('Failed to generate primary image:', error);
    });

    return this.toCanvasState(doc);
  }

  async createCanvasWithImage(
    userId: string,
    name: string,
    imageBuffer: Buffer,
    imageMimeType: string,
    aspectRatio?: string,
    brandName?: string,
    brandColors?: string[]
  ): Promise<CanvasState> {
    const canvasId = this.generateId();
    const dimensions = this.getCanvasDimensions(aspectRatio || '1:1');
    const now = Date.now();

    // Convert image buffer to base64 data URL
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:${imageMimeType};base64,${base64Image}`;

    const primaryLayer: CanvasLayer = {
      id: this.generateLayerId(),
      type: 'primary-image',
      name: 'Primary Image',
      zIndex: 0,
      bounds: { x: 0, y: 0, width: dimensions.width, height: dimensions.height },
      visible: true,
      locked: false,
      opacity: 1,
      imageData: {
        imageUrl,
        generationStatus: 'complete',
      },
      createdAt: now,
      updatedAt: now,
    };

    const doc = await CanvasModel.create({
      userId,
      canvasId,
      name,
      width: dimensions.width,
      height: dimensions.height,
      aspectRatio: aspectRatio || '1:1',
      backgroundColor: '#ffffff',
      layers: [primaryLayer],
      version: 1,
      metadata: {
        brandName,
        brandColors,
      },
    });

    return this.toCanvasState(doc);
  }

  async getCanvas(userId: string, canvasId: string): Promise<CanvasState | null> {
    const doc = await CanvasModel.findOne({ canvasId, userId });
    if (!doc) return null;
    return this.toCanvasState(doc);
  }

  async updateLayer(
    userId: string,
    canvasId: string,
    layerId: string,
    updates: Partial<CanvasLayer>
  ): Promise<CanvasState | null> {
    const doc = await CanvasModel.findOne({ canvasId, userId });
    if (!doc) return null;

    const layers = [...doc.layers];
    const idx = layers.findIndex(l => l.id === layerId);
    if (idx === -1) return null;

    layers[idx] = {
      ...layers[idx],
      ...updates,
      updatedAt: Date.now(),
    };

    doc.layers = layers;
    doc.version += 1;
    await doc.save();

    return this.toCanvasState(doc);
  }

  async addLayer(userId: string, canvasId: string, layerData: any): Promise<CanvasState | null> {
    const doc = await CanvasModel.findOne({ canvasId, userId });
    if (!doc) return null;

    const now = Date.now();
    const maxZIndex = doc.layers.reduce((max: number, l: any) => Math.max(max, l.zIndex || 0), 0);

    const newLayer: CanvasLayer = {
      id: this.generateLayerId(),
      type: layerData.layerType,
      name: layerData.name || `${layerData.layerType} ${doc.layers.length + 1}`,
      zIndex: maxZIndex + 1,
      bounds: {
        x: layerData.x || 100,
        y: layerData.y || 100,
        width: layerData.width || 200,
        height: layerData.height || 100,
      },
      visible: true,
      locked: false,
      opacity: 1,
      createdAt: now,
      updatedAt: now,
    };

    // Add layer-specific data
    if (layerData.layerType === 'text') {
      newLayer.textData = {
        text: layerData.text || 'New Text',
        fontSize: layerData.fontSize || 32,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: layerData.color || '#000000',
        align: 'center',
      };
    } else if (layerData.layerType === 'shape') {
      newLayer.shapeData = {
        shapeType: layerData.shapeType || 'rectangle',
        fillColor: layerData.fillColor || '#3b82f6',
        strokeColor: layerData.strokeColor,
        strokeWidth: layerData.strokeWidth || 0,
      };
    }

    doc.layers.push(newLayer);
    doc.version += 1;
    await doc.save();

    return this.toCanvasState(doc);
  }

  async deleteLayer(userId: string, canvasId: string, layerId: string): Promise<CanvasState | null> {
    const doc = await CanvasModel.findOne({ canvasId, userId });
    if (!doc) return null;

    const layer = doc.layers.find((l: any) => l.id === layerId);
    if (!layer) return null;

    if (layer.type === 'primary-image') {
      throw new Error('Cannot delete primary image layer');
    }

    doc.layers = doc.layers.filter((l: any) => l.id !== layerId);
    doc.version += 1;
    await doc.save();

    return this.toCanvasState(doc);
  }

  /* =========================
     IMAGE GENERATION (Cloudflare Workers AI)
  ========================== */

  async generateLayerImage(
    userId: string,
    canvasId: string,
    layerId: string,
    userPrompt?: string
  ): Promise<{ imageUrl: string; prompt: string }> {
    const doc = await CanvasModel.findOne({ canvasId, userId });
    if (!doc) throw new Error('Canvas not found');

    const layer = doc.layers.find((l: any) => l.id === layerId);
    if (!layer) throw new Error('Layer not found');

    const prompt = userPrompt || layer.imageData?.userPrompt || 'A beautiful image';

    await this.updateLayer(userId, canvasId, layerId, {
      imageData: {
        ...layer.imageData,
        userPrompt: prompt,
        generationStatus: 'generating'
      },
    });

    try {
      const imageUrl = await this.generateImageViaCloudflare(prompt, layer.bounds);

      await this.updateLayer(userId, canvasId, layerId, {
        imageData: {
          imageUrl,
          userPrompt: prompt,
          generationStatus: 'complete',
        },
      });

      return { imageUrl, prompt };
    } catch (err: any) {
      await this.updateLayer(userId, canvasId, layerId, {
        imageData: {
          ...layer.imageData,
          generationStatus: 'error',
          errorMessage: err.message,
        },
      });
      throw err;
    }
  }

  private async generateImageViaCloudflare(
    prompt: string,
    bounds: LayerBounds
  ): Promise<string> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId) {
      throw new Error('CLOUDFLARE_ACCOUNT_ID not set');
    }

    if (!apiToken) {
      throw new Error('CLOUDFLARE_API_TOKEN not set');
    }

    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${this.cloudflareModel}`;
    const promptWithLayout = this.addLayoutHint(prompt, bounds);
    const steps = this.getCloudflareSteps(bounds);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptWithLayout,
        steps,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare image generation failed: ${errorText}`);
    }

    const result = await response.json() as {
      result?: { image?: string } | Array<{ image?: string }>;
      success?: boolean;
      errors?: Array<{ message?: string }>;
    };

    const imageBase64 = Array.isArray(result.result)
      ? result.result[0]?.image
      : result.result?.image;

    if (!imageBase64) {
      throw new Error('Cloudflare returned no image data');
    }

    return `data:image/jpeg;base64,${imageBase64}`;
  }

  /* =========================
     HELPERS
  ========================== */

  private addLayoutHint(prompt: string, bounds: LayerBounds): string {
    const orientation = bounds.width > bounds.height ? 'landscape' : bounds.width < bounds.height ? 'portrait' : 'square';
    return `${prompt}. Generate a ${orientation} image composition.`;
  }

  private getCloudflareSteps(bounds: LayerBounds): number {
    const ratio = bounds.width / bounds.height;
    if (ratio > 1.6 || ratio < 0.7) {
      return 6;
    }
    return 4;
  }

  private generateId(): string {
    return `canvas_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  private generateLayerId(): string {
    return `layer_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  private getCanvasDimensions(aspectRatio: string) {
    const map: any = {
      '1:1': { width: 1080, height: 1080 },
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
    };
    return map[aspectRatio] || map['1:1'];
  }

  /* =========================
     CANVAS MANAGEMENT
  ========================== */

  async getAllCanvases(userId: string): Promise<CanvasState[]> {
    const docs = await CanvasModel.find({ userId }).sort({ updatedAt: -1 });
    return docs.map(doc => this.toCanvasState(doc));
  }

  async deleteCanvas(userId: string, canvasId: string): Promise<boolean> {
    const result = await CanvasModel.deleteOne({ canvasId, userId });
    return result.deletedCount > 0;
  }

  async exportCanvasState(userId: string, canvasId: string): Promise<string | null> {
    const doc = await CanvasModel.findOne({ canvasId, userId }).lean();
    if (!doc) return null;
    return JSON.stringify(this.toCanvasState(doc), null, 2);
  }

  async importCanvasState(userId: string, jsonState: string): Promise<CanvasState> {
    const canvas: CanvasState = JSON.parse(jsonState);
    const doc = await CanvasModel.findOneAndUpdate(
      { canvasId: canvas.id, userId },
      {
        userId,
        canvasId: canvas.id,
        name: canvas.name,
        width: canvas.width,
        height: canvas.height,
        aspectRatio: canvas.aspectRatio,
        backgroundColor: canvas.backgroundColor,
        primaryImagePrompt: canvas.primaryImagePrompt,
        layers: canvas.layers,
        version: canvas.version,
        metadata: canvas.metadata,
      },
      { upsert: true, new: true }
    );
    return this.toCanvasState(doc);
  }

  /* =========================
     AI TEXT GENERATION
  ========================== */

  async generateTextWithAI(prompt: string, context?: any): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set');
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1000,
      },
    });

    let fullPrompt = `Generate compelling marketing text based on this request: "${prompt}".`;
    
    if (context?.canvasName) {
      fullPrompt += ` This is for a canvas titled "${context.canvasName}".`;
    }
    
    if (context?.brandName) {
      fullPrompt += ` Brand: ${context.brandName}.`;
    }

    fullPrompt += ` Keep it concise, impactful, and suitable for a visual design.
Return ONLY the text content, no explanations or formatting markers.`;

    const res = await model.generateContent(fullPrompt);
    return res.response.text().trim();
  }

  /**
   * Generate AI element (icon or sticker)
   */
  async generateElement(
    userId: string,
    canvasId: string,
    elementType: 'icon' | 'sticker',
    prompt: string,
    bounds: LayerBounds
  ): Promise<CanvasState> {
    const doc = await CanvasModel.findOne({ canvasId, userId });
    if (!doc) throw new Error('Canvas not found');

    const now = Date.now();
    const maxZIndex = doc.layers.reduce((max: number, l: any) => Math.max(max, l.zIndex || 0), 0);

    const elementLayer: CanvasLayer = {
      id: this.generateLayerId(),
      type: elementType,
      name: `${elementType === 'icon' ? 'Icon' : 'Sticker'} Element`,
      zIndex: maxZIndex + 1,
      bounds,
      visible: true,
      locked: false,
      opacity: 1,
      imageData: {
        userPrompt: prompt,
        generationStatus: 'generating',
      },
      createdAt: now,
      updatedAt: now,
    };

    doc.layers.push(elementLayer);
    doc.version += 1;
    await doc.save();

    // Generate the element image (non-blocking)
    const elementPrompt = `${prompt}, ${elementType === 'icon' ? 'simple icon design, minimal, clean, transparent background' : 'sticker design, fun, colorful, transparent background'}`;
    this.generateImageViaCloudflare(elementPrompt, bounds)
      .then(async imageUrl => {
        await this.updateLayer(userId, canvasId, elementLayer.id, {
          imageData: {
            imageUrl,
            userPrompt: prompt,
            generationStatus: 'complete',
          },
        });
      })
      .catch(async error => {
        console.error('Failed to generate element image:', error);
        await this.updateLayer(userId, canvasId, elementLayer.id, {
          imageData: {
            ...elementLayer.imageData,
            generationStatus: 'error',
            errorMessage: (error as Error).message,
          },
        });
      });

    return this.toCanvasState(doc);
  }
}

export default new CanvasService();
