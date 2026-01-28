import React, { useState, useRef, useMemo } from "react";
import { getSecureRandomInRange } from '@/utils/randomValues';

const PARTICLE_COUNT = 12;
const PARTICLE_DURATION = 1000;

export const useCustomSearch = ({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const particleEffects = useMemo(() => particles, [particles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      createParticles();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: Date.now() + i,
      x: getSecureRandomInRange(0, 100),
      y: getSecureRandomInRange(0, 100),
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), PARTICLE_DURATION);
  };

  const clearSearch = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    onSearch(example);
    createParticles();
    inputRef.current?.focus();
  };

  return {
    query,
    isFocused,
    inputRef,
    particleEffects,
    blurTimeoutRef,

    handleSubmit,
    handleInputChange,
    clearSearch,
    handleExampleClick,
    setIsFocused,
  };
};
