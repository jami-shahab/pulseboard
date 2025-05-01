// components/StatsGrid.tsx
import StatCard from './StatCard';

export default function StatsGrid() {
  const stats = [
    { label: '⭐ Stars', value: 846 },
    { label: '🍴 Forks', value: 121 },
    { label: '⬆️ PR Velocity', value: '2.7 days', sub: 'avg merge time' },
    { label: '📈 Test Coverage', value: '88 %' },
  ];
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(s => (
        <StatCard key={s.label} {...s} />
      ))}
    </section>
  );
}

