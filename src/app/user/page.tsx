export const metadata = {
  title: "Profile",
};

export default function UserProfilePage() {
  return (
    <section className="py-10">
      <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
        Profile
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
        Your profile is managed through Clerk. Use the user menu in the header to
        update your name, email, and security settings.
      </p>

      <div className="mt-6 rounded-xl border border-primary/15 bg-surface p-5">
        <p className="text-sm font-semibold text-text-primary">
          Tip: keep your name consistent
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Certificates use your profile name. Set it once and keep it consistent for
          verification.
        </p>
      </div>
    </section>
  );
}

