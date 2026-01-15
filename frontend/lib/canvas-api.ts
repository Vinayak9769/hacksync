import { CanvasState, CreateCanvasRequest, CanvasLayer, AddLayerRequest } from './canvas-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class CanvasAPI {
  /**
   * Create a new canvas
   */
  async createCanvas(request: CreateCanvasRequest): Promise<{ success: boolean; canvas: CanvasState }> {
    const response = await fetch(`${API_BASE_URL}/canvas/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create canvas');
    }

    return response.json();
  }

  /**
   * Get canvas by ID
   */
  async getCanvas(id: string): Promise<{ success: boolean; canvas: CanvasState }> {
    const response = await fetch(`${API_BASE_URL}/canvas/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get canvas');
    }

    return response.json();
  }

  /**
   * List all canvases
   */
  async listCanvases(): Promise<{ success: boolean; count: number; canvases: CanvasState[] }> {
    const response = await fetch(`${API_BASE_URL}/canvas/list`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to list canvases');
    }

    return response.json();
  }

  /**
   * Update layer properties
   */
  async updateLayer(
    canvasId: string,
    layerId: string,
    updates: Partial<CanvasLayer>
  ): Promise<{ success: boolean; canvas: CanvasState }> {
    const response = await fetch(`${API_BASE_URL}/canvas/${canvasId}/layer/${layerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update layer');
    }

    return response.json();
  }

  /**
   * Add a new layer to a canvas
   */
  async addLayer(
    canvasId: string,
    layerData: Omit<AddLayerRequest, 'canvasId'>
  ): Promise<{ success: boolean; layer: CanvasLayer; canvas: CanvasState }> {
    const response = await fetch(`${API_BASE_URL}/canvas/${canvasId}/add-layer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(layerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add layer');
    }

    return response.json();
  }

  /**
   * Delete a layer from a canvas
   */
  async deleteLayer(
    canvasId: string,
    layerId: string
  ): Promise<{ success: boolean; canvas: CanvasState }> {
    const response = await fetch(`${API_BASE_URL}/canvas/${canvasId}/layer/${layerId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete layer');
    }

    return response.json();
  }

  /**
   * Generate image for a layer
   */
  async generateLayerImage(
    canvasId: string,
    layerId: string,
    customPrompt?: string
  ): Promise<{ success: boolean; imageUrl: string; prompt: string; canvas: CanvasState }> {
    const response = await fetch(`${API_BASE_URL}/canvas/${canvasId}/layer/${layerId}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customPrompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate layer image');
    }

    return response.json();
  }

  /**
   * Regenerate a specific layer
   */
  async regenerateLayer(
    canvasId: string,
    layerId: string,
    userPrompt?: string
  ): Promise<{ success: boolean; imageUrl: string; prompt: string; canvas: CanvasState }> {
    const response = await fetch(`${API_BASE_URL}/canvas/regenerate-layer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canvasId, layerId, userPrompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to regenerate layer');
    }

    return response.json();
  }

  /**
   * Export canvas as JSON
   */
  async exportCanvas(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/canvas/${id}/export`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to export canvas');
    }

    return response.blob();
  }

  /**
   * Import canvas from JSON
   */
  async importCanvas(jsonState: string): Promise<{ success: boolean; canvas: CanvasState }> {
    const response = await fetch(`${API_BASE_URL}/canvas/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonState }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to import canvas');
    }

    return response.json();
  }

  /**
   * Delete canvas
   */
  async deleteCanvas(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/canvas/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete canvas');
    }

    return response.json();
  }
}

export default new CanvasAPI();
