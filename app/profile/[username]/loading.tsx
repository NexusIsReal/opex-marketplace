export default function LoadingProfile() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="h-24 w-24 rounded-full bg-white/10" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-white/10 rounded" />
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="h-4 w-64 bg-white/10 rounded mt-2" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="h-40 bg-white/5 border border-white/10 rounded-xl" />
            <div className="h-52 bg-white/5 border border-white/10 rounded-xl" />
            <div className="h-52 bg-white/5 border border-white/10 rounded-xl" />
          </div>
          <aside className="space-y-6">
            <div className="h-40 bg-white/5 border border-white/10 rounded-xl" />
            <div className="h-40 bg-white/5 border border-white/10 rounded-xl" />
            <div className="h-40 bg-white/5 border border-white/10 rounded-xl" />
          </aside>
        </div>
      </div>
    </div>
  );
}
