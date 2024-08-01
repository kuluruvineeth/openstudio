"use client";

import { createContext, useContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

interface ToggleSidebarContextProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToggleSidebarContext =
  createContext<ToggleSidebarContextProps | null>({
    isSidebarOpen: true,
    setIsSidebarOpen: () => {},
  });

export const ToggleSidebarProvider = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ToggleSidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </ToggleSidebarContext.Provider>
  );
};

export const useToggleSidebar = () => {
  const context = useContext(ToggleSidebarContext);
  if (!context) {
    throw new Error(
      "useToggleSidebar must be used within a ToggleSidebarProvider",
    );
  }
  return context;
};
