// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface PostData {
  platform: string;
  content: {
    caption?: string;
    mediaUrl?: string;
    message?: string;
  };
  pageId?: string;
}

export interface PostResponse {
  success: boolean;
  platform?: string;
  data?: any;
  message?: string;
  error?: string;
}

export interface HealthCheckResponse {
  success: boolean;
  integrations: {
    [key: string]: {
      configured: boolean;
      status: string;
    };
  };
}

export interface FacebookPageInfo {
  success: boolean;
  data?: {
    id: string;
    name: string;
    fan_count: number;
  };
  error?: string;
}

class SocialMediaAPI {
  /**
   * Create a post on a social media platform
   */
  async createPost(postData: PostData): Promise<PostResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/social/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      return data;
    } catch (error: any) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Check health status of social media integrations
   */
  async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/social/health`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to check health status');
      }

      return data;
    } catch (error: any) {
      console.error('Error checking health:', error);
      throw error;
    }
  }

  /**
   * Validate Facebook access token
   */
  async validateFacebookToken(): Promise<{ success: boolean; valid: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/social/facebook/validate`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to validate token');
      }

      return data;
    } catch (error: any) {
      console.error('Error validating Facebook token:', error);
      throw error;
    }
  }

  /**
   * Get Facebook page information
   */
  async getFacebookPageInfo(pageId?: string): Promise<FacebookPageInfo> {
    try {
      const url = pageId 
        ? `${API_BASE_URL}/social/facebook/page-info?pageId=${pageId}`
        : `${API_BASE_URL}/social/facebook/page-info`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get page info');
      }

      return data;
    } catch (error: any) {
      console.error('Error getting Facebook page info:', error);
      throw error;
    }
  }

  /**
   * Post to Facebook specifically
   */
  async postToFacebook(caption: string, mediaUrl?: string): Promise<PostResponse> {
    return this.createPost({
      platform: 'facebook',
      content: {
        caption,
        mediaUrl,
      },
    });
  }

  /**
   * Post to multiple platforms
   */
  async postToMultiplePlatforms(
    platforms: string[],
    captions: Record<string, string>,
    mediaUrls?: Record<string, string>
  ): Promise<{ platform: string; result: PostResponse }[]> {
    const results = await Promise.allSettled(
      platforms.map(async (platform) => {
        const caption = captions[platform];
        const mediaUrl = mediaUrls?.[platform];

        const result = await this.createPost({
          platform,
          content: {
            caption,
            mediaUrl,
          },
        });

        return { platform, result };
      })
    );

    return results
      .filter((r): r is PromiseFulfilledResult<{ platform: string; result: PostResponse }> => 
        r.status === 'fulfilled'
      )
      .map((r) => r.value);
  }
}

export default new SocialMediaAPI();
