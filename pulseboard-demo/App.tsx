import RepoOverview from './components/RepoOverview';
import StatsGrid    from './components/StatsGrid';
import Leaderboard  from './components/Leaderboard';

export default function App() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-10 space-y-8">
      <RepoOverview />
      <StatsGrid />
      <Leaderboard />
    </div>
  );
}

