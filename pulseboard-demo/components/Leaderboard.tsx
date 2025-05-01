// components/Leaderboard.tsx
const rows = [
  { rank: 1, name: 'Alice',    commits: 182 },
  { rank: 2, name: 'Bob',      commits: 155 },
  { rank: 3, name: 'Charlie',  commits: 124 },
  { rank: 4, name: 'Devon',    commits: 99  },
  { rank: 5, name: 'Eva',      commits: 73  },
];

export default function Leaderboard() {
  return (
    <section className="bg-white border border-gray-200 rounded-xl2 shadow-card">
      <h2 className="px-6 py-4 font-semibold text-primary text-lg">Top Contributors</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs uppercase">
              <th className="px-6 py-3">#</th>
              <th>Name</th>
              <th>Commits</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.rank} className="odd:bg-accent/40">
                <td className="px-6 py-2 font-bold text-secondary">{r.rank}</td>
                <td>{r.name}</td>
                <td>{r.commits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

