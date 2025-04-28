import React from "react";
import { CodeBracketIcon, ServerIcon, CloudIcon, CircleStackIcon, PaintBrushIcon, CommandLineIcon } from '@heroicons/react/24/outline'; // Using Heroicons

// Interface for technology items
interface TechItemProps {
  icon: React.ElementType;
  name: string;
  description: string;
}

const TechItem: React.FC<TechItemProps> = ({ icon: Icon, name, description }) => (
  <div className="flex items-start space-x-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:shadow-md transition-shadow">
    <Icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
    <div>
      <h4 className="text-lg font-semibold text-neutral-800">{name}</h4>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  </div>
);

// Simple component to represent Client/Server parts
interface ArchBlockProps {
  title: string;
  description: string;
  children: React.ReactNode;
  bgColorClass?: string;
}

const ArchBlock: React.FC<ArchBlockProps> = ({ title, description, children, bgColorClass = 'bg-blue-50' }) => (
  <div className={`border border-neutral-300 rounded-lg p-6 ${bgColorClass}`}>
    <h4 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h4>
    <p className="text-sm text-neutral-600 mb-4">{description}</p>
    <div className="space-y-2 text-sm text-neutral-700">
      {children}
    </div>
  </div>
);

// The Stack Page Component (Server Component)
export default function StackPage() {
  return (
    <div>Stack Page Content</div> // Temporarily simplified
  );
} 