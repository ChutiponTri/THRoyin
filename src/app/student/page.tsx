"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type Question = {
  _id: Id<"questions">;
  Instruction?: string;
  Question: string;
  Answer?: string; // optional — if present, enables auto-grading
};

type Answers = {
  _id?: Id<"answers">;
  Instruction?: string;
  Question?: string;
  Answer?: string;
}

type FeedbackType = "correct" | "wrong" | "submitted";

function getRating(pct: number) {
  if (pct === 100) return { emoji: "🏆", label: "Perfect score!" };
  if (pct >= 80) return { emoji: "⚡", label: "Excellent work!" };
  if (pct >= 60) return { emoji: "📚", label: "Good effort!" };
  if (pct >= 40) return { emoji: "🔄", label: "Keep practicing!" };
  return { emoji: "💪", label: "Don't give up!" };
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ pct, score, total }: { pct: number; score: number; total: number }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dash = circumference - (pct / 100) * circumference;
  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      <svg className="-rotate-90 w-full h-full" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke="#a3e635" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dash}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34,1,0.64,1)", filter: "drop-shadow(0 0 8px #a3e63599)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-lime-400 leading-none" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{pct}%</span>
        <span className="text-xs text-slate-500 font-mono mt-0.5">{score}/{total}</span>
      </div>
    </div>
  );
}

// ── Question Card ─────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  index,
  total,
  name,
  answers,
}: {
  question: Question;
  index: number;
  total: number;
  name: string;
  answers: Answers | undefined;
}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);

  const create = useMutation(api.answers.create);

  async function submission() {
    return await create({
      Name: name,
      Instruction: question.Instruction ?? "",
      Question: question.Question,
      Answer: answer,
    });
  }

  function handleSubmit() {
    const trimmed = answer.trim();
    if (!trimmed) return;
    setSubmitted(true);
    if (question.Answer) {
      const correct = trimmed.toLowerCase() === question.Answer.toLowerCase();
      setFeedback(correct ? "correct" : "wrong");
    } else {
      setFeedback("submitted");
      submission();
    }
    // Uncomment to save to Convex:
    // submitAnswer({ questionId: question._id, answer: trimmed });
  }

  React.useEffect(() => {
    setAnswer(answers?.Answer ?? "");
  }, [answers]);

  return (
    <div
      className="group relative w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4 transition-all duration-300 hover:border-slate-700 focus-within:border-lime-500/40 focus-within:shadow-[0_0_0_1px_rgba(163,230,53,0.15)]"
      style={{ animation: `cardIn 0.4s cubic-bezier(0.34,1.2,0.64,1) both`, animationDelay: `${index * 60}ms` }}
    >
      {/* Subtle green glow on focus */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-lime-500/[0.04] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

      {/* Question number */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          Q {index + 1} of {total}
        </span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Instruction */}
      {question.Instruction && (
        <p className="text-lg text-slate-200 italic mb-2 whitespace-pre-line">{question.Instruction?.replace(/\\n/g, "\n")}</p>
      )}

      {/* Question text */}
      <p
        className="text-lg text-slate-100 leading-relaxed mb-5"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        {question.Question}
      </p>

      {/* Textarea */}
      <textarea
        className="w-full min-h-[80px] bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 resize-y outline-none transition-all duration-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-[family-name:var(--font-sans)]"
        placeholder="Type your answer here…"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
        rows={3}
      />

      {/* Feedback */}
      {feedback && (
        <div
          className={`flex items-start gap-2 mt-3 px-4 py-3 rounded-xl text-sm font-medium
            ${feedback === "correct" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : ""}
            ${feedback === "wrong" ? "bg-rose-500/10 border border-rose-500/30 text-rose-400" : ""}
            ${feedback === "submitted" ? "bg-lime-500/10 border border-lime-500/30 text-lime-400" : ""}
          `}
          style={{ animation: "fadeSlide 0.3s ease both" }}
        >
          {feedback === "correct" && <><span>✓</span><span>Correct!</span></>}
          {feedback === "wrong" && (
            <><span>✗</span><span>Incorrect{question.Answer ? ` — answer: ${question.Answer}` : ""}</span></>
          )}
          {feedback === "submitted" && <><span>✓</span><span>Answer submitted!</span></>}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end mt-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 text-slate-950 text-sm font-semibold transition-all duration-150 hover:bg-lime-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.35)] hover:-translate-y-px disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            Submit <span className="text-xs opacity-60">↵</span>
          </button>
        ) : (
            <button
              onClick={() => {
                setSubmitted(false);
                setFeedback(null); // ถ้ามี state นี้
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-600 text-slate-300 text-xs font-semibold transition-all duration-150 hover:bg-slate-800 hover:text-white"
            >
              Edit
            </button>
        )}
      </div>
    </div>
  );
}

