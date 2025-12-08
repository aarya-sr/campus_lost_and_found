import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="pill bg-emerald-50 text-emerald-700 border-emerald-100">New</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              A friendlier lost and found for your campus.
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Post lost or found items, search by category, and get notified when someone spots what you’re
              looking for. Simple, fast, and built for students.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/browse" className="btn-primary">
                Browse board
              </Link>
              <Link to="/report" className="btn-secondary">
                Report an item
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="card flex-1 min-w-[220px]">
                <p className="text-sm font-semibold text-emerald-700">Under 2 minutes</p>
                <p className="text-sm text-slate-600">To create a post with photo and campus location.</p>
              </div>
              <div className="card flex-1 min-w-[220px]">
                <p className="text-sm font-semibold text-emerald-700">Community-first</p>
                <p className="text-sm text-slate-600">Flag, edit, or remove posts to keep things accurate.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl bg-white/80 backdrop-blur border border-slate-200 shadow-2xl shadow-emerald-100 p-8 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">How it works</p>
              <ul className="space-y-4">
                {[
                  { title: "Create a report", desc: "Share what was lost/found with location & details." },
                  { title: "Search smart filters", desc: "Sort by category, date, and type to narrow results." },
                  { title: "Coordinate handoff", desc: "Use the contact info inside the listing to connect." },
                ].map((step) => (
                  <li key={step.title} className="flex gap-3 items-start">
                    <span className="pill bg-slate-100 text-slate-700 border-slate-200">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-600">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <p className="text-sm font-semibold text-emerald-800">Tip</p>
                <p className="text-sm text-emerald-700">
                  Add a quick marker emoji (🎧, 📚, 🧥) to your title to catch attention on the board.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Real-time moderation", desc: "Admins can flag or remove any suspicious posts." },
            { title: "Photo-friendly", desc: "Attach campus photos or receipts to verify items quickly." },
            { title: "Fast navigation", desc: "Filters for lost vs. found, category, and posted date." },
          ].map((feature) => (
            <div key={feature.title} className="card h-full">
              <p className="text-sm font-semibold text-emerald-700 mb-2">{feature.title}</p>
              <p className="text-sm text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-[0.2em]">Get started</p>
              <h2 className="text-2xl font-bold text-slate-900">Ready to help reunite items with owners?</h2>
              <p className="text-sm text-slate-600">
                Head to the browse page to see what’s currently posted, or create a report for anything you found.
                The more details you add, the faster matches happen.
              </p>
              <div className="flex gap-3">
                <Link to="/browse" className="btn-primary">
                  Browse items
                </Link>
                <Link to="/report" className="btn-secondary">
                  Post a report
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-sky-500/10 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700 space-y-3">
              <p className="font-semibold text-slate-900">Posting checklist</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Clear photo if possible (no faces).</li>
                <li>Exact spot and time you last saw or found it.</li>
                <li>Unique identifiers (stickers, initials, strap color).</li>
                <li>Preferred way to connect on campus.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

