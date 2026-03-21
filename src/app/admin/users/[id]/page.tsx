import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { userHasAdminRole } from "@/lib/admin-role";

type Params = {
  id: string;
};

export const metadata = {
  title: "User Details",
};

export default async function AdminUserDetailsPage(props: {
  params: Promise<Params>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  if (!userHasAdminRole(me)) {
    redirect("/dashboard");
  }

  const { id } = await props.params;
  const u = await client.users.getUser(id);

  const name =
    [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "Unknown";
  const email =
    u.emailAddresses?.[0]?.emailAddress ?? u.primaryEmailAddress?.emailAddress ?? "—";

  return (
    <section className="py-10">
      <h1 className="text-3xl font-semibold text-primary sm:text-4xl">
        User Details
      </h1>
      <p className="mt-3 text-sm text-text-secondary sm:text-base">
        Basic details for moderation and troubleshooting.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-primary/15 bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-secondary">Name</p>
          <p className="mt-1 text-sm font-semibold text-text-primary">{name}</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-text-secondary">Email</p>
          <p className="mt-1 text-sm text-text-primary">{email}</p>
        </div>

        <div className="rounded-xl border border-primary/15 bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-text-secondary">Clerk ID</p>
          <p className="mt-1 break-all font-mono text-xs text-text-primary">{u.id}</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-text-secondary">Role</p>
          <p className="mt-1 text-sm text-text-primary">
            {(u.publicMetadata.role as string | undefined) ?? "student"}
          </p>
        </div>
      </div>
    </section>
  );
}

