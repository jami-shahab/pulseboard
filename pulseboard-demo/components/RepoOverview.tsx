// components/RepoOverview.tsx
export default function RepoOverview() {
  return (
    <section className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="rounded-full bg-gradient-to-r from-primary to-secondary w-16 h-16" />
      <div>
        <h1 className="text-2xl font-bold text-primary">pulseboard / pulseboard</h1>
        <p className="text-sm text-gray-500">Live dashboard for GitHub repo health &amp; contributor stats</p>
      </div>
    </section>
  );
}

