/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePostContact } from "@/components/contact/hook/usePostContact";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { sendContact } from "@/services/contact/contact.service";
import { useLoadingStore } from "@/store/loadingStore";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mocks
vi.mock('@/services/contact/contact.service');
vi.mock('@/store/loadingStore');

describe('usePostContact', () => {
  let queryClient: QueryClient;
  const mockSetLoading = vi.fn();

  beforeEach(() => {
    // Reset de queryClient para cada test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock de useLoadingStore
    vi.mocked(useLoadingStore).mockImplementation((selector: any) => {
      const state = {
        setLoading: mockSetLoading,
        isLoading: false,
      };
      return selector ? selector(state) : state;
    });

    // Limpiar mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => usePostContact(), { wrapper });

      expect(result.current.sendEmail).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });

    it('should call setLoading with false on mount', () => {
      renderHook(() => usePostContact(), { wrapper });

      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('Successful Contact Form Submission', () => {
    const mockContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    };

    const mockResponse = {
      success: true,
      message: 'Mensaje enviado correctamente',
    };

    beforeEach(() => {
      vi.mocked(sendContact).mockResolvedValue(mockResponse);
    });

    it('should call sendContact service with correct payload', async () => {
      const { result } = renderHook(() => usePostContact(), { wrapper });

      await result.current.sendEmail(mockContactData);

      expect(sendContact).toHaveBeenCalledWith(mockContactData);
      expect(sendContact).toHaveBeenCalledTimes(1);
    });

    it('should return response data from sendContact', async () => {
      const { result } = renderHook(() => usePostContact(), { wrapper });

      const response = await result.current.sendEmail(mockContactData);

      expect(response).toEqual(mockResponse);
    });

    it('should handle successful submission with all fields', async () => {
      const { result } = renderHook(() => usePostContact(), { wrapper });

      const response = await result.current.sendEmail(mockContactData);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Mensaje enviado correctamente');
    });
  });

  describe('Failed Contact Form Submission', () => {
    const mockContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    };

    it('should handle error when sendContact fails', async () => {
      const errorMessage = 'Error al enviar el mensaje';
      vi.mocked(sendContact).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await expect(result.current.sendEmail(mockContactData)).rejects.toThrow(errorMessage);
    });

    it('should handle network errors', async () => {
      vi.mocked(sendContact).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await expect(result.current.sendEmail(mockContactData)).rejects.toThrow('Network error');
    });

    it('should handle server errors', async () => {
      vi.mocked(sendContact).mockRejectedValue(new Error('Server error: 500'));

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await expect(result.current.sendEmail(mockContactData)).rejects.toThrow('Server error: 500');
    });

    it('should handle validation errors', async () => {
      vi.mocked(sendContact).mockRejectedValue(new Error('Validation failed'));

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await expect(result.current.sendEmail(mockContactData)).rejects.toThrow('Validation failed');
    });
  });

  describe('Loading State Management', () => {
    it('should set loading to true when mutation starts', async () => {
      vi.mocked(sendContact).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true, message: 'Success' }), 100))
      );

      const { result } = renderHook(() => usePostContact(), { wrapper });

      const sendPromise = result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: 'Test',
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await sendPromise;
    });

    it('should call setLoading with true during mutation', async () => {
      vi.mocked(sendContact).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true, message: 'Success' }), 100))
      );

      const { result } = renderHook(() => usePostContact(), { wrapper });

      const sendPromise = result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: 'Test',
      });

      await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(true);
      });

      await sendPromise;
    });

    it('should set loading to false after successful mutation', async () => {
      vi.mocked(sendContact).mockResolvedValue({
        success: true,
        message: 'Success',
      });

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: 'Test',
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(mockSetLoading).toHaveBeenCalledWith(false);
      });
    });

    it('should set loading to false after failed mutation', async () => {
      vi.mocked(sendContact).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => usePostContact(), { wrapper });

      try {
        await result.current.sendEmail({
          name: 'John',
          email: 'john@example.com',
          message: 'Test',
        });
      } catch (error) {
        expect(error).toEqual(new Error('Error'));
      }

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(mockSetLoading).toHaveBeenCalledWith(false);
      });
    });

  });

  describe('Multiple Contact Submissions', () => {
    it('should handle multiple sequential submissions', async () => {
      const mockResponse = { success: true, message: 'Success' };
      vi.mocked(sendContact).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await result.current.sendEmail({
        name: 'User 1',
        email: 'user1@example.com',
        message: 'Message 1',
      });

      await result.current.sendEmail({
        name: 'User 2',
        email: 'user2@example.com',
        message: 'Message 2',
      });

      expect(sendContact).toHaveBeenCalledTimes(2);
    });

    it('should maintain correct state between multiple submissions', async () => {
      vi.mocked(sendContact).mockResolvedValue({
        success: true,
        message: 'Success',
      });

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await result.current.sendEmail({
        name: 'User 1',
        email: 'user1@example.com',
        message: 'Message 1',
      });

      expect(result.current.isLoading).toBe(false);

      await result.current.sendEmail({
        name: 'User 2',
        email: 'user2@example.com',
        message: 'Message 2',
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message gracefully', async () => {
      const mockResponse = { success: true, message: 'Success' };
      vi.mocked(sendContact).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: '',
      });

      expect(sendContact).toHaveBeenCalledWith(
        expect.objectContaining({ message: '' })
      );
    });

    it('should handle long messages', async () => {
      const longMessage = 'A'.repeat(5000);
      const mockResponse = { success: true, message: 'Success' };
      vi.mocked(sendContact).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: longMessage,
      });

      expect(sendContact).toHaveBeenCalledWith(
        expect.objectContaining({ message: longMessage })
      );
    });

    it('should handle special characters in data', async () => {
      const specialData = {
        name: 'John <script>alert("test")</script>',
        email: 'john+test@example.com',
        message: 'Message with special chars: & < > " \' /',
      };

      const mockResponse = { success: true, message: 'Success' };
      vi.mocked(sendContact).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await result.current.sendEmail(specialData);

      expect(sendContact).toHaveBeenCalledWith(specialData);
    });
  });

  describe('Integration with React Query', () => {
    it('should use mutateAsync from useMutation', async () => {
      vi.mocked(sendContact).mockResolvedValue({
        success: true,
        message: 'Success',
      });

      const { result } = renderHook(() => usePostContact(), { wrapper });

      const response = await result.current.sendEmail({
        name: 'John',
        email: 'john@example.com',
        message: 'Test',
      });

      expect(response).toBeDefined();
      expect(response.success).toBe(true);
    });

    it('should handle mutation with custom callbacks', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      vi.mocked(sendContact).mockResolvedValue({
        success: true,
        message: 'Success',
      });

      const { result } = renderHook(() => usePostContact(), { wrapper });

      await result.current.sendEmail(
        {
          name: 'John',
          email: 'john@example.com',
          message: 'Test',
        },
        {
          onSuccess,
          onError,
        }
      );

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Zustand Store Integration', () => {
    it('should call useLoadingStore selector correctly', () => {
      renderHook(() => usePostContact(), { wrapper });

      expect(useLoadingStore).toHaveBeenCalled();
    });
  });
});