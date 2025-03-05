
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Settings, 
  User, 
  Menu, 
  Search, 
  Folder,
  ArrowRight
} from "lucide-react";
import { getProjects } from "@/lib/storage";
import { MenuItem } from "@/lib/types";

interface SidebarProps {
  open: boolean;
}


export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const projects = getProjects();
  
  const menuItems: Array<MenuItem> = useMemo(() => {
    const projectItems: Array<MenuItem> = projects.map(item => ({
      label: item.name,
      icon: Folder,
      href: `/projects/${item.id}`
    }))
    return [
      { 
        label: "Home", 
        icon: Home, 
        href: "/", 
      },
      ...projectItems
    ]
  }, [projects]);

  const [activeItem, setActiveItem] = useState<string>(location.pathname || menuItems[0].href);  

  return (
    <aside 
      className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-background border-r z-30 transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="h-full flex flex-col">
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setActiveItem(item.href)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group",
                activeItem === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0",
                activeItem === item.href ? "text-primary" : "text-foreground/60 group-hover:text-foreground/80"
              )} />
              <span className={cn(
                "transition-opacity duration-300",
                open ? "opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
              {activeItem === item.href && (
                <div className={cn(
                  "ml-auto",
                  open ? "opacity-100" : "opacity-0",
                  "transition-opacity duration-300"
                )}>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              )}
            </Link>
          ))}
        </nav>
        
        {/* <div className={cn(
          "p-4 border-t",
          open ? "block" : "hidden"
        )}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john.doe@example.com</p>
            </div>
          </div>
        </div> */}
      </div>
    </aside>
  );
};
