/* eslint-disable @typescript-eslint/no-explicit-any */
const { fetchAsteroids, fetchAsteroidById } = await import('@/services/nasaAsteroids');
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockGet, mockPost, mockPut, mockDelete, mockPatch } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
  mockPatch: vi.fn(),
}));


vi.mock('@/core/infrastructure/http/nasaHttpClientFactory', () => ({
  nasaHttpClient: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    patch: mockPatch,
  },
}));

describe('Asteroids Service', () => {
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

  describe('fetchAsteroids', () => {
    describe('Success cases', () => {
      it('should fetch asteroids successfully with default page 0', async () => {
        
        const mockResponse = {
          links: { self: '/neo/rest/v1/neo/browse?page=0' },
          page: { size: 20, total_elements: 1000, total_pages: 50, number: 0 },
          near_earth_objects: [
            { id: '2000433', name: '433 Eros', is_potentially_hazardous_asteroid: false },
            { id: '3542519', name: '(2010 PK9)', is_potentially_hazardous_asteroid: true }
          ]
        };

        mockGet.mockResolvedValue(mockResponse);

        const result = await fetchAsteroids();

        expect(mockGet).toHaveBeenCalledWith(
          '/neo/rest/v1/neo/browse',
          expect.objectContaining({
            params: {
              page: 0,
              api_key: "DEMO_KEY"
            }
          })
        );
        expect(result).toEqual(mockResponse);
      });

      it('should fetch asteroids with specific page number', async () => {
        
        mockGet.mockResolvedValue({ page: { number: 5 } });

        await fetchAsteroids(5);

        expect(mockGet).toHaveBeenCalledWith(
          '/neo/rest/v1/neo/browse',
          expect.objectContaining({
            params: {
              page: 5,
              api_key: "DEMO_KEY"
            }
          })
        );
      });

      it('should fetch first page when page is 0', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroids(0);

        expect(mockGet).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            params: expect.objectContaining({
              page: 0
            })
          })
        );
      });

      it('should fetch last pages with high page numbers', async () => {
        
        mockGet.mockResolvedValue({ page: { number: 999 } });

        await fetchAsteroids(999);

        expect(mockGet).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            params: expect.objectContaining({
              page: 999
            })
          })
        );
      });

      it('should call the correct NASA NEO browse endpoint', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroids();

        const url = mockGet.mock.calls[0][0];
        expect(url).toBe('/neo/rest/v1/neo/browse');
      });

      it('should include api_key in params', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroids(0);

        expect(mockGet).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            params: expect.objectContaining({
              api_key: expect.any(String)
            })
          })
        );
      });

      it('should return complete asteroid list with pagination info', async () => {
        
        const mockResponse = {
          links: {
            next: '/neo/rest/v1/neo/browse?page=1',
            prev: '/neo/rest/v1/neo/browse?page=0',
            self: '/neo/rest/v1/neo/browse?page=0'
          },
          page: {
            size: 20,
            total_elements: 35447,
            total_pages: 1773,
            number: 0
          },
          near_earth_objects: []
        };

        mockGet.mockResolvedValue(mockResponse);

        const result = await fetchAsteroids() as typeof mockResponse;

        expect(result).toHaveProperty('links');
        expect(result).toHaveProperty('page');
        expect(result).toHaveProperty('near_earth_objects');
        expect(result.page.total_elements).toBe(35447);
      });
    });

    describe('API Key handling', () => {
      it('should fallback to DEMO_KEY when environment variable is not set', async () => {
        delete process.env.NEXT_PUBLIC_NASA_API_KEY;
        vi.resetModules();
        
        mockGet.mockResolvedValue({});

        await fetchAsteroids();

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

    describe('Error handling', () => {
      it('should propagate network errors', async () => {
        
        mockGet.mockRejectedValue(new Error('Network error'));

        await expect(fetchAsteroids()).rejects.toThrow('Network error');
      });

      it('should propagate 403 forbidden errors (invalid API key)', async () => {
        
        mockGet.mockRejectedValue(new Error('Invalid API key'));

        await expect(fetchAsteroids(0)).rejects.toThrow('Invalid API key');
      });

      it('should propagate 404 errors for invalid page', async () => {
        
        mockGet.mockRejectedValue(new Error('Page not found'));

        await expect(fetchAsteroids(9999)).rejects.toThrow('Page not found');
      });

      it('should propagate 429 rate limit errors', async () => {
        
        mockGet.mockRejectedValue(new Error('Rate limit exceeded'));

        await expect(fetchAsteroids()).rejects.toThrow('Rate limit exceeded');
      });
    });

    describe('Pagination edge cases', () => {
      it('should handle negative page numbers', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroids(-1);

        expect(mockGet).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            params: expect.objectContaining({
              page: -1
            })
          })
        );
      });

      it('should handle very large page numbers', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroids(999999);

        expect(mockGet).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            params: expect.objectContaining({
              page: 999999
            })
          })
        );
      });

      it('should handle page as string (JavaScript coercion)', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroids('5' as any);

        expect(mockGet).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            params: expect.objectContaining({
              page: '5'
            })
          })
        );
      });
    });
  });

  describe('fetchAsteroidById', () => {
    describe('Success cases', () => {
      it('should fetch asteroid by ID successfully', async () => {
        
        const mockResponse = {
          id: '3542519',
          neo_reference_id: '3542519',
          name: '(2010 PK9)',
          designation: '2010 PK9',
          nasa_jpl_url: 'http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3542519',
          is_potentially_hazardous_asteroid: true,
          close_approach_data: [],
          orbital_data: {}
        };

        mockGet.mockResolvedValue(mockResponse);

        const result = await fetchAsteroidById('3542519');

        expect(mockGet).toHaveBeenCalledWith(
          '/neo/rest/v1/neo/3542519',
          expect.objectContaining({
            params: {
              api_key: "DEMO_KEY"
            }
          })
        );
        expect(result).toEqual(mockResponse);
      });

      it('should fetch famous asteroids like Eros (433)', async () => {
        
        const mockResponse = {
          id: '2000433',
          name: '433 Eros',
          is_potentially_hazardous_asteroid: false
        };

        mockGet.mockResolvedValue(mockResponse);

        const result = await fetchAsteroidById('2000433') as typeof mockResponse;

        expect(result.name).toBe('433 Eros');
        expect(result.is_potentially_hazardous_asteroid).toBe(false);
      });

      it('should call the correct NASA NEO detail endpoint', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroidById('12345');

        const url = mockGet.mock.calls[0][0];
        expect(url).toBe('/neo/rest/v1/neo/12345');
      });

      it('should include api_key in params', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroidById('123');

        expect(mockGet).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            params: expect.objectContaining({
              api_key: expect.any(String)
            })
          })
        );
      });

      it('should handle different ID formats', async () => {
        
        mockGet.mockResolvedValue({});

        const ids = ['123', '2000433', '3542519', 'A123456'];

        for (const id of ids) {
          await fetchAsteroidById(id);
        }

        expect(mockGet).toHaveBeenCalledTimes(4);
      });

      it('should return complete asteroid details', async () => {
        
        const mockResponse = {
          id: '123',
          name: 'Test Asteroid',
          nasa_jpl_url: 'http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=123',
          is_potentially_hazardous_asteroid: false,
          close_approach_data: [
            {
              close_approach_date: '2025-01-15',
              relative_velocity: { kilometers_per_hour: '45000' },
              miss_distance: { kilometers: '7500000' }
            }
          ],
          orbital_data: {
            orbit_class: { orbit_class_type: 'Apollo' }
          },
          estimated_diameter: {
            kilometers: { estimated_diameter_min: 0.1, estimated_diameter_max: 0.5 }
          }
        };

        mockGet.mockResolvedValue(mockResponse);

        const result = await fetchAsteroidById('123') as typeof mockResponse;

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('close_approach_data');
        expect(result).toHaveProperty('orbital_data');
        expect(result.close_approach_data).toHaveLength(1);
      });
    });

    describe('API Key handling', () => {

      it('should fallback to DEMO_KEY when environment variable is not set', async () => {
        delete process.env.NEXT_PUBLIC_NASA_API_KEY;
        vi.resetModules();
        
        mockGet.mockResolvedValue({});

        await fetchAsteroidById('123');

        expect(mockGet).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            params: {
              api_key: 'DEMO_KEY'
            }
          })
        );
      });
    });

    describe('Error handling', () => {
      it('should propagate network errors', async () => {
        
        mockGet.mockRejectedValue(new Error('Network error'));

        await expect(fetchAsteroidById('123')).rejects.toThrow('Network error');
      });

      it('should propagate 404 errors for non-existent asteroid', async () => {
        
        mockGet.mockRejectedValue(new Error('Asteroid not found'));

        await expect(fetchAsteroidById('999999999')).rejects.toThrow('Asteroid not found');
      });

      it('should propagate 400 errors for invalid ID format', async () => {
        
        mockGet.mockRejectedValue(new Error('Invalid asteroid ID'));

        await expect(fetchAsteroidById('invalid@id')).rejects.toThrow('Invalid asteroid ID');
      });

      it('should propagate 429 rate limit errors', async () => {
        
        mockGet.mockRejectedValue(new Error('Rate limit exceeded'));

        await expect(fetchAsteroidById('123')).rejects.toThrow('Rate limit exceeded');
      });
    });

    describe('ID edge cases', () => {
      it('should handle empty string ID', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroidById('');

        expect(mockGet).toHaveBeenCalledWith(
          '/neo/rest/v1/neo/',
          expect.any(Object)
        );
      });

      it('should handle IDs with special characters', async () => {
        
        mockGet.mockResolvedValue({});

        await fetchAsteroidById('2010-PK9');

        expect(mockGet).toHaveBeenCalledWith(
          '/neo/rest/v1/neo/2010-PK9',
          expect.any(Object)
        );
      });

      it('should handle very long IDs', async () => {
        
        const longId = '1'.repeat(100);
        mockGet.mockResolvedValue({});

        await fetchAsteroidById(longId);

        expect(mockGet).toHaveBeenCalledWith(
          `/neo/rest/v1/neo/${longId}`,
          expect.any(Object)
        );
      });
    });
  });

  describe('Integration with httpClient', () => {
    it('should use only GET method for both functions', async () => {
      
      mockGet.mockResolvedValue({});

      await fetchAsteroids();
      await fetchAsteroidById('123');

      expect(mockGet).toHaveBeenCalledTimes(2);
      expect(mockPost).not.toHaveBeenCalled();
      expect(mockPut).not.toHaveBeenCalled();
      expect(mockDelete).not.toHaveBeenCalled();
      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('should use absolute URLs for both endpoints', async () => {

      mockGet.mockResolvedValue({});

      await fetchAsteroids();
      await fetchAsteroidById('123');

      const calls = mockGet.mock.calls;
      expect(calls[0][0]).toMatch(/\/neo\/rest\/v1\/neo\//);
      expect(calls[1][0]).toMatch(/\/neo\/rest\/v1\/neo\//);
      expect(calls[0][0]).toContain('/neo/rest/v1/neo/browse');
      expect(calls[1][0]).toContain('/neo/rest/v1/neo/123');
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle pagination through multiple pages', async () => {
      
      mockGet.mockResolvedValue({ page: { number: 0 } });

      for (let page = 0; page < 5; page++) {
        await fetchAsteroids(page);
      }

      expect(mockGet).toHaveBeenCalledTimes(5);
    });

    it('should fetch multiple asteroids by ID sequentially', async () => {
      
      const asteroidIds = ['2000433', '3542519', '433'];
      
      mockGet.mockResolvedValue({});

      for (const id of asteroidIds) {
        await fetchAsteroidById(id);
      }

      expect(mockGet).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed calls to both endpoints', async () => {

      mockGet.mockResolvedValue({});

      await fetchAsteroids(0);
      await fetchAsteroidById('433');
      await fetchAsteroids(1);
      await fetchAsteroidById('3542519');

      expect(mockGet).toHaveBeenCalledTimes(4);
    });

    it('should work with DEMO_KEY for development', async () => {
      delete process.env.NEXT_PUBLIC_NASA_API_KEY;
      vi.resetModules();
      
      
      mockGet.mockResolvedValue({});

      await fetchAsteroids();
      await fetchAsteroidById('123');

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
});