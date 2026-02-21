"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Question = {
  _id: Id<"questions">;
  Instruction?: string;
  Question: string;
  Rubric: string;
  Type: string;
  Answer?: string; // optional — if present, enables auto-grading
};

type Answers = {
  _id?: Id<"answers">;
  Instruction?: string;
  Question?: string;
  Answer?: string;
}

type TeacherRecord = {
  _id?: Id<"teachers">;
  Question: string;
  Instruction: string;
  Answer: string;
  Student: string;
  Teacher: string;
  Score: number;
  Comments: string;
}

// ── Score Select ──────────────────────────────────────────────────────────────
function ScoreSelect({
  value,
  onChange,
  disabled,
}: {
  value: number | null;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mr-1">Score</span>
      {[0, 1, 2, 3].map((n) => (
        <button
          key={n}
          disabled={disabled}
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-lg text-sm font-mono font-semibold border transition-all duration-150
            ${value === n
              ? "bg-lime-400 border-lime-400 text-slate-950 shadow-[0_0_12px_rgba(163,230,53,0.4)]"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:border-lime-500/50 hover:text-lime-400"
            }
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// ── Question Card ─────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  index,
  total,
  studentAnswer,
  teacher,
  student,
  scoreInit,
  commentInit,
}: {
  question: Question;
  index: number;
  total: number;
  studentAnswer: Answers | undefined;
  teacher: string;
  student: string;
  scoreInit?: number;
  commentInit?: string;
}) {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const create = useMutation(api.teachers.create);

  function handleSubmit() {
    if (score === null || comment.trim() == "") return;
    setSubmitted(true);
    
    async function submitGrade() {
      if (!student || !teacher || !question.Instruction || !question.Question || !studentAnswer?.Answer || score === null) return;

      await create({
        Student: student,
        Teacher: teacher,
        Instruction: question.Instruction,
        Question: question.Question,
        Answer: studentAnswer?.Answer,
        Score: score,
        Comments: comment.trim(),
      });
    }

    submitGrade();
  }

  React.useEffect(() => {
    if (scoreInit !== undefined) {
      console.log("Score init is", scoreInit)
    }
    setScore(scoreInit ?? null);
    setComment(commentInit ?? "");
  }, [scoreInit, commentInit]);

  return (
    <div
      className="group relative w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4 transition-all duration-300 hover:border-slate-700 focus-within:border-lime-500/40 focus-within:shadow-[0_0_0_1px_rgba(163,230,53,0.15)]"
      style={{ animation: `cardIn 0.4s cubic-bezier(0.34,1.2,0.64,1) both`, animationDelay: `${index * 60}ms` }}
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-lime-500/[0.03] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

      {/* Question number */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          Q {index + 1} of {total}
        </span>
        <div className="flex-1 h-px bg-slate-800" />
        {submitted && (
          <span className="text-[10px] font-mono tracking-widest text-lime-600 uppercase">graded</span>
        )}
      </div>

      {/* Bloom's Type */}
      {question.Type && (
        <p className="text-lg text-slate-200 italic mb-2 whitespace-pre-line font-bold text-right">{question.Type}</p>
      )}

      {/* Instruction */}
      {question.Instruction && (
        <p className="text-lg text-slate-200 italic mb-2 whitespace-pre-line">{question.Instruction?.replace(/\\n/g, "\n")}</p>
      )}

      {/* Question text */}
      <p
        className="text-lg text-slate-100 leading-relaxed mb-5 whitespace-pre-line"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        {question.Question?.replace(/\\n/g, "\n")}
      </p>

      {/* Question Rubric */}
      <p
        className="text-lg text-slate-100 leading-relaxed mb-5 whitespace-pre-line"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        {question.Rubric?.replace(/\\n/g, "\n")}
      </p>

      {/* Student answer — read-only */}
      <div className="mb-5">
        <label className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1.5">
          Student&apos;s Answer
        </label>
        <div className="w-full min-h-[80px] bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-lg text-slate-300 leading-relaxed">
          {studentAnswer ? (
            studentAnswer.Answer
          ) : (
            <span className="text-slate-600 italic">No answer submitted</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-800 mb-5" />

      {/* Scoring row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <ScoreSelect value={score} onChange={setScore} disabled={submitted || studentAnswer === undefined} />
        {score !== null && (
          <span
            className="text-xs font-mono text-slate-500"
            style={{ animation: "fadeSlide 0.2s ease both" }}
          >
            {score === 0 && "No marks"}
            {score === 1 && "Partial — needs work"}
            {score === 2 && "Good — minor gaps"}
            {score === 3 && "Excellent answer"}
          </span>
        )}
      </div>

      {/* Teacher comment */}
      <div className="mb-5">
        <label className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1.5">
          Teacher Comment <span className="text-slate-700 normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={submitted || studentAnswer === undefined}
          placeholder="Leave feedback for the student…"
          rows={2}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 resize-y outline-none transition-all duration-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={score === null || comment.trim() == ""}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 text-slate-950 text-sm font-semibold transition-all duration-150
              hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.35)] hover:-translate-y-px
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            Submit Grade ↵
          </button>
        ) : (
          <div className="flex items-center gap-2" style={{ animation: "fadeSlide 0.3s ease both" }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-lime-500/10 border border-lime-500/25 rounded-xl">
              <span className="text-lime-400 text-sm">✓</span>
              <span className="text-lime-400 text-sm font-medium">
                Graded — {score}/3
              </span>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              title="Edit grade"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono hover:border-slate-500 hover:text-slate-200 transition-all duration-150"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8.5 1.5a1.414 1.414 0 0 1 2 2L4 10H2v-2L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Summary ───────────────────────────────────────────────────────────────────
function SummaryScreen({
  studentName,
  onRestart,
}: {
  studentName: string;
  onRestart: () => void;
}) {
  return (
    <div
      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-8 py-10 text-center"
      style={{ animation: "cardIn 0.5s cubic-bezier(0.34,1.2,0.64,1) both" }}
    >
      <div className="w-16 h-16 rounded-full bg-lime-400/10 border border-lime-400/30 flex items-center justify-center mx-auto mb-5">
        <span className="text-2xl">✓</span>
      </div>
      <h2
        className="text-3xl text-slate-100 mb-2"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        Grading Complete
      </h2>
      <p className="text-sm text-slate-500 mb-8">
        All answers for <span className="text-lime-400">{studentName}</span> have been graded.
      </p>
      <button
        onClick={onRestart}
        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-lime-400 text-slate-950 font-semibold transition-all hover:bg-lime-300 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)] hover:-translate-y-px"
      >
        ↩ Back to top
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function Page() {
  const questions = useQuery(api.questions.get) as Question[] | undefined;
  const searchParams = useSearchParams();
  const router = useRouter();

  const studentName = searchParams.get("student") ?? "Student";
  const teacherName = searchParams.get("teacher") ?? "Teacher";

  const answers = useQuery(api.answers.get, { Name: studentName }) as Answers[] | undefined;

  const [key, setKey] = useState(0);
  const [score] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const total = questions?.length ?? 0;

  const teacherRecord = useQuery(api.teachers.get, { Teacher: teacherName, Student: studentName }) as TeacherRecord[] | undefined;

  // Match answer to question by questionId
  function getAnswerForQuestion(question: Question) {
    return answers?.find(
      (a) =>
        a.Question === question.Question &&
        a.Instruction === question.Instruction
    );
  }

  function handleRestart() {
    setShowSummary(false);
    setKey((k) => k + 1);
  }

  console.log(teacherRecord)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="min-h-screen bg-[#080b10] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(163,230,53,0.07),transparent)] flex flex-col items-center px-4 py-14 pb-24">
        <div className="w-full max-w-[700px]">

          {/* ── Header ── */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-mono tracking-[0.25em] text-lime-400 uppercase">
                Teacher Review
              </p>
              <button
                onClick={() => router.push("/")}
                className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                ← Back
              </button>
            </div>

            <h1
              className="text-4xl sm:text-5xl text-slate-100 leading-tight mb-4"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Grade <em className="text-lime-400 not-italic">answers</em>
            </h1>

            {/* Student + Teacher info bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-sky-400/20 border border-sky-400/40 flex items-center justify-center text-sky-400 text-xs font-bold shrink-0">
                  {studentName[0]?.toUpperCase()}
                </div>
                <span className="text-xs text-slate-400">
                  Student: <span className="text-slate-200 font-medium">{studentName}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-lime-400/20 border border-lime-400/40 flex items-center justify-center text-lime-400 text-xs font-bold shrink-0">
                  {teacherName[0]?.toUpperCase()}
                </div>
                <span className="text-xs text-slate-400">
                  Teacher: <span className="text-slate-200 font-medium">{teacherName}</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── Progress ── */}
          {questions && (
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-[3px] bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-lime-400 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.5)]" style={{ width: "0%" }} />
              </div>
              <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                {total} questions
              </span>
            </div>
          )}

          {/* ── Loading ── */}
          {(questions === undefined || answers === undefined) && (
            <div className="flex flex-col items-center gap-4 py-20 text-slate-600">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs font-mono tracking-widest uppercase">Loading data…</span>
            </div>
          )}

          {/* ── Summary ── */}
          {showSummary && (
            <SummaryScreen studentName={studentName} onRestart={handleRestart} />
          )}

          {/* ── Question Cards ── */}
          {!showSummary &&
            questions?.map((question, idx) => {
              const studentAnswer = getAnswerForQuestion(question);
              const matchedAnswer = teacherRecord?.find(
                (a) =>
                  a.Question === question.Question &&
                  a.Instruction === question.Instruction &&
                  a.Answer === studentAnswer?.Answer
              );
              return (
              <QuestionCard
                key={`${key}-${question._id}`}
                question={question}
                index={idx}
                total={total}
                studentAnswer={studentAnswer}
                teacher={teacherName}
                student={studentName}
                scoreInit={matchedAnswer ? matchedAnswer.Score : undefined}
                commentInit={matchedAnswer ? matchedAnswer.Comments : ""}
              />
          )})}

          {/* ── Finish button ── */}
          {!showSummary && questions && questions.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowSummary(true)}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-lime-400 text-slate-950 font-semibold transition-all
                  hover:bg-lime-300 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)] hover:-translate-y-px"
              >
                Finish Grading →
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Page;