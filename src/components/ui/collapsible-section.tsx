import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevent any default behavior
    e.preventDefault();
    // Stop the event from bubbling up
    e.stopPropagation();
    // Toggle the section
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded-lg mb-4" onClick={(e) => e.stopPropagation()}>
      <div
        role="button"
        tabIndex={0}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 rounded-t-lg cursor-pointer"
        onClick={handleToggle}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleToggle(e as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>);
          }
        }}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </div>
      {isOpen && (
        <div 
          className="p-4" 
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
}