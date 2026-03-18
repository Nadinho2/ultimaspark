export default function AboutPage() {
  return (
    <section className="py-10">
      <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
        About UltimaSpark Academy
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-text-secondary sm:text-base">
        UltimaSpark Academy is a builder-first learning studio focused on AI-native
        skills, creative coding, and automation. Our courses are designed to help you
        ship real work—fast—through focused weekly milestones and practical projects.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-primary/15 bg-surface p-5">
          <p className="text-sm font-semibold text-text-primary">Project-based</p>
          <p className="mt-2 text-sm text-text-secondary">
            Every week is built around shipping something tangible.
          </p>
        </div>
        <div className="rounded-xl border border-primary/15 bg-surface p-5">
          <p className="text-sm font-semibold text-text-primary">Cohort energy</p>
          <p className="mt-2 text-sm text-text-secondary">
            Learn alongside other builders and keep momentum.
          </p>
        </div>
        <div className="rounded-xl border border-primary/15 bg-surface p-5">
          <p className="text-sm font-semibold text-text-primary">Modern tooling</p>
          <p className="mt-2 text-sm text-text-secondary">
            Practical workflows across agents, automations, and creative systems.
          </p>
        </div>
      </div>
    </section>
  );
}

