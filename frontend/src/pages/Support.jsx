export default function Support() {
  const faqs = [
    {
      q: "How do I edit or remove my listing?",
      a: "Open the item from the board and use the Edit or Delete buttons. You must be logged in with the same account that created it.",
    },
    {
      q: "What if I see inaccurate info?",
      a: "Use the Flag button. Admins review flagged posts and can remove anything misleading or unsafe.",
    },
    {
      q: "Can I post without an image?",
      a: "Yes. Photos help matches happen faster, but they’re optional. Please avoid sharing faces or private documents.",
    },
    {
      q: "Where should handoffs happen?",
      a: "Pick a public campus spot (library desk, security desk, front gate). Avoid exchanging sensitive personal details online.",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 space-y-10">
        <div className="space-y-3">
          <p className="pill bg-emerald-50 text-emerald-700 border-emerald-100">Support</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Need help?</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Common questions about using the board. If you run into issues, share feedback — we’re improving
            quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((item) => (
            <div key={item.q} className="card space-y-2">
              <p className="text-sm font-semibold text-slate-900">{item.q}</p>
              <p className="text-sm text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Contact & feedback</h2>
          <p className="text-sm text-slate-600">
            Reach the campus tech team at <span className="font-semibold text-slate-900">support@campuslost.io</span>{" "}
            for issues, or visit the admin desk in the library atrium for urgent item handoffs.
          </p>
          <p className="text-sm text-slate-600">
            Suggestions? Send quick notes — we prioritize what helps students reunite with their stuff faster.
          </p>
        </div>
      </section>
    </div>
  );
}

