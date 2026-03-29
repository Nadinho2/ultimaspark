import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { courseForPublicMarketingPage, getCourses } from "@/lib/courses";
import { getCourseEnrollmentSnapshot } from "@/lib/course-enrollment";
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

  const user = await currentUser();
  const enrollment = getCourseEnrollmentSnapshot(user, course.slug);
  const publicCourse = courseForPublicMarketingPage(course);

  return (
    <CoursePageTemplate course={publicCourse} enrollment={enrollment} />
  );
}



