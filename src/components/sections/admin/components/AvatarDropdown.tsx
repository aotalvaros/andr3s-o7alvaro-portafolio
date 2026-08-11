import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AvatarDropdownProps {
  srcAvatar: string;
  altAvatar: string;
  menuItems?: { label: string; onClick: () => void, icon: LucideIcon }[];
}

export function AvatarDropdown({
    srcAvatar,
    altAvatar = "User Avatar",
    menuItems,
}: Readonly<AvatarDropdownProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="mb-2 h-18 w-18">
            <AvatarImage src={srcAvatar} alt={altAvatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
            {menuItems?.map((item, index) => {
                const Icon = item.icon;
                return (
                    <Button
                        key={index + item.label}
                        variant="ghost"
                        className={cn("w-full justify-start")}
                        onClick={item.onClick}
                    >
                        <Icon className={cn("h-4 w-4")} />
                        {item.label}    
                    </Button>
                );
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
