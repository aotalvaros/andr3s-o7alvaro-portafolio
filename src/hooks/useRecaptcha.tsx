import { useRef, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

export function useRecaptcha() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState<boolean>(true);
  
  const onChangeReCaptcha = (token: string | null) => {
    setIsVerified(!token);
  };
  
  return { recaptchaRef, isVerified, onChangeReCaptcha };
}