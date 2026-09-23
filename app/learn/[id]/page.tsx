import Link from "next/link";
import {
  getLessonById,
  getLessonIndexById,
  getNextLesson,
  LESSONS
} from "../../../lib/lessons";
import { LessonStage } from "./LessonStage";

type LessonPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: lesson.id }));
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lesson = getLessonById(id);
  const lessonIndex = getLessonIndexById(id);
  const nextLesson = getNextLesson(id);

  if (!lesson) {
    return (
      <section className="flex min-h-[calc(100dvh-6rem)] flex-col justify-center px-5 py-7 md:px-10">
        <div className="mx-auto w-full max-w-lg rounded-2xl border border-black/10 bg-white p-6 text-center shadow-[0_16px_40px_rgba(22,32,25,0.08)]">
          <p className="text-sm font-semibold text-coral">没有找到这节课</p>
          <h1 className="mt-2 text-2xl font-bold text-ink">课程还没准备好</h1>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            先回到课程地图，选择一节开始学习。
          </p>
          <Link
            href="/learn"
            className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-leaf to-[#4f8a68] px-5 text-base font-bold text-white shadow-[0_12px_26px_rgba(47,111,78,0.20)]"
          >
            返回课程地图
          </Link>
        </div>
      </section>
    );
  }

  return (
    <LessonStage
      lesson={lesson}
      lessonIndex={lessonIndex}
      nextLesson={nextLesson}
    />
  );
}