// ── Summary Screen ────────────────────────────────────────────────────────────
function SummaryScreen({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const { emoji, label } = getRating(pct);
  return (
    <div
      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-8 py-10 text-center"
      style={{ animation: "cardIn 0.5s cubic-bezier(0.34,1.2,0.64,1) both" }}
    >
      <ScoreRing pct={pct} score={score} total={total} />
      <h2
        className="text-3xl text-slate-100 mb-2"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        {emoji} {label}
      </h2>
      <p className="text-sm text-slate-500 mb-8">
        You answered {score} out of {total} questions correctly.
      </p>
      <button
        onClick={onRestart}
        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-lime-400 text-slate-950 font-semibold transition-all hover:bg-lime-300 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)] hover:-translate-y-px"
      >
        ↩ Try Again
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const questions = useQuery(api.questions.get) as Question[] | undefined;
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentName = searchParams.get("name") ?? "Student";

  const answers = useQuery(api.answers.get, { Name: studentName }) as Answers[] | undefined;
  console.log(studentName, answers);

  const [key, setKey] = useState(0); // used to reset child state
  const [score] = useState(0);       // wire up if you track per-question score at page level
  const [showSummary, setShowSummary] = useState(false);

  const total = questions?.length ?? 0;

  function handleRestart() {
    setShowSummary(false);
    setKey((k) => k + 1);
  }

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
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
        <div className="w-full max-w-[660px]">

          {/* ── Header ── */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-mono tracking-[0.25em] text-lime-400 uppercase">
                Knowledge Check
              </p>
              <button
                onClick={() => router.push("/")}
                className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                ← Back
              </button>
            </div>
            <h1
              className="text-4xl sm:text-5xl text-slate-100 leading-tight mb-3"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Answer the <em className="text-lime-400 not-italic">questions</em> below
            </h1>
            {/* Student greeting */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-lime-400 flex items-center justify-center text-slate-950 text-xs font-bold shrink-0">
                {studentName[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-400">
                Good luck, <span className="text-lime-400 font-medium">{studentName}</span>!
              </span>
            </div>
          </div>

          {/* ── Progress ── */}
          {questions && (
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-[3px] bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(163,230,53,0.5)]"
                  style={{ width: `${total > 0 ? (Object.keys({}).length / total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                {total} questions
              </span>
            </div>
          )}

          {/* ── Loading ── */}
          {questions === undefined && (
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
              <span className="text-xs font-mono tracking-widest uppercase">Loading questions</span>
            </div>
          )}

          {/* ── Summary ── */}
          {showSummary && (
            <SummaryScreen score={score} total={total} onRestart={handleRestart} />
          )}

          {/* ── Question Cards ── */}
          {!showSummary &&
            questions?.map((question, idx) => {
              const matchedAnswer = answers?.find(
                (a) =>
                  a.Question === question.Question &&
                  a.Instruction === question.Instruction
              );

              return (
                <QuestionCard
                  key={`${key}-${question._id}`}
                  question={question}
                  index={idx}
                  total={total}
                  name={studentName}
                  answers={matchedAnswer}   // ✅ ส่งตัวเดียว
                />
              );
            })}

          {/* ── Finish button (shown when all answered — wire up as needed) ── */}
          {!showSummary && questions && questions.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowSummary(true)}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-lime-400 text-slate-950 font-semibold transition-all hover:bg-lime-300 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)] hover:-translate-y-px"
              >
                Finish Quiz →
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}