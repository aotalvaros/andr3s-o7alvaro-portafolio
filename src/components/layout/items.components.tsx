"use client"

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import React from "react";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";

interface ItemsMenuProps {
  handleClickLink: () => void;
}

export const ItemsMenu: React.FC<ItemsMenuProps> = ({ handleClickLink }) => {
  return (
    <DropdownMenuContent
      align="end"
      className="w-48 bg-background text-foreground flex flex-col p-1.5 border rounded-[10px] shadow-blue-900 dark:shadow-white/10"
    >
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="w-full p-1 bg-white cursor-pointer dark:text-secondary dark:bg-blue-900">
          &#127776; NASA →
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="flex flex-col z-[90] p-1 w-max shadow-lg border rounded-[10px] shadow-primary absolute left-2.5 bg-white dark:shadow-white/10 dark:text-secondary dark:bg-blue-900">
          <DropdownMenuItem asChild>
            <Link
              href="/lab/asteroids"
              onClick={handleClickLink}
              className="w-full p-1"
              data-testid="asteroids-link"
            >
              🌌 Asteroides
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/lab/mars-rover"
              onClick={handleClickLink}
              className="w-full p-1"
              data-testid="mars-rover-link"
            >
              🚀 Mars Rover
            </Link>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/lab/pokemon" onClick={handleClickLink} className="w-full p-1" data-testid="pokedex-link">
          🎮 Pokédex
        </Link>
      </DropdownMenuItem>
       <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link 
          href="/lab/weather" 
          onClick={handleClickLink} 
          className="w-full p-1" 
          data-testid="weather-dashboard-link"
        > 
          <span>🌤️</span> Weather
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>

  );
};
