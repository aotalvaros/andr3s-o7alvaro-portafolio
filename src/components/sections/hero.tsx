'use client'

import { useEffect, useState } from 'react'
import { GradientText } from '../ui/GradientText'
import { AnimatedText } from '../ui/AnimatedText'
import { FloatingIcon } from '../ui/FloatingIcon'
import { ArrowDown, Mail } from 'lucide-react'
import { FaGithub, FaLinkedin, FaReact  } from "react-icons/fa";
import { RiNextjsFill, RiTailwindCssFill  } from "react-icons/ri";
import { SiTypescript } from "react-icons/si";
import Link from 'next/link'

export function Hero() {
   const scrollToNext = () => {
    const aboutSection = document.getElementById("about")
    aboutSection?.scrollIntoView({ behavior: "smooth" })
  }

   const [stopAnimation, setStopAnimation] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setStopAnimation(true);
      } else {
        setStopAnimation(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <section id='hero' className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" data-testid="hero-section">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Greeting with wave animation */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="block mb-2">Hola, soy</span>
              <GradientText>
                <AnimatedText text="Andrés Otalvaro" />
              </GradientText>
            </h1>
          </div>

          {/* Animated subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Desarrollador Frontend especializado en <span className="text-primary font-semibold">React</span>,{" "}
            <span className="text-secondary font-semibold">Next.js</span>,{" "}
            <span className="text-accent font-semibold">TailwindCSS</span> y tecnologías modernas
          </p>

          <div className="flex items-center justify-center gap-6 py-8">
            <FloatingIcon delay={0} stopAnimation={stopAnimation}>
              <div className="p-4 rounded-xl glass hover:scale-110 transition-transform cursor-pointer">
                <FaReact className='w-[32] h-[32]' />
              </div>
            </FloatingIcon>

            <FloatingIcon delay={1} stopAnimation={stopAnimation}>
              <div className="p-4 rounded-xl glass hover:scale-110 transition-transform cursor-pointer">
               <RiNextjsFill className='w-[32] h-[32]' />
              </div>
            </FloatingIcon>

            <FloatingIcon delay={2} stopAnimation={stopAnimation}>
              <div className="p-4 rounded-xl glass hover:scale-110 transition-transform cursor-pointer">
                <RiTailwindCssFill className='w-[32] h-[32]' />
              </div>
            </FloatingIcon>

            <FloatingIcon delay={3} stopAnimation={stopAnimation}>
              <div className="p-4 rounded-xl glass hover:scale-110 transition-transform cursor-pointer">
                <SiTypescript className='w-[32] h-[32]' />
              </div>
            </FloatingIcon>
          </div>


          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="#contact" 
              aria-label='Contactame'  
              className="flex py-2.5 px-5 gap-1.5 rounded-[12px] text-white text-[14px] items-center bg-gradient-to-r from-primary via-secondary to-accent hover:scale-105 transition-transform"
              data-testid="contact-me-link"
            > 
              <Mail className="mr-2 h-4 w-4" />
              Contáctame
            </Link>

            {/* <Link
              className="flex items-center py-2.5 px-5 rounded-[12px] border border-input group hover:scale-105 transition-transform bg-transparent"
              href="#projects"
              data-testid="view-projects-link"
            >
              Ver Proyectos
              <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </Link> */}
          </div>

          <div className='mb-2'>
            <button
              onClick={scrollToNext}
              className="p-2 rounded-full glass hover:scale-110 transition-all animate-bounce"
              aria-label="Scroll to next section"
              data-testid="scroll-down-button"
            >
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mb-2">
            <a
              href="https://github.com/aotalvaros"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass hover:scale-110 hover:bg-primary/10 transition-all"
              aria-label="GitHub Profile"
              data-testid="github-link"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/andres-otalvaro-sanchez-31274b214/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full glass hover:scale-110 hover:bg-primary/10 transition-all"
              aria-label="LinkedIn Profile"
              data-testid="linkedin-link"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:andr3s.o7alvaro@gmail.com"
              className="p-3 rounded-full glass hover:scale-110 hover:bg-primary/10 transition-all"
              aria-label="Send Email"
              data-testid="email-link"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
         
        </div>
      </div>

      {/* Scroll indicator */}
    </section>
  )
}
