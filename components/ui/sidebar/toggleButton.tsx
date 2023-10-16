'use client'

import { useSidebar } from './sidebarContext';


export default function ToggleButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const { toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar} className={className}>
      {children}
    </button>
  );
}
