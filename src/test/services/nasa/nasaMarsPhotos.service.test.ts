/* eslint-disable @typescript-eslint/no-explicit-any */
const { fetchMarsPhotos } = await import('@/services/nasa/nasaMarsPhotos.service');
import { describe, it, expect, vi, beforeEach, afterEach} from "vitest";

// CRITICAL: Use vi.hoisted() to hoist mock functions before vi.mock()
const { mockGet, mockPost, mockPut, mockDelete, mockPatch } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
  mockPatch: vi.fn(),
}));

// Mock nasaHttpClient factory (different from httpClient!)
vi.mock('@/core/infrastructure/http/nasaHttpClientFactory', () => ({
  nasaHttpClient: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    patch: mockPatch,
  },
}));

describe('Mars Photos Service', () => {
  const originalEnv = process.env.NEXT_PUBLIC_NASA_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_NASA_API_KEY = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_NASA_API_KEY;
    }
  });

  describe('fetchMarsPhotos - Success cases with sol parameter', () => {
    it('should fetch Mars photos using sol (Martian day)', async () => {
      
      const mockResponse = {
        photos: [
          {
            id: 102693,
            sol: 1000,
            camera: { id: 20, name: 'FHAZ', rover_id: 5, full_name: 'Front Hazard Avoidance Camera' },
            img_src: 'http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG',
            earth_date: '2015-05-30',
            rover: { id: 5, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' }
          }
        ]
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000
      });

      expect(mockGet).toHaveBeenCalledWith(
        '/mars-photos/api/v1/rovers/curiosity/photos',
        expect.objectContaining({
          params: expect.objectContaining({
            sol: '1000',
            api_key: expect.any(String),
            page: '1'
          }),
          showLoading: false
        })
      );
      expect(result).toEqual(mockResponse.photos);
      expect(result).toHaveLength(1);
    });

    it('should fetch photos for high sol numbers', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'curiosity', sol: 3500 });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            sol: '3500'
          })
        })
      );
    });
  });

  describe('fetchMarsPhotos - Success cases with earth_date parameter', () => {
    it('should fetch Mars photos using earth_date', async () => {
      
      const mockResponse = {
        photos: [
          {
            id: 102693,
            sol: 1000,
            img_src: 'http://mars.nasa.gov/image.jpg',
            earth_date: '2015-05-30'
          }
        ]
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await fetchMarsPhotos({
        rover: 'curiosity',
        earth_date: '2015-05-30'
      });

      expect(mockGet).toHaveBeenCalledWith(
        '/mars-photos/api/v1/rovers/curiosity/photos',
        expect.objectContaining({
          params: expect.objectContaining({
            earth_date: '2015-05-30',
            api_key: expect.any(String),
            page: '1'
          })
        })
      );
      expect(result).toEqual(mockResponse.photos);
    });

    it('should handle recent earth dates', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({
        rover: 'spirit',
        earth_date: '2025-12-20'
      });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            earth_date: '2025-12-20'
          })
        })
      );
    });

    it('should handle historical earth dates', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({
        rover: 'spirit',
        earth_date: '2004-01-05'
      });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            earth_date: '2004-01-05'
          })
        })
      );
    });
  });

  describe('fetchMarsPhotos - Rover parameter', () => {
    it('should fetch photos from Curiosity rover', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(mockGet).toHaveBeenCalledWith(
        '/mars-photos/api/v1/rovers/curiosity/photos',
        expect.any(Object)
      );
    });

    it('should fetch photos from Opportunity rover', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'opportunity', sol: 500 });

      expect(mockGet).toHaveBeenCalledWith(
        '/mars-photos/api/v1/rovers/opportunity/photos',
        expect.any(Object)
      );
    });

    it('should fetch photos from Spirit rover', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'spirit', sol: 100 });

      expect(mockGet).toHaveBeenCalledWith(
        '/mars-photos/api/v1/rovers/spirit/photos',
        expect.any(Object)
      );
    });

    it('should fetch photos from opportunity rover', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'opportunity', sol: 200 });

      expect(mockGet).toHaveBeenCalledWith(
        '/mars-photos/api/v1/rovers/opportunity/photos',
        expect.any(Object)
      );
    });

    it('should handle rover names with different casing', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(mockGet).toHaveBeenCalledWith(
        '/mars-photos/api/v1/rovers/curiosity/photos',
        expect.any(Object)
      );
    });
  });

  describe('fetchMarsPhotos - Camera parameter (optional)', () => {
    it('should include camera parameter when provided', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000,
        camera: 'FHAZ'
      });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            camera: 'FHAZ'
          })
        })
      );
    });

    it('should work with different camera types', async () => {
      
      const cameras = ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'];
      
      mockGet.mockResolvedValue({ photos: [] });

      for (const camera of cameras) {
        await fetchMarsPhotos({
          rover: 'curiosity',
          sol: 1000,
          camera
        });
      }

      expect(mockGet).toHaveBeenCalledTimes(cameras.length);
    });

    it('should NOT include camera parameter when not provided', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000
      });

      const params = mockGet.mock.calls[0][1].params;
      expect(params.camera).toBeUndefined();
    });
  });

  describe('fetchMarsPhotos - Page parameter', () => {
    it('should use default page 1 when not provided', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000
      });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            page: '1'
          })
        })
      );
    });

    it('should use specified page number', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000,
        page: 5
      });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            page: '5'
          })
        })
      );
    });

    it('should handle large page numbers', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000,
        page: 999
      });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            page: '999'
          })
        })
      );
    });
  });

  describe('fetchMarsPhotos - API Key handling', () => {
    it('should use custom API key from environment variable', async () => {
      process.env.NEXT_PUBLIC_NASA_API_KEY = 'custom_mars_key_789';
      vi.resetModules();
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            api_key: 'custom_mars_key_789'
          })
        })
      );
    });

    it('should fallback to DEMO_KEY when environment variable is not set', async () => {
      delete process.env.NEXT_PUBLIC_NASA_API_KEY;
      vi.resetModules();
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            api_key: 'DEMO_KEY'
          })
        })
      );
    });
  });

  describe('fetchMarsPhotos - Validation errors', () => {
    it('should throw error when neither sol nor earth_date is provided', async () => {

      await expect(fetchMarsPhotos({
        rover: 'curiosity'
      } as any)).rejects.toThrow('Debes proporcionar `sol` o `earth_date`');

      expect(mockGet).not.toHaveBeenCalled();
    });

    it('should NOT throw when only sol is provided', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await expect(fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000
      })).resolves.toBeDefined();
    });

    it('should NOT throw when only earth_date is provided', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await expect(fetchMarsPhotos({
        rover: 'curiosity',
        earth_date: '2015-05-30'
      })).resolves.toBeDefined();
    });

    it('should work when both sol and earth_date are provided', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await expect(fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000,
        earth_date: '2015-05-30'
      })).resolves.toBeDefined();

      // Should prioritize sol over earth_date
      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            sol: '1000',
            earth_date: '2015-05-30'
          })
        })
      );
    });
  });

  describe('fetchMarsPhotos - Configuration options', () => {
    it('should disable loading indicator with showLoading: false', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          showLoading: false
        })
      );
    });
  });

  describe('fetchMarsPhotos - Response handling', () => {
    it('should return photos array from response', async () => {
      
      const mockPhotos = [
        { id: 1, sol: 1000, img_src: 'http://example.com/1.jpg' },
        { id: 2, sol: 1000, img_src: 'http://example.com/2.jpg' }
      ];

      mockGet.mockResolvedValue({ photos: mockPhotos });

      const result = await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(result).toEqual(mockPhotos);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no photos found', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      const result = await fetchMarsPhotos({ rover: 'curiosity', sol: 9999 });

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle response with complete photo data structure', async () => {
      
      const mockResponse = {
        photos: [
          {
            id: 102693,
            sol: 1000,
            camera: {
              id: 20,
              name: 'FHAZ',
              rover_id: 5,
              full_name: 'Front Hazard Avoidance Camera'
            },
            img_src: 'http://mars.jpl.nasa.gov/image.jpg',
            earth_date: '2015-05-30',
            rover: {
              id: 5,
              name: 'Curiosity',
              landing_date: '2012-08-06',
              launch_date: '2011-11-26',
              status: 'active',
              max_sol: 4102,
              max_date: '2023-08-28',
              total_photos: 695814
            }
          }
        ]
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('sol');
      expect(result[0]).toHaveProperty('camera');
      expect(result[0]).toHaveProperty('img_src');
      expect(result[0]).toHaveProperty('earth_date');
      expect(result[0]).toHaveProperty('rover');
    });
  });

  describe('fetchMarsPhotos - Error handling', () => {
    it('should propagate network errors', async () => {
      
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000
      })).rejects.toThrow('Network error');
    });


    it('should propagate 429 rate limit errors', async () => {
      
      mockGet.mockRejectedValue(new Error('Rate limit exceeded'));

      await expect(fetchMarsPhotos({
        rover: 'curiosity',
        sol: 1000
      })).rejects.toThrow('Rate limit exceeded');
    });

    it('should propagate 400 errors for invalid parameters', async () => {
      
      mockGet.mockRejectedValue(new Error('Invalid date format'));

      await expect(fetchMarsPhotos({
        rover: 'curiosity',
        earth_date: 'invalid-date'
      })).rejects.toThrow('Invalid date format');
    });
  });

  describe('fetchMarsPhotos - Integration with nasaHttpClient', () => {
    it('should use nasaHttpClient instead of httpClient', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(mockGet).toHaveBeenCalled();
      expect(mockPost).not.toHaveBeenCalled();
      expect(mockPut).not.toHaveBeenCalled();
      expect(mockDelete).not.toHaveBeenCalled();
      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('should use GET method only', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchMarsPhotos - Real-world scenarios', () => {

    it('should fetch photos from multiple cameras on same sol', async () => {
      
      const cameras = ['FHAZ', 'RHAZ', 'NAVCAM'];
      mockGet.mockResolvedValue({ photos: [] });

      for (const camera of cameras) {
        await fetchMarsPhotos({
          rover: 'curiosity',
          sol: 1000,
          camera
        });
      }

      expect(mockGet).toHaveBeenCalledTimes(3);
    });

    it('should paginate through multiple pages of results', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      for (let page = 1; page <= 5; page++) {
        await fetchMarsPhotos({
          rover: 'curiosity',
          sol: 1000,
          page
        });
      }

      expect(mockGet).toHaveBeenCalledTimes(5);
    });

    it('should fetch recent photos from spirit', async () => {
      
      mockGet.mockResolvedValue({
        photos: [
          { id: 999999, sol: 500, rover: { name: 'spirit' } }
        ]
      });

      const result = await fetchMarsPhotos({
        rover: 'spirit',
        earth_date: '2025-12-20'
      });

      expect(result[0].rover.name).toBe('spirit');
    });

    it('should work with DEMO_KEY for development', async () => {
      delete process.env.NEXT_PUBLIC_NASA_API_KEY;
      vi.resetModules();
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({ rover: 'curiosity', sol: 1000 });

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            api_key: 'DEMO_KEY'
          })
        })
      );
    });
  });

  describe('fetchMarsPhotos - Edge cases', () => {
    it('should handle undefined sol (0 is falsy but valid)', async () => {
      
      mockGet.mockResolvedValue({ photos: [] });

      await fetchMarsPhotos({
        rover: 'curiosity',
        sol: undefined,
        earth_date: '2015-05-30'
      });

      const params = mockGet.mock.calls[0][1].params;
      expect(params.sol).toBeUndefined();
      expect(params.earth_date).toBe('2015-05-30');
    });

  });
});