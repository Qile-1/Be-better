import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonById, LESSONS } from "../../../../lib/lessons";
import { PracticeSection } from "../PracticeSection";

type PracticePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: lesson.id }));
}

export default async function PracticePage({ params }: PracticePageProps) {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson || !lesson.practiceQuestions?.length) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-10 md:px-12 md:py-14">
      <Link
        href={`/learn/${lesson.id}`}
        className="inline-flex items-center gap-2 text-sm text-ink/55 transition hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        返回本节
      </Link>
      <p className="mt-10 text-xs font-medium tracking-[0.16em] text-ink/45">
        {lesson.title}
      </p>
      <PracticeSection lessonId={lesson.id} questions={lesson.practiceQuestions} />
    </section>
  );
}
