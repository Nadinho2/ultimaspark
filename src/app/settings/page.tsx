export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <section className="py-10">
      <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
        Settings
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
        Settings pages are coming soon. For now, manage your account and profile
        through the user menu in the header.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-primary/15 bg-surface p-5">
          <p className="text-sm font-semibold text-text-primary">Notifications</p>
          <p className="mt-2 text-sm text-text-secondary">
            Choose which progress updates you receive by email.
          </p>
          <p className="mt-3 text-xs text-text-secondary">
            (Placeholder – wire up preferences later.)
          </p>
        </div>
        <div className="rounded-xl border border-primary/15 bg-surface p-5">
          <p className="text-sm font-semibold text-text-primary">Privacy</p>
          <p className="mt-2 text-sm text-text-secondary">
            Control what appears on your certificate verification page.
          </p>
          <p className="mt-3 text-xs text-text-secondary">
            (Placeholder – coming soon.)
          </p>
        </div>
      </div>
    </section>
  );
}

