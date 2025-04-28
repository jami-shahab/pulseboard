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
    <div className="container mx-auto py-10 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-4 text-neutral-800">
        Pulseboard Tech Stack
      </h1>
      <p className="text-lg text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
        An overview of the technologies and architecture powering this real-time open-source health dashboard.
      </p>

      {/* Technology List Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-neutral-700 text-center mb-8">
          Core Technologies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <TechItem icon={CodeBracketIcon} name="Next.js & React" description="App Router, Server Components (RSC), Client Components, API Routes for full-stack development." />
          <TechItem icon={CircleStackIcon} name="Apollo Client & GraphQL" description="Fetching data efficiently from the GitHub v4 GraphQL API." />
          <TechItem icon={PaintBrushIcon} name="Tailwind CSS & Recharts" description="Utility-first CSS for styling and composable charting library for visualizations." />
          <TechItem icon={CommandLineIcon} name="TypeScript" description="Strong typing for improved code quality and maintainability." />
          <TechItem icon={ServerIcon} name="NextAuth.js" description="Handling GitHub OAuth for user authentication and authorization." />
          <TechItem icon={CloudIcon} name="Vercel" description="Platform for seamless deployment, hosting, and serverless functions." />
        </div>
      </section>

      {/* Architecture Overview Section */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-700 text-center mb-8">
          Simplified Architecture
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Server-Side */} 
          <ArchBlock title="Server Components (RSC) & API Routes" description="Handle data fetching and rendering on the server." bgColorClass="bg-primary/10 border-primary/30">
            <p>• Main Page Layout (`layout.tsx`)</p>
            <p>• Home Page Container (`page.tsx`)</p>
            <p>• Contributor Leaderboard (`<ContributorLeaderboard>`) - Fetches via Apollo Server-side</p>
            <p>• API Route for Commit Activity (`/api/.../commit-activity`)</p>
            <p>• API Route for Issue Velocity (`/api/.../issue-velocity`)</p>
            <p>• API Route for Release Cadence (`/api/.../release-cadence`)</p>
            <p>• NextAuth API Handler (`/api/auth/...`)</p>
          </ArchBlock>

          {/* Client-Side */} 
          <ArchBlock title="Client Components" description="Enable interactivity and client-side data fetching." bgColorClass="bg-secondary/10 border-secondary/30">
             <p>• Header (`<Header>`) - Displays session, uses `<AuthButton>`</p>
             <p>• Auth Button (`<AuthButton>`) - Handles signIn/signOut</p>
             <p>• Provider Wrapper (`<ProviderWrapper>`) - Sets up Apollo/Session providers</p>
             <p>• Repo Details / Metrics (`<RepoDetailClient>`) - Fetches via `useQuery`</p>
             <p>• Contributor Heatmap (`<ContributorHeatmap>`) - Fetches via API route</p>
             <p>• Issue Velocity Chart (`<IssueVelocityChart>`) - Fetches via API route</p>
             <p>• Release Cadence Card (`<ReleaseCadence>`) - Fetches via API route</p>
          </ArchBlock>
        </div>
         <p className="text-center text-neutral-500 mt-8 text-sm">
            This is a simplified view. Interactions involve data flow between server/client components and API routes using Next.js features and Apollo Client.
          </p>
      </section>

    </div>
  );
} 