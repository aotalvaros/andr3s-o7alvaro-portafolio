/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useContactForm } from '@/components/contact/hook/useContactForm';
import { usePostContact } from '@/components/contact/hook/usePostContact';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useToastMessageStore } from '@/store/ToastMessageStore';
import { ContactFormData } from '@/schemas/contact.schema';
import { useForm } from 'react-hook-form';

// Mocks
vi.mock('@/components/contact/hook/usePostContact');
vi.mock('@/hooks/useIsMobile');
vi.mock('@/store/ToastMessageStore');

// Mock de react-hook-form
vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    useForm: vi.fn(() => ({
      register: vi.fn((name) => ({ name })),
      handleSubmit: vi.fn((callback) => (e?: any) => {
        e?.preventDefault();
        return callback(mockFormData);
      }),
      formState: { errors: {}, isSubmitting: false },
      reset: vi.fn(),
    })),
  };
});

// Mock de ReCAPTCHA
vi.mock('react-google-recaptcha', () => ({
  default: vi.fn(),
}));

const mockFormData: ContactFormData = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'This is a test message',
};

describe('useContactForm', () => {
  const mockSendEmail = vi.fn();
  const mockSetParams = vi.fn();
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock de usePostContact
    vi.mocked(usePostContact).mockReturnValue({
      sendEmail: mockSendEmail,
      isLoading: false,
    } as any);

    // Mock de useIsMobile
    vi.mocked(useIsMobile).mockReturnValue(false);

    // Mock de useToastMessageStore
    vi.mocked(useToastMessageStore).mockImplementation((selector: any) => {
      const state = {
        setParams: mockSetParams,
      };
      return selector ? selector(state) : state;
    });

    // Mock de useForm con valores por defecto
    vi.mocked(useForm).mockReturnValue({
      register: vi.fn((name) => ({ name })),
      handleSubmit: vi.fn((callback) => (e?: any) => {
        e?.preventDefault();
        return callback(mockFormData);
      }),
      formState: { errors: {}, isSubmitting: false },
      reset: mockReset,
    } as any);
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useContactForm());

      expect(result.current.register).toBeDefined();
      expect(result.current.handleSubmit).toBeDefined();
      expect(result.current.errors).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.recaptchaRef).toBeDefined();
      expect(result.current.isButtonDisabled).toBe(true);
      expect(result.current.onSubmit).toBeDefined();
      expect(result.current.onChangeReCaptcha).toBeDefined();
      expect(result.current.captchaSize).toBeDefined();
    });

    it('should initialize with button disabled', () => {
      const { result } = renderHook(() => useContactForm());

      expect(result.current.isButtonDisabled).toBe(true);
    });

    it('should set captchaSize to "normal" on desktop', () => {
      vi.mocked(useIsMobile).mockReturnValue(false);

      const { result } = renderHook(() => useContactForm());

      expect(result.current.captchaSize).toBe('normal');
    });

    it('should set captchaSize to "compact" on mobile', () => {
      vi.mocked(useIsMobile).mockReturnValue(true);

      const { result } = renderHook(() => useContactForm());

      expect(result.current.captchaSize).toBe('compact');
    });
  });

  describe('ReCAPTCHA onChange', () => {
    it('should enable button when reCAPTCHA is verified', () => {
      const { result } = renderHook(() => useContactForm());

      // Mock del ref con valor
      result.current.recaptchaRef.current = {
        getValue: vi.fn(() => 'recaptcha-token'),
      } as any;

      act(() => {
        result.current.onChangeReCaptcha("recaptcha-token");
      });

      expect(result.current.isButtonDisabled).toBe(false);
    });

    it('should keep button disabled when reCAPTCHA has no value', () => {
      const { result } = renderHook(() => useContactForm());

      // Mock del ref sin valor
      result.current.recaptchaRef.current = {
        getValue: vi.fn(() => null),
      } as any;

      act(() => {
        result.current.onChangeReCaptcha(null);
      });

      expect(result.current.isButtonDisabled).toBe(true);
    });

    it('should handle when recaptchaRef.current is null', () => {
      const { result } = renderHook(() => useContactForm());

      result.current.recaptchaRef.current = null;

      act(() => {
        result.current.onChangeReCaptcha(null);
      });

      expect(result.current.isButtonDisabled).toBe(true);
    });

    it('should toggle button state correctly on multiple calls', () => {
      const { result } = renderHook(() => useContactForm());

      // Primera verificación - con token
      result.current.recaptchaRef.current = {
        getValue: vi.fn(() => 'token'),
      } as any;

      act(() => {
        result.current.onChangeReCaptcha("recaptcha-token");
      });

      expect(result.current.isButtonDisabled).toBe(false);

      // Segunda verificación - sin token
      result.current.recaptchaRef.current = {
        getValue: vi.fn(() => null),
      } as any;

      act(() => {
        result.current.onChangeReCaptcha(null);
      });

      expect(result.current.isButtonDisabled).toBe(true);
    });
  });

  describe('Form Submission - Success', () => {
    it('should call sendEmail with form data', async () => {
      mockSendEmail.mockResolvedValue({ message: 'Email sent successfully' });

      const { result } = renderHook(() => useContactForm());

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockSendEmail).toHaveBeenCalledWith(
        mockFormData,
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    it('should call setParams with success message on successful submission', async () => {
      const successMessage = 'Email enviado correctamente';
      
      mockSendEmail.mockImplementation(async (data, callbacks) => {
        callbacks?.onSuccess({ message: successMessage });
        return { message: successMessage };
      });

      const { result } = renderHook(() => useContactForm());

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockSetParams).toHaveBeenCalledWith({
        message: '¡Éxito!',
        description: successMessage,
        typeMessage: 'success',
        show: true,
      });
    });

    it('should reset form after successful submission when not loading', async () => {
      mockSendEmail.mockImplementation(async (data, callbacks) => {
        callbacks?.onSuccess({ message: 'Success' });
        return { message: 'Success' };
      });

      vi.mocked(usePostContact).mockReturnValue({
        sendEmail: mockSendEmail,
        isLoading: false,
      } as any);

      const { result } = renderHook(() => useContactForm());

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      await waitFor(() => {
        expect(mockReset).toHaveBeenCalled();
      });
    });

    it('should not reset form while loading', async () => {
      mockSendEmail.mockImplementation(async (data, callbacks) => {
        callbacks?.onSuccess({ message: 'Success' });
        return { message: 'Success' };
      });

      vi.mocked(usePostContact).mockReturnValue({
        sendEmail: mockSendEmail,
        isLoading: true,
      } as any);

      const { result } = renderHook(() => useContactForm());

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockReset).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission - Error', () => {
    it('should call setParams with error message on failed submission', async () => {
      const errorMessage = 'Error al enviar el email';

      mockSendEmail.mockImplementation(async (data, callbacks) => {
        callbacks?.onError({ message: errorMessage });
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useContactForm());

      await act(async () => {
        try {
          await result.current.onSubmit(mockFormData);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      expect(mockSetParams).toHaveBeenCalledWith({
        message: 'Error',
        description: errorMessage,
        typeMessage: 'error',
        show: true,
      });
    });

    it('should handle network errors', async () => {
      const networkError = 'Network error occurred';

      mockSendEmail.mockImplementation(async (data, callbacks) => {
        callbacks?.onError({ message: networkError });
        throw new Error(networkError);
      });

      const { result } = renderHook(() => useContactForm());

      await act(async () => {
        try {
          await result.current.onSubmit(mockFormData);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      expect(mockSetParams).toHaveBeenCalledWith({
        message: 'Error',
        description: networkError,
        typeMessage: 'error',
        show: true,
      });
    });
  });

  describe('Form Validation Errors', () => {
    it('should return validation errors from react-hook-form', async () => {
      const mockErrors = {
        name: { message: 'El nombre es requerido' },
        email: { message: 'Email inválido' },
      };

      const { useForm } = await import('react-hook-form');
      vi.mocked(useForm).mockReturnValue({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        formState: { errors: mockErrors, isSubmitting: false },
        reset: vi.fn(),
      } as any);

      const { result } = renderHook(() => useContactForm());

      expect(result.current.errors).toEqual(mockErrors);
    });

    it('should reflect isSubmitting state from react-hook-form', async () => {
      const { useForm } = await import('react-hook-form');
      vi.mocked(useForm).mockReturnValue({
        register: vi.fn(),
        handleSubmit: vi.fn(),
        formState: { errors: {}, isSubmitting: true },
        reset: vi.fn(),
      } as any);

      const { result } = renderHook(() => useContactForm());

      expect(result.current.isSubmitting).toBe(true);
    });
  });

  describe('Multiple Submissions', () => {
    it('should handle multiple successful submissions', async () => {
      mockSendEmail.mockImplementation(async (data, callbacks) => {
        callbacks?.onSuccess({ message: 'Success' });
        return { message: 'Success' };
      });

      const { result } = renderHook(() => useContactForm());

      await act(async () => {
        await result.current.onSubmit(mockFormData);
        await result.current.onSubmit(mockFormData);
      });

      expect(mockSendEmail).toHaveBeenCalledTimes(2);
      expect(mockSetParams).toHaveBeenCalledTimes(2);
    });

    it('should handle alternating success and error submissions', async () => {
      const { result } = renderHook(() => useContactForm());

      // Primera llamada - éxito
      mockSendEmail.mockImplementationOnce(async (data, callbacks) => {
        callbacks?.onSuccess({ message: 'Success' });
        return { message: 'Success' };
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockSetParams).toHaveBeenCalledWith(
        expect.objectContaining({ typeMessage: 'success' })
      );

      // Segunda llamada - error
      mockSendEmail.mockImplementationOnce(async (data, callbacks) => {
        callbacks?.onError({ message: 'Error' });
        throw new Error('Error');
      });

      await act(async () => {
        try {
          await result.current.onSubmit(mockFormData);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      expect(mockSetParams).toHaveBeenCalledWith(
        expect.objectContaining({ typeMessage: 'error' })
      );
    });
  });

  describe('Responsive Behavior', () => {
    it('should update captchaSize when switching from desktop to mobile', () => {
      const { result, rerender } = renderHook(() => useContactForm());

      expect(result.current.captchaSize).toBe('normal');

      // Simular cambio a móvil
      vi.mocked(useIsMobile).mockReturnValue(true);
      rerender();

      const { result: mobileResult } = renderHook(() => useContactForm());
      expect(mobileResult.current.captchaSize).toBe('compact');
    });

    it('should update captchaSize when switching from mobile to desktop', () => {
      vi.mocked(useIsMobile).mockReturnValue(true);
      const { result, rerender } = renderHook(() => useContactForm());

      expect(result.current.captchaSize).toBe('compact');

      // Simular cambio a desktop
      vi.mocked(useIsMobile).mockReturnValue(false);
      rerender();

      const { result: desktopResult } = renderHook(() => useContactForm());
      expect(desktopResult.current.captchaSize).toBe('normal');
    });
  });

  describe('Integration with Dependencies', () => {
    it('should call usePostContact hook', () => {
      renderHook(() => useContactForm());

      expect(usePostContact).toHaveBeenCalled();
    });

    it('should call useIsMobile hook', () => {
      renderHook(() => useContactForm());

      expect(useIsMobile).toHaveBeenCalled();
    });

    it('should call useToastMessageStore hook', () => {
      renderHook(() => useContactForm());

      expect(useToastMessageStore).toHaveBeenCalled();
    });
  });
});