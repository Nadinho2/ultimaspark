import type { User } from "@clerk/backend";

/** Clerk `getUserList` defaults to **10** users per page. Admin flows must paginate (max 500/request). */
const PAGE_SIZE = 500;

type UsersApi = {
  getUserList: (params: {
    limit?: number;
    offset?: number;
  }) => Promise<{ data: User[] | null | undefined }>;
};

/**
 * Load every user in the Clerk instance (paginated). Use for admin-only server code.
 */
export async function listAllClerkUsers(client: {
  users: UsersApi;
}): Promise<User[]> {
  const all: User[] = [];
  let offset = 0;
  for (;;) {
    const res = await client.users.getUserList({
      limit: PAGE_SIZE,
      offset,
    });
    const batch = res.data ?? [];
    all.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return all;
}
