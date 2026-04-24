import {
  CanvasState,
  CanvasLayer,
  CreateCanvasRequest,
  LayerBounds,
} from '../types/canvas';

class CanvasService {
  private canvasStore: Map<string, CanvasState> = new Map();

  private readonly cloudflareModel = '@cf/black-forest-labs/flux-1-schnell';

  /* =========================
     CANVAS CORE
  ========================== */

  async createCanvas(request: CreateCanvasRequest): Promise<CanvasState> {
    const canvasId = this.generateId();
    const now = Date.now();
    const dimensions = this.getCanvasDimensions(request.aspectRatio || '1:1');

    // Create canvas with primary image layer
    const canvas: CanvasState = {
      id: canvasId,
      name: request.name,
      width: dimensions.width,
      height: dimensions.height,
      aspectRatio: request.aspectRatio || '1:1',
      backgroundColor: '#ffffff',
      primaryImagePrompt: request.imagePrompt,
      layers: [],
      version: 1,
      createdAt: now,
      updatedAt: now,
      metadata: {
        brandName: request.brandName,
        brandColors: request.brandColors,
      },
    };

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

    canvas.layers.push(primaryLayer);
    this.canvasStore.set(canvasId, canvas);

    // Generate the primary image immediately
    try {
      await this.generateLayerImage(canvasId, primaryLayer.id, request.imagePrompt);
    } catch (error) {
      console.error('Failed to generate primary image:', error);
      // Canvas is still created, just with pending image
    }

    return this.canvasStore.get(canvasId) || canvas;
  }

  async createCanvasWithImage(
    name: string,
    imageBuffer: Buffer,
    imageMimeType: string,
    aspectRatio?: string,
    brandName?: string,
    brandColors?: string[]
  ): Promise<CanvasState> {
    const canvasId = this.generateId();
    const now = Date.now();
    const dimensions = this.getCanvasDimensions(aspectRatio || '1:1');

    // Convert image buffer to base64 data URL
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:${imageMimeType};base64,${base64Image}`;

    // Create canvas with uploaded image
    const canvas: CanvasState = {
      id: canvasId,
      name,
      width: dimensions.width,
      height: dimensions.height,
      aspectRatio: aspectRatio || '1:1',
      backgroundColor: '#ffffff',
      layers: [],
      version: 1,
      createdAt: now,
      updatedAt: now,
      metadata: {
        brandName,
        brandColors,
      },
    };

    // Create primary image layer with uploaded image
    // The bounds will be adjusted by the frontend renderer to fit the canvas
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

    canvas.layers.push(primaryLayer);
    this.canvasStore.set(canvasId, canvas);

    return canvas;
  }

  getCanvas(canvasId: string): CanvasState | null {
    return this.canvasStore.get(canvasId) || null;
  }

  updateLayer(
    canvasId: string,
    layerId: string,
    updates: Partial<CanvasLayer>
  ): CanvasState | null {
    const canvas = this.canvasStore.get(canvasId);
    if (!canvas) return null;

    const idx = canvas.layers.findIndex(l => l.id === layerId);
    if (idx === -1) return null;

    canvas.layers[idx] = {
      ...canvas.layers[idx],
      ...updates,
      updatedAt: Date.now(),
    };

    canvas.updatedAt = Date.now();
    canvas.version += 1;
    this.canvasStore.set(canvasId, canvas);
    return canvas;
  }

  addLayer(canvasId: string, layerData: any): CanvasState | null {
    const canvas = this.canvasStore.get(canvasId);
    if (!canvas) return null;

    const now = Date.now();
    const maxZIndex = canvas.layers.reduce((max, l) => Math.max(max, l.zIndex), 0);

    const newLayer: CanvasLayer = {
      id: this.generateLayerId(),
      type: layerData.layerType,
      name: layerData.name || `${layerData.layerType} ${canvas.layers.length + 1}`,
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

    canvas.layers.push(newLayer);
    canvas.updatedAt = now;
    canvas.version += 1;
    this.canvasStore.set(canvasId, canvas);

    return canvas;
  }

  deleteLayer(canvasId: string, layerId: string): CanvasState | null {
    const canvas = this.canvasStore.get(canvasId);
    if (!canvas) return null;

    const layer = canvas.layers.find(l => l.id === layerId);
    if (!layer) return null;

    // Don't allow deleting primary image
    if (layer.type === 'primary-image') {
      throw new Error('Cannot delete primary image layer');
    }

    canvas.layers = canvas.layers.filter(l => l.id !== layerId);
    canvas.updatedAt = Date.now();
    canvas.version += 1;
    this.canvasStore.set(canvasId, canvas);

    return canvas;
  }

  /* =========================
     PROMPT GENERATION (Gemini)
  ========================== */

  /* =========================
     IMAGE GENERATION (Cloudflare Workers AI)
  ========================== */

  async generateLayerImage(
    canvasId: string,
    layerId: string,
    userPrompt?: string
  ): Promise<{ imageUrl: string; prompt: string }> {
    const canvas = this.canvasStore.get(canvasId);
    if (!canvas) throw new Error('Canvas not found');

    const layer = canvas.layers.find(l => l.id === layerId);
    if (!layer) throw new Error('Layer not found');

    // Use provided prompt or the layer's existing prompt
    const prompt = userPrompt || layer.imageData?.userPrompt || 'A beautiful image';

    this.updateLayer(canvasId, layerId, {
      imageData: {
        ...layer.imageData,
        userPrompt: prompt,
        generationStatus: 'generating'
      },
    });

    try {
      const imageUrl = await this.generateImageViaCloudflare(prompt, layer.bounds);

      this.updateLayer(canvasId, layerId, {
        imageData: {
          imageUrl,
          userPrompt: prompt,
          generationStatus: 'complete',
        },
      });

      return { imageUrl, prompt };
    } catch (err: any) {
      this.updateLayer(canvasId, layerId, {
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

  getAllCanvases(): CanvasState[] {
    return Array.from(this.canvasStore.values());
  }

  deleteCanvas(canvasId: string): boolean {
    return this.canvasStore.delete(canvasId);
  }

  exportCanvasState(canvasId: string): string | null {
    const canvas = this.canvasStore.get(canvasId);
    if (!canvas) return null;
    return JSON.stringify(canvas, null, 2);
  }

  importCanvasState(jsonState: string): CanvasState {
    const canvas: CanvasState = JSON.parse(jsonState);
    this.canvasStore.set(canvas.id, canvas);
    return canvas;
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
    canvasId: string,
    elementType: 'icon' | 'sticker',
    prompt: string,
    bounds: LayerBounds
  ): Promise<CanvasState> {
    const canvas = this.canvasStore.get(canvasId);
    if (!canvas) throw new Error('Canvas not found');

    const now = Date.now();
    const maxZIndex = canvas.layers.reduce((max, l) => Math.max(max, l.zIndex), 0);

    // Create element layer
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

    canvas.layers.push(elementLayer);
    canvas.updatedAt = now;
    canvas.version += 1;
    this.canvasStore.set(canvasId, canvas);

    // Generate the element image
    try {
      // For icons/stickers, use a smaller size and more focused prompt
      const elementPrompt = `${prompt}, ${elementType === 'icon' ? 'simple icon design, minimal, clean, transparent background' : 'sticker design, fun, colorful, transparent background'}`;
      const imageUrl = await this.generateImageViaCloudflare(elementPrompt, bounds);

      this.updateLayer(canvasId, elementLayer.id, {
        imageData: {
          imageUrl,
          userPrompt: prompt,
          generationStatus: 'complete',
        },
      });
    } catch (error) {
      console.error('Failed to generate element image:', error);
      this.updateLayer(canvasId, elementLayer.id, {
        imageData: {
          ...elementLayer.imageData,
          generationStatus: 'error',
          errorMessage: (error as Error).message,
        },
      });
      throw error;
    }

    return this.canvasStore.get(canvasId) || canvas;
  }
}

export default new CanvasService();
