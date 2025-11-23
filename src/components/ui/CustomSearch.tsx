"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, X } from "lucide-react";
import { useCustomSearch } from "./hooks/useCustomSearch";
import { ICustomSearchProps } from "./types/customSearchProps.interface";

const ANIMATION_DURATION = 0.8;

export function CustomSearch<T = unknown>({
  onSearch,
  placeholder,
  textExample,
  disabled,
  propsAnimate,
  isSearching = false,
}: Readonly<ICustomSearchProps<T>>) {
  const {
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
  } = useCustomSearch({ onSearch });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl blur-xl opacity-20"
            animate={{
              background: isFocused
                ? [
                    "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                    "linear-gradient(45deg, #8b5cf6, #ec4899)",
                    "linear-gradient(45deg, #ec4899, #3b82f6)",
                  ]
                : "linear-gradient(45deg, transparent, transparent)",
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Main search container */}
          <motion.div
            className="relative"
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative flex items-center">
              <div className="absolute left-5 z-10">
                <Search className="h-5 w-5 text-muted-foreground " />
              </div>

              {/* Input field */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => {
                  if (blurTimeoutRef.current) {
                    clearTimeout(blurTimeoutRef.current);
                    blurTimeoutRef.current = null;
                  }
                  setIsFocused(true);
                }}
                onBlur={() => {
                  blurTimeoutRef.current = setTimeout(() => {
                    setIsFocused(false);
                  }, 150);
                }}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full h-14 pl-14 pr-36 md:pr-24 rounded-2xl border-2 border-border bg-background/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-300 font-medium text-[12px] md:text-[16px] truncate" //coloca puntos suspensivos cuando el texto es muy largo
              />

              {/* Clear button */}
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={clearSearch}
                    className="group absolute right-36 z-10 p-1.5 rounded-full transition-colors hover:bg-primary focus:outline-none "
                  >
                    <X className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-muted" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Submit button */}
              {propsAnimate?.childrenButton ? (
                propsAnimate?.childrenButton
              ) : (
                <motion.button
                  type="submit"
                  disabled={!query.trim() || isSearching || disabled}
                  className="absolute right-2 h-10 px-6 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  whileHover={{
                    scale: query.trim() && !isSearching ? 1.05 : 1,
                  }}
                  whileTap={{ scale: query.trim() && !isSearching ? 0.95 : 1 }}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Buscar
                  </span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Particle effects */}
          <AnimatePresence>
            {particleEffects.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: `${particle.x}%`,
                  y: `${particle.y}%`,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: ANIMATION_DURATION }}
                className="absolute w-2 h-2 rounded-full bg-primary pointer-events-none"
                style={{ left: "50%", top: "50%" }}
              />
            ))}
          </AnimatePresence>
        </form>

        {/* Animated hint text */}
        <AnimatePresence mode="wait">
          {isFocused && !query && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className=" top-full mt-3 left-0 right-0 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Prueba con{" "}
                {textExample.map((example, index) => (
                  <span key={index}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleExampleClick(example);
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      {example}
                    </button>
                    {index < textExample.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {propsAnimate && propsAnimate.results.length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-50"
              onMouseDown={(e) => {
                e.preventDefault();
                if (blurTimeoutRef.current) {
                  clearTimeout(blurTimeoutRef.current);
                  blurTimeoutRef.current = null;
                }
              }}
            >
              {propsAnimate.results.map((result, index) => (
                <div key={index}>{propsAnimate.children(result, index)}</div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
