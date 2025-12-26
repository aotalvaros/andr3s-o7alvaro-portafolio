const { fetchNasaPhotoOfTheDay } = await import('@/services/nasa/nasa.service');
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { httpClient } from '@/core/infrastructure/http/httpClientFactory';


// CRITICAL: Use vi.hoisted() to hoist mock functions before vi.mock()
const { mockGet, mockPost, mockPut, mockDelete, mockPatch } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
  mockPatch: vi.fn(),
}));

// Mock httpClient factory
vi.mock('@/core/infrastructure/http/httpClientFactory', () => ({
  httpClient: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    patch: mockPatch,
  },
}));

describe('NASA Photo of the Day Service', () => {
  const originalEnv = process.env.NEXT_PUBLIC_NASA_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules(); // Reset module cache to re-evaluate env variables
  });

  afterEach(() => {
    // Restore original environment variable
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_NASA_API_KEY = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_NASA_API_KEY;
    }
  });

  describe('fetchNasaPhotoOfTheDay - Success cases', () => {
    it('should fetch NASA photo of the day successfully', async () => {
      
      const mockResponse = {
        copyright: 'John Doe',
        date: '2025-12-22',
        explanation: 'An amazing view of the cosmos...',
        hdurl: 'https://apod.nasa.gov/apod/image/2512/cosmos_hd.jpg',
        media_type: 'image',
        service_version: 'v1',
        title: 'The Cosmos',
        url: 'https://apod.nasa.gov/apod/image/2512/cosmos.jpg'
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await fetchNasaPhotoOfTheDay() as typeof  mockResponse;

      expect(result).toEqual(mockResponse);
      expect(result.media_type).toBe('image');
      expect(result.url).toBeDefined();
    });

    it('should call the correct NASA APOD endpoint', async () => {
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      const callArgs = mockGet.mock.calls[0];
      expect(callArgs[0]).toBe('https://api.nasa.gov/planetary/apod');
    });

    it('should include api_key in params', async () => {
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      expect(mockGet).toHaveBeenCalledWith(
        'https://api.nasa.gov/planetary/apod',
        expect.objectContaining({
          params: expect.objectContaining({
            api_key: expect.any(String)
          })
        })
      );
    });

    it('should handle image media type', async () => {
      
      const imageResponse = {
        date: '2025-12-22',
        media_type: 'image',
        url: 'https://example.com/image.jpg',
        hdurl: 'https://example.com/image_hd.jpg',
        title: 'Beautiful Space',
        explanation: 'A stunning image'
      };

      mockGet.mockResolvedValue(imageResponse);

      const result = await fetchNasaPhotoOfTheDay() as typeof imageResponse;

      expect(result.media_type).toBe('image');
      expect(result.url).toBeDefined();
      expect(result.hdurl).toBeDefined();
    });

    it('should handle video media type', async () => {
      
      const videoResponse = {
        date: '2025-12-22',
        media_type: 'video',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        title: 'Space Video',
        explanation: 'An amazing video from space'
      };

      mockGet.mockResolvedValue(videoResponse);

      const result = await fetchNasaPhotoOfTheDay() as typeof videoResponse;

      expect(result.media_type).toBe('video');
      expect(result.url).toContain('youtube.com');
    });

    it('should return data with copyright information when available', async () => {
      
      const responseWithCopyright = {
        copyright: 'NASA/ESA',
        date: '2025-12-22',
        title: 'Copyrighted Image',
        url: 'https://example.com/image.jpg',
        explanation: 'This image has copyright info'
      };

      mockGet.mockResolvedValue(responseWithCopyright);

      const result = await fetchNasaPhotoOfTheDay() as typeof responseWithCopyright;

      expect(result.copyright).toBe('NASA/ESA');
    });

    it('should return complete APOD data structure', async () => {
      
      const completeResponse = {
        copyright: 'Photographer Name',
        date: '2025-12-22',
        explanation: 'A detailed explanation of today\'s astronomical picture...',
        hdurl: 'https://apod.nasa.gov/apod/image/2512/picture_hd.jpg',
        media_type: 'image',
        service_version: 'v1',
        title: 'Today\'s Amazing Space Picture',
        url: 'https://apod.nasa.gov/apod/image/2512/picture.jpg'
      };

      mockGet.mockResolvedValue(completeResponse);

      const result = await fetchNasaPhotoOfTheDay();

      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('explanation');
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('media_type');
    });
  });

  describe('fetchNasaPhotoOfTheDay - API Key handling', () => {

    it('should fallback to DEMO_KEY when environment variable is not set', async () => {
      delete process.env.NEXT_PUBLIC_NASA_API_KEY;
      vi.resetModules();
      
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      expect(mockGet).toHaveBeenCalledWith(
        'https://api.nasa.gov/planetary/apod',
        expect.objectContaining({
          params: {
            api_key: 'DEMO_KEY'
          }
        })
      );
    });

    it('should fallback to DEMO_KEY when environment variable is empty string', async () => {
      process.env.NEXT_PUBLIC_NASA_API_KEY = '';
      vi.resetModules();
      
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      expect(mockGet).toHaveBeenCalledWith(
        'https://api.nasa.gov/planetary/apod',
        expect.objectContaining({
          params: {
            api_key: 'DEMO_KEY'
          }
        })
      );
    });

    it('should fallback to DEMO_KEY when environment variable is null', async () => {
      process.env.NEXT_PUBLIC_NASA_API_KEY = null as any;
      vi.resetModules();
      
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      expect(mockGet).toHaveBeenCalledWith(
        'https://api.nasa.gov/planetary/apod',
        expect.objectContaining({
          params: {
            api_key: 'DEMO_KEY'
          }
        })
      );
    });

    it('should fallback to DEMO_KEY when environment variable is undefined', async () => {
      process.env.NEXT_PUBLIC_NASA_API_KEY = undefined;
      vi.resetModules();
      
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      expect(mockGet).toHaveBeenCalledWith(
        'https://api.nasa.gov/planetary/apod',
        expect.objectContaining({
          params: {
            api_key: 'DEMO_KEY'
          }
        })
      );
    });
  });

  describe('fetchNasaPhotoOfTheDay - Error handling', () => {
    it('should propagate network errors', async () => {
      
      const networkError = new Error('Network error');
      mockGet.mockRejectedValue(networkError);

      await expect(fetchNasaPhotoOfTheDay()).rejects.toThrow('Network error');
    });

    it('should propagate 403 forbidden errors (invalid API key)', async () => {
      
      const forbiddenError = new Error('API key is invalid');
      mockGet.mockRejectedValue(forbiddenError);

      await expect(fetchNasaPhotoOfTheDay()).rejects.toThrow('API key is invalid');
    });

    it('should propagate 429 rate limit errors', async () => {
      
      const rateLimitError = new Error('Rate limit exceeded');
      mockGet.mockRejectedValue(rateLimitError);

      await expect(fetchNasaPhotoOfTheDay()).rejects.toThrow('Rate limit exceeded');
    });

    it('should propagate 500 NASA server errors', async () => {
      
      const serverError = new Error('NASA API is temporarily unavailable');
      mockGet.mockRejectedValue(serverError);

      await expect(fetchNasaPhotoOfTheDay()).rejects.toThrow('NASA API is temporarily unavailable');
    });

    it('should propagate 503 service unavailable errors', async () => {
      
      const unavailableError = new Error('Service temporarily unavailable');
      mockGet.mockRejectedValue(unavailableError);

      await expect(fetchNasaPhotoOfTheDay()).rejects.toThrow('Service temporarily unavailable');
    });

    it('should propagate timeout errors', async () => {
      
      const timeoutError = new Error('Request timeout');
      mockGet.mockRejectedValue(timeoutError);

      await expect(fetchNasaPhotoOfTheDay()).rejects.toThrow('Request timeout');
    });

    it('should propagate DNS resolution errors', async () => {
      
      const dnsError = new Error('DNS resolution failed');
      mockGet.mockRejectedValue(dnsError);

      await expect(fetchNasaPhotoOfTheDay()).rejects.toThrow('DNS resolution failed');
    });
  });

  describe('fetchNasaPhotoOfTheDay - Integration with httpClient', () => {
    it('should use only GET method', async () => {
      
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      expect(mockGet).toHaveBeenCalled();
      expect(mockPost).not.toHaveBeenCalled();
      expect(mockPut).not.toHaveBeenCalled();
      expect(mockDelete).not.toHaveBeenCalled();
      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('should be called exactly once', async () => {
      
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('should use absolute URL instead of relative path', async () => {
      
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      const url = mockGet.mock.calls[0][0];
      expect(url).toMatch(/^https:\/\//);
      expect(url).toContain('api.nasa.gov');
    });

    it('should pass params as second argument', async () => {
      
      mockGet.mockResolvedValue({});

      await fetchNasaPhotoOfTheDay();

      const callArgs = mockGet.mock.calls[0];
      expect(callArgs).toHaveLength(2);
      expect(callArgs[1]).toHaveProperty('params');
    });
  });

  describe('fetchNasaPhotoOfTheDay - External API behavior', () => {
    it('should handle successful response from NASA API', async () => {
      
      const nasaResponse = {
        date: '2025-12-22',
        explanation: 'The Crab Nebula is cataloged as M1...',
        hdurl: 'https://apod.nasa.gov/apod/image/2512/crab_nebula.jpg',
        media_type: 'image',
        service_version: 'v1',
        title: 'The Crab Nebula',
        url: 'https://apod.nasa.gov/apod/image/2512/crab_nebula_small.jpg'
      };

      mockGet.mockResolvedValue(nasaResponse);

      const result = await fetchNasaPhotoOfTheDay() as typeof nasaResponse;

      expect(result.title).toBe('The Crab Nebula');
      expect(result.date).toBe('2025-12-22');
    });

    it('should handle long explanations from NASA', async () => {
      
      const longExplanation = 'A'.repeat(5000);
      const response = {
        date: '2025-12-22',
        explanation: longExplanation,
        title: 'Test',
        url: 'https://example.com/image.jpg'
      };

      mockGet.mockResolvedValue(response);

      const result = await fetchNasaPhotoOfTheDay() as typeof response;

      expect(result.explanation).toHaveLength(5000);
    });

    it('should handle YouTube embedded videos', async () => {
      
      const videoResponse = {
        date: '2025-12-22',
        media_type: 'video',
        url: 'https://www.youtube.com/embed/someVideoId',
        title: 'Space Documentary',
        explanation: 'An educational video about space'
      };

      mockGet.mockResolvedValue(videoResponse);

      const result = await fetchNasaPhotoOfTheDay() as typeof videoResponse;

      expect(result.url).toContain('youtube.com/embed');
      expect(result.media_type).toBe('video');
    });

    it('should handle Vimeo embedded videos', async () => {
      
      const vimeoResponse = {
        date: '2025-12-22',
        media_type: 'video',
        url: 'https://player.vimeo.com/video/123456789',
        title: 'Space Video',
        explanation: 'A video hosted on Vimeo'
      };

      mockGet.mockResolvedValue(vimeoResponse);

      const result = await fetchNasaPhotoOfTheDay() as typeof vimeoResponse;

      expect(result.url).toContain('vimeo.com');
    });
  });

  describe('fetchNasaPhotoOfTheDay - Edge cases', () => {
    it('should handle response with additional unexpected fields', async () => {
      
      const extendedResponse = {
        date: '2025-12-22',
        title: 'Test',
        url: 'https://example.com/image.jpg',
        explanation: 'Test explanation',
        custom_field: 'custom_value',
        metadata: { source: 'telescope' }
      };

      mockGet.mockResolvedValue(extendedResponse);

      const result = await fetchNasaPhotoOfTheDay();

      expect(result).toEqual(extendedResponse);
    });

    it('should handle special characters in title', async () => {
      
      const response = {
        date: '2025-12-22',
        title: 'Nebula M1 & NGC 1952: The "Crab" Supernova',
        url: 'https://example.com/image.jpg',
        explanation: 'Special characters test'
      };

      mockGet.mockResolvedValue(response);

      const result = await fetchNasaPhotoOfTheDay() as typeof response;

      expect(result.title).toContain('&');
      expect(result.title).toContain('"');
    });

    it('should handle Unicode characters in explanation', async () => {
      
      const response = {
        date: '2025-12-22',
        title: 'Test',
        url: 'https://example.com/image.jpg',
        explanation: 'Contains unicode: 🌌 ✨ 🚀 α Centauri'
      };

      mockGet.mockResolvedValue(response);

      const result = await fetchNasaPhotoOfTheDay() as typeof response;

      expect(result.explanation).toContain('🌌');
      expect(result.explanation).toContain('α');
    });

    it('should handle multiple consecutive requests', async () => {
      
      mockGet.mockResolvedValue({ date: '2025-12-22' });

      await fetchNasaPhotoOfTheDay();
      await fetchNasaPhotoOfTheDay();
      await fetchNasaPhotoOfTheDay();

      expect(mockGet).toHaveBeenCalledTimes(3);
    });

    it('should handle parallel requests', async () => {
      
      mockGet.mockResolvedValue({ date: '2025-12-22' });

      const promises = [
        fetchNasaPhotoOfTheDay(),
        fetchNasaPhotoOfTheDay(),
        fetchNasaPhotoOfTheDay()
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(mockGet).toHaveBeenCalledTimes(3);
    });
  });

  describe('fetchNasaPhotoOfTheDay - Real-world scenarios', () => {
    it('should work with DEMO_KEY for development', async () => {
      delete process.env.NEXT_PUBLIC_NASA_API_KEY;
      vi.resetModules();
      

      const mockResponse = {
        date: '2025-12-22',
        title: 'Demo Response',
        url: 'https://example.com/demo.jpg'
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await fetchNasaPhotoOfTheDay();

      expect(result).toBeDefined();
      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { api_key: 'DEMO_KEY' }
        })
      );
    });
  });
});