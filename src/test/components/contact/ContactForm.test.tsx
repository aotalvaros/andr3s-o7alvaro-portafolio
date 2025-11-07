/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContactForm } from "@/components/contact/ContactForm";
import { useContactForm } from "@/components/contact/hook/useContactForm";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mocks
vi.mock('@/components/contact/hook/useContactForm');

// Mock de ReCAPTCHA
vi.mock('react-google-recaptcha', () => ({
  default: vi.fn(({ onChange, size }) => (
    <div data-testid="contact-recaptcha" data-size={size}>
      <button
        data-testid="recaptcha-trigger"
        onClick={() => onChange('mock-recaptcha-token')}
      >
        Verify ReCAPTCHA
      </button>
    </div>
  ))
}));

// Mock de ScrollReveal
vi.mock('@/components/ui/ScrollReveal', () => ({
  ScrollReveal: ({ children, delay }: { children: React.ReactNode; delay?: number }) => (
    <div data-testid="scroll-reveal" data-delay={delay}>
      {children}
    </div>
  ),
}));

// Mock de componentes UI
vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(({ className, ...props }) => (
    <input className={className} {...props} />
  ))
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: vi.fn(({ className, ...props }) => (
    <textarea className={className} {...props} />
  ))
}));

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, className, ...props }) => (
    <button className={className} {...props}>
      {children}
    </button>
  ))
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

describe('ContactForm', () => {
  const mockRegister = vi.fn((name) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }));

  const mockHandleSubmit = vi.fn();

  const mockOnSubmit = vi.fn();
  const mockOnChangeReCaptcha = vi.fn();
  const mockRecaptchaRef = { current: null };

  const defaultMockReturn = {
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    errors: {},
    isSubmitting: false,
    recaptchaRef: mockRecaptchaRef,
    isButtonDisabled: false,
    onSubmit: mockOnSubmit,
    onChangeReCaptcha: mockOnChangeReCaptcha,
    captchaSize: 'normal' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useContactForm).mockReturnValue(defaultMockReturn);
  });

  describe('Rendering', () => {
    it('should render contact form section with correct testid', () => {
      render(<ContactForm />);

      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
      expect(screen.getByTestId('contact-form-element')).toBeInTheDocument();
    });

    it('should render main heading with highlighted text', () => {
      render(<ContactForm />);

      expect(screen.getByText(/Hablemos de tu/i)).toBeInTheDocument();
      expect(screen.getByText('Proyecto')).toBeInTheDocument();
      expect(screen.getByText('Proyecto')).toHaveClass('text-primary');
    });

    it('should render description text', () => {
      render(<ContactForm />);

      expect(
        screen.getByText(/¿Tienes una idea en mente\? Estoy disponible para nuevos proyectos y colaboraciones\./i)
      ).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<ContactForm />);

      expect(screen.getByTestId('contact-name')).toBeInTheDocument();
      expect(screen.getAllByTestId('contact-email')[0]).toBeInTheDocument();
      expect(screen.getByTestId('contact-message')).toBeInTheDocument();
    });

    it('should render form labels', () => {
      render(<ContactForm />);

      expect(screen.getByText('Tu nombre')).toBeInTheDocument();
      expect(screen.getByText('Tu correo')).toBeInTheDocument();
      expect(screen.getByText('Tu mensaje')).toBeInTheDocument();
    });

    it('should render submit button with icon', () => {
      render(<ContactForm />);

      const submitButton = screen.getByTestId('contact-submit');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent('Enviar mensaje');
    });

    it('should render ReCAPTCHA component', () => {
      render(<ContactForm />);

      expect(screen.getByTestId('contact-recaptcha')).toBeInTheDocument();
    });
  });

  describe('Contact Information Section', () => {

    it('should render contact description', () => {
      render(<ContactForm />);

      expect(
        screen.getByText(
          /Siempre estoy abierto a discutir nuevos proyectos, ideas creativas u oportunidades para ser parte de tu visión\./i
        )
      ).toBeInTheDocument();
    });

    it('should render email contact card with correct link', () => {
      render(<ContactForm />);

      const emailLink = screen.getAllByTestId('contact-email');
      expect(emailLink[0]).toHaveAttribute('href', 'mailto:andr3s.o7alvaro@gmail.com');
      expect(emailLink[0]).toHaveTextContent('Email');
      expect(emailLink[0]).toHaveTextContent('andr3s.o7alvaro@gmail.com');
    });

    it('should render LinkedIn contact card with correct link', () => {
      render(<ContactForm />);

      const linkedinLink = screen.getByTestId('contact-linkedin');
      expect(linkedinLink).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/andres-otalvaro-sanchez-31274b214/'
      );
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(linkedinLink).toHaveTextContent('LinkedIn');
      expect(linkedinLink).toHaveTextContent('Conecta conmigo');
    });

    it('should render GitHub contact card with correct link', () => {
      render(<ContactForm />);

      const githubLink = screen.getByTestId('contact-github');
      expect(githubLink).toHaveAttribute('href', 'https://github.com/aotalvaros');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(githubLink).toHaveTextContent('GitHub');
      expect(githubLink).toHaveTextContent('Revisa mi código');
    });
  });

  describe('Form Validation Errors', () => {
    it('should display name error message when present', () => {
      vi.mocked(useContactForm).mockReturnValue({
        ...defaultMockReturn,
        errors: {
          name: { message: 'El nombre es requerido', type: 'required'},
        },
      });

      render(<ContactForm />);

      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      expect(screen.getByText('El nombre es requerido')).toHaveClass('text-red-500');
    });

    it('should display email error message when present', () => {
      vi.mocked(useContactForm).mockReturnValue({
        ...defaultMockReturn,
        errors: {
          email: { message: 'Email inválido', type: 'pattern' },
        },
      });

      render(<ContactForm />);

      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('Email inválido')).toHaveClass('text-red-500');
    });

    it('should display message error when present', () => {
      vi.mocked(useContactForm).mockReturnValue({
        ...defaultMockReturn,
        errors: {
          message: { message: 'El mensaje es requerido', type: 'required' },
        },
      });

      render(<ContactForm />);

      expect(screen.getByText('El mensaje es requerido')).toBeInTheDocument();
      expect(screen.getByText('El mensaje es requerido')).toHaveClass('text-red-500');
    });

    it('should display multiple error messages simultaneously', () => {
      vi.mocked(useContactForm).mockReturnValue({
        ...defaultMockReturn,
        errors: {
          name: { message: 'El nombre es requerido', type: 'required' },
          email: { message: 'Email inválido', type: 'pattern' },
          message: { message: 'El mensaje es requerido', type: 'required' },
        },
      });

      render(<ContactForm />);

      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('El mensaje es requerido')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const submitButton = screen.getByTestId('contact-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalled();
      });
    });

    it('should disable submit button when isSubmitting is true', () => {
      vi.mocked(useContactForm).mockReturnValue({
        ...defaultMockReturn,
        isSubmitting: true,
      });

      render(<ContactForm />);

      const submitButton = screen.getByTestId('contact-submit');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Enviando...');
    });

    it('should disable submit button when isButtonDisabled is true', () => {
      vi.mocked(useContactForm).mockReturnValue({
        ...defaultMockReturn,
        isButtonDisabled: true,
      });

      render(<ContactForm />);

      const submitButton = screen.getByTestId('contact-submit');
      expect(submitButton).toBeDisabled();
    });

    it('should show loading text when submitting', () => {
      vi.mocked(useContactForm).mockReturnValue({
        ...defaultMockReturn,
        isSubmitting: true,
      });

      render(<ContactForm />);

      expect(screen.getByText('Enviando...')).toBeInTheDocument();
    });

    it('should enable submit button when not submitting and not disabled', () => {
      render(<ContactForm />);

      const submitButton = screen.getByTestId('contact-submit');
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Enviar mensaje');
    });
  });

  describe('ReCAPTCHA', () => {
    it('should render ReCAPTCHA with correct size', () => {
      render(<ContactForm />);

      const recaptcha = screen.getByTestId('contact-recaptcha');
      expect(recaptcha).toHaveAttribute('data-size', 'normal');
    });

    it('should render ReCAPTCHA with compact size when specified', () => {
      vi.mocked(useContactForm).mockReturnValue({
        ...defaultMockReturn,
        captchaSize: 'compact',
      });

      render(<ContactForm />);

      const recaptcha = screen.getByTestId('contact-recaptcha');
      expect(recaptcha).toHaveAttribute('data-size', 'compact');
    });

    it('should call onChangeReCaptcha when ReCAPTCHA is verified', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const recaptchaButton = screen.getByTestId('recaptcha-trigger');
      await user.click(recaptchaButton);

      expect(mockOnChangeReCaptcha).toHaveBeenCalledWith('mock-recaptcha-token');
    });
  });

  describe('Form Inputs Registration', () => {
    it('should register name input', () => {
      render(<ContactForm />);

      expect(mockRegister).toHaveBeenCalledWith('name');
    });

    it('should register email input', () => {
      render(<ContactForm />);

      expect(mockRegister).toHaveBeenCalledWith('email');
    });

    it('should register message input', () => {
      render(<ContactForm />);

      expect(mockRegister).toHaveBeenCalledWith('message');
    });
  });

  describe('User Interactions', () => {
    it('should allow typing in name input', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByTestId('contact-name');
      await user.type(nameInput, 'John Doe');

      expect(nameInput).toHaveValue('John Doe');
    });

    it('should allow typing in message textarea', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const messageInput = screen.getByTestId('contact-message');
      await user.type(messageInput, 'This is a test message');

      expect(messageInput).toHaveValue('This is a test message');
    });
  });

  describe('Styling and Classes', () => {
    it('should apply dark mode classes to name input', () => {
      render(<ContactForm />);

      const nameInput = screen.getByTestId('contact-name');
      expect(nameInput).toHaveClass('dark:text-white', 'dark:placeholder:text-secondary-foreground');
    });

    it('should apply dark mode classes to email input', () => {
      render(<ContactForm />);

      const emailInput = screen.getAllByTestId('contact-email');
      expect(emailInput[0]).toHaveClass('flex items-center gap-4 p-4 rounded-xl glass hover:bg-primary/10 transition-all group');
    });

    it('should apply correct classes to message textarea', () => {
      render(<ContactForm />);

      const messageInput = screen.getByTestId('contact-message');
      expect(messageInput).toHaveClass('max-h-[30dvh] dark:text-white dark:placeholder:text-secondary-foreground');
    });

    it('should apply gradient classes to submit button', () => {
      render(<ContactForm />);

      const submitButton = screen.getByTestId('contact-submit');
      expect(submitButton).toHaveClass('w-full', 'bg-gradient-to-r', 'from-primary', 'via-secondary', 'to-accent');
    });

    it('should have correct rows attribute on textarea', () => {
      render(<ContactForm />);

      const messageInput = screen.getByTestId('contact-message');
      expect(messageInput).toHaveAttribute('rows', '5');
    });
  });

  describe('ScrollReveal Integration', () => {
    it('should render ScrollReveal components', () => {
      render(<ContactForm />);

      const scrollReveals = screen.getAllByTestId('scroll-reveal');
      expect(scrollReveals.length).toBeGreaterThan(0);
    });

    it('should apply correct delays to ScrollReveal components', () => {
      render(<ContactForm />);

      const scrollReveals = screen.getAllByTestId('scroll-reveal');
      const delayedReveal = scrollReveals.find((el) => el.getAttribute('data-delay') === '200');
      
      expect(delayedReveal).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {

    it('should have accessible external links with security attributes', () => {
      render(<ContactForm />);

      const linkedinLink = screen.getByTestId('contact-linkedin');
      const githubLink = screen.getByTestId('contact-github');

      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have mailto link for email', () => {
      render(<ContactForm />);

      const emailLink = screen.getAllByTestId('contact-email');
      expect(emailLink[0].getAttribute('href')).toContain('mailto:');
    });
  });

  describe('Form Structure', () => {
    it('should render form inside card component', () => {
      render(<ContactForm />);

      const form = screen.getByTestId('contact-form-element');
      expect(form.closest('[class*="p-8"]')).toBeInTheDocument();
    });

    it('should have section with contact id for navigation', () => {
      render(<ContactForm />);

      const section = screen.getByTestId('contact-form');
      expect(section).toHaveAttribute('id', 'contact');
    });
  });
});