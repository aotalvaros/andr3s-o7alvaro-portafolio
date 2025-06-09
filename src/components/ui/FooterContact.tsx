import React from "react";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const FooterContact = () => {
  return (
    <div className="flex justify-center gap-4 mb-5 text-xl select-none">
        <Tooltip>
          <TooltipTrigger asChild>
            <a href="https://www.linkedin.com/in/andres-otalvaro-sanchez-31274b214/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin className="hover:text-blue-500" />
            </a>
          </TooltipTrigger>
          <TooltipContent className="text-white rounded-medium dark:bg-white dark:text-gray-800">
            <p>
              Visita mi perfil de LinkedIn
            </p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <a href="https://wa.me/573196638378" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp className="hover:text-green-400" />
            </a>
          </TooltipTrigger>
          <TooltipContent className="text-white rounded-medium dark:bg-white dark:text-gray-800">
            <p> Escribeme por WhatsApp</p>
          </TooltipContent>
        </Tooltip>
    </div>
  );
};
