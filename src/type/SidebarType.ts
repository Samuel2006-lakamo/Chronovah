export interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}