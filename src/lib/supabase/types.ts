export type Testimonial = {
  id: string;
  clerk_user_id: string | null;
  name: string;
  role: string | null;
  avatar_url: string | null;
  content: string;
  rating: number | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

