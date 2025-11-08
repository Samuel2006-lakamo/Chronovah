import {
  Home,
  Notebook,
  BookOpen,
  Users,
  MapPin,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";



interface NavItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", icon: Home, path: "/" },
  { name: "Notes", icon: Notebook, path: "/notes" },
  { name: "Journal", icon: BookOpen, path: "/journal" },
  { name: "People", icon: Users, path: "/people" },
  { name: "Places", icon: MapPin, path: "/places" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default navItems;
