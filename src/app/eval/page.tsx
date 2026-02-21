"use client";

import { useMutation, useQuery } from "convex/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";

type User = {
  _id: string;
  name: string;
};

export default function HomePage() {
  const users = useQuery(api.users.get) as User[] | undefined;
  const router = useRouter();

  const [selectedName, setSelectedName] = useState("");
  const [teacherName, setTeacherName] = useState<string>("");

  const teachers = ["Poi", "Nae", "AI"];

  const activeName = selectedName;
  const activeTeacher = teacherName;
  const canProceed = activeName.length > 0 && activeTeacher.length > 0;
  
  const create = useMutation(api.users.create);

  function handleStart() {
    if (!canProceed) return;
    router.push(`/teacher?teacher=${encodeURIComponent(activeTeacher)}&student=${encodeURIComponent(activeName)}`);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.1s both; }
        .anim-2 { animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.2s both; }
        .anim-3 { animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.3s both; }
        .anim-4 { animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.45s both; }
        select option { background: #0f172a; color: #f1f5f9; }
      `}</style>

      <main
        className="min-h-screen bg-[#080b10] flex flex-col items-center justify-center px-4"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(163,230,53,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 90% 90%, rgba(56,189,248,0.04) 0%, transparent 50%)",
        }}
      >
        <div className="w-full max-w-md">

          {/* Eyebrow */}
          <p className="anim-1 text-[10px] font-mono tracking-[0.3em] text-lime-400 uppercase mb-3 text-center">
            Quiz Platform
          </p>

          {/* Title */}
          <h1
            className="anim-2 text-center text-4xl sm:text-5xl text-slate-100 leading-tight mb-2"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Who&apos;s <em className="text-lime-400 not-italic">evaluating</em>
            <br />the quiz?
          </h1>

          <p className="anim-2 text-center text-sm text-slate-500 mb-10">
            Select evaluator and student name to begin.
          </p>

          {/* Main card */}
          <div className="anim-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40">

            {/* Select Evaluator */}
            <div>
              <label className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">
                Evaluator name
              </label>

              {users === undefined ? (
                <div className="flex items-center gap-2 h-12 px-4 bg-slate-800 border border-slate-700 rounded-xl">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-600">Loading evaluators…</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full appearance-none h-12 px-4 pr-10 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 outline-none transition-all duration-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 cursor-pointer"
                  >
                    <option value="" disabled>— choose your name —</option>
                    {teachers.map((value, index) => (
                      <option key={index} value={value}>{value}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Evaluator Name preview pill */}
            {activeTeacher &&  (
              <div
                className="mt-4 flex items-center gap-2 px-3 py-2 bg-lime-500/10 border border-lime-500/25 rounded-xl"
                style={{ animation: "fadeUp 0.25s ease both" }}
              >
                <div className="w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center text-slate-950 text-xs font-bold shrink-0">
                  {activeTeacher[0].toUpperCase()}
                </div>
                <span className="text-sm text-lime-300 font-medium truncate">{activeTeacher}</span>
                <span className="ml-auto text-[10px] font-mono text-lime-600 uppercase tracking-wider">ready</span>
              </div>
            )}


            {/* Select Student */}
            <div>
              <label className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2 pt-4">
                Student name
              </label>

              {users === undefined ? (
                <div className="flex items-center gap-2 h-12 px-4 bg-slate-800 border border-slate-700 rounded-xl">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-600">Loading students…</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="w-full appearance-none h-12 px-4 pr-10 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 outline-none transition-all duration-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 cursor-pointer"
                  >
                    <option value="" disabled>— choose your name —</option>
                    {users.map((u) => (
                      <option key={u._id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            

            {/* Name preview pill */}
            {activeName &&  (
              <div
                className="mt-4 flex items-center gap-2 px-3 py-2 bg-lime-500/10 border border-lime-500/25 rounded-xl"
                style={{ animation: "fadeUp 0.25s ease both" }}
              >
                <div className="w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center text-slate-950 text-xs font-bold shrink-0">
                  {activeName[0].toUpperCase()}
                </div>
                <span className="text-sm text-lime-300 font-medium truncate">{activeName}</span>
                <span className="ml-auto text-[10px] font-mono text-lime-600 uppercase tracking-wider">ready</span>
              </div>
            )}
          </div>

          {/* Start button */}
          <div className="anim-4 mt-4">
            <button
              onClick={handleStart}
              disabled={!canProceed}
              className="w-full h-14 rounded-xl bg-lime-400 text-slate-950 font-semibold text-base tracking-wide transition-all duration-150
                hover:bg-lime-300 hover:shadow-[0_0_28px_rgba(163,230,53,0.4)] hover:-translate-y-0.5
                disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                active:scale-[0.98]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Start Evaluate →
            </button>
          </div>

          <p className="anim-4 text-center text-[11px] font-mono text-slate-700 mt-5 tracking-wider">
            YOUR NAME WILL APPEAR ON YOUR RESULTS
          </p>
        </div>
      </main>
    </>
  );
}