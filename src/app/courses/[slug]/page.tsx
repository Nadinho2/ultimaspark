import { notFound } from "next/navigation";
import { getCourses } from "@/lib/courses";
import { CoursePageTemplate } from "@/components/CoursePageTemplate";

type Params = {
  slug: string;
};

export default async function CourseSlugPage(props: {
  params: Promise<Params>;
}) {
  const { slug } = await props.params;
  const courses = await getCourses();
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return <CoursePageTemplate course={course} />;
}



