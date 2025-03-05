
import React from "react";
import { Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 md:mr-4"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:flex md:items-center">
          <h1 className="font-display text-xl font-semibold tracking-tight">
            Essence
          </h1>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex md:w-64 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-8 bg-secondary/50 border-0 focus-visible:ring-1"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="gap-2 hidden sm:flex"
          >
            <User className="h-4 w-4" />
            <span>Account</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="sm:hidden"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
