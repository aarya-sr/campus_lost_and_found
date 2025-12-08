export default function About() {
  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 space-y-10">
        <div className="space-y-3">
          <p className="pill bg-emerald-50 text-emerald-700 border-emerald-100">Our mission</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Built for students, by students.</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Campus Lost & Found is a community-driven board to quickly reunite people with their belongings. We
            prioritize transparency, safety, and speed — no confusing forms, just the essentials to make a match.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card space-y-2">
            <p className="text-sm font-semibold text-emerald-700">Community-first</p>
            <p className="text-sm text-slate-600">
              Every post is visible to campus peers. Admin tools help flag questionable content so everyone stays
              protected.
            </p>
          </div>
          <div className="card space-y-2">
            <p className="text-sm font-semibold text-emerald-700">Transparent process</p>
            <p className="text-sm text-slate-600">
              Posts show who added them and when. Listings can be edited or removed by the original author or an
              admin.
            </p>
          </div>
          <div className="card space-y-2">
            <p className="text-sm font-semibold text-emerald-700">Privacy-aware</p>
            <p className="text-sm text-slate-600">
              Avoid sharing sensitive info. Exchange details in person on campus or via school-approved channels.
            </p>
          </div>
          <div className="card space-y-2">
            <p className="text-sm font-semibold text-emerald-700">Always improving</p>
            <p className="text-sm text-slate-600">
              Feedback from students shapes our roadmap — smarter filters, better alerts, and faster matching.
            </p>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Guidelines</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
            <li>Use accurate titles and locations for every listing.</li>
            <li>Never share personal IDs or sensitive documents publicly.</li>
            <li>Arrange item handoffs in well-lit, public campus spots.</li>
            <li>Flag anything suspicious — admins will review quickly.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

