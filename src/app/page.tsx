"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  name: string;
};

type InputMode = "select" | "type";

export default function HomePage() {
  const users = useQuery(api.users.get) as User[] | undefined;
  const router = useRouter();

  const [mode, setMode] = useState<InputMode>("select");
  const [selectedName, setSelectedName] = useState("");
  const [typedName, setTypedName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const activeName = mode === "select" ? selectedName : typedName.trim();
  const canProceed = activeName.length > 0;

  const create = useMutation(api.users.create);

  function handleStart() {
    if (!canProceed) return;
    setShowModal(true);
  }

  async function handleConfirm() {
    await create({ name: activeName });
    router.push(`/student?name=${encodeURIComponent(activeName)}`);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&family=Sarabun:wght@300;400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.1s both; }
        .anim-2 { animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.2s both; }
        .anim-3 { animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.3s both; }
        .anim-4 { animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.45s both; }
        .modal-overlay { animation: fadeIn 0.2s ease both; }
        .modal-card { animation: scaleUp 0.25s cubic-bezier(0.34,1.1,0.64,1) both; }
        select option { background: #0f172a; color: #f1f5f9; }
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .section-dot::before {
          content: '';
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #a3e635;
          margin-right: 8px;
          vertical-align: middle;
          flex-shrink: 0;
        }
      `}</style>

      {/* ─── Research Consent Modal ─── */}
      {showModal && (
        <div
          className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(8,11,16,0.85)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="modal-card w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 flex flex-col"
            style={{ maxHeight: "90vh" }}
          >
            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono tracking-[0.25em] text-lime-400 uppercase">
                  ข้อมูลงานวิจัย
                </span>
                <span className="h-px flex-1 bg-slate-800" />
                <span className="text-[10px] font-mono text-slate-600">TAIST-Science Tokyo</span>
              </div>
              <h2
                className="text-xl text-slate-100 leading-snug mt-2"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                ยินดีต้อนรับสู่
                <br />
                <em className="text-lime-400 not-italic">แบบทดสอบงานวิจัย</em>
              </h2>
              <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: "'Sarabun', sans-serif" }}>
                กรุณาอ่านรายละเอียดก่อนเริ่มทำแบบทดสอบ
              </p>
            </div>

            {/* Modal Scrollable Body */}
            <div className="modal-scroll overflow-y-auto px-6 py-5 flex-1 space-y-5" style={{ fontFamily: "'Sarabun', sans-serif" }}>

              {/* Researcher info */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-3">ผู้วิจัย</p>
                <p className="text-sm font-semibold text-slate-100">นายชุติพนธ์ ตรีรัตนานุรักษ์</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  นักศึกษาปริญญาโท สาขา วิศวกรรมปัญญาประดิษฐ์และอินเทอร์เน็ตของสรรพสิ่ง
                  <br />
                  โครงการ TAIST-Science Tokyo · สถาบันนานาชาติสิรินธร มหาวิทยาลัยธรรมศาสตร์
                </p>
              </div>

              {/* Research title */}
              <div>
                <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">หัวข้องานวิจัย</p>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3 italic">
                  "AI Assisted Grading Framework for Thai-Language Written Exam Questions based on LLM and Rule-Based Reasoning Approach"
                </p>
              </div>

              {/* Objective */}
              <div>
                <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">วัตถุประสงค์</p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  เว็บไซต์นี้จัดทำขึ้นเพื่อ<span className="text-slate-200 font-medium">รวบรวมคำตอบจากการทำข้อสอบภาษาไทยแบบข้อเขียน</span> เพื่อใช้เป็นข้อมูลในการศึกษาวิจัยเกี่ยวกับการประเมินคำตอบของผู้เรียนด้วยเทคโนโลยีปัญญาประดิษฐ์และวิธีการให้เหตุผลเชิงกฎเกณฑ์
                </p>
              </div>

              {/* Exam format */}
              <div>
                <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">รูปแบบข้อสอบ</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-lime-500/10 border border-lime-500/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-lime-400" style={{ fontFamily: "'DM Serif Display', serif" }}>55</p>
                    <p className="text-[11px] text-lime-600 font-mono tracking-wider uppercase mt-0.5">ข้อ</p>
                  </div>
                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 text-center">
                    <p className="text-lg font-semibold text-sky-400 leading-tight mt-1">ข้อเขียน</p>
                    <p className="text-[11px] text-sky-600 font-mono tracking-wider uppercase mt-0.5">รูปแบบ</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ครอบคลุมทักษะการใช้ภาษาไทยหลายรูปแบบ เช่น การอธิบาย การยกตัวอย่าง การเขียนข้อความ และการแสดงความคิดเห็น
                </p>
              </div>

              {/* Progress saving */}
              <div className="flex gap-3 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-lime-500/15 border border-lime-500/25 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2v4l2 2" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="8" cy="9" r="5" stroke="#a3e635" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 mb-1">บันทึกความคืบหน้า</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    ระบบสามารถบันทึก Progress ได้ สามารถกลับมาทำต่อจากจุดเดิมได้ โดยไม่ต้องทำให้เสร็จภายในครั้งเดียว
                  </p>
                </div>
              </div>

              {/* Data usage */}
              <div>
                <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">การนำข้อมูลไปใช้</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  คำตอบและข้อมูลทั้งหมดจะถูกนำไปใช้<span className="text-slate-200 font-medium">เพื่อวัตถุประสงค์ทางการวิจัยเท่านั้น</span> ได้แก่
                </p>
                <div className="space-y-2">
                  {[
                    "การวิเคราะห์รูปแบบคำตอบของผู้ทำข้อสอบ",
                    "การทดลองระบบการประเมินคำตอบด้วยโมเดลภาษา (Large Language Models)",
                    "การเปรียบเทียบผลการให้คะแนนระหว่างระบบอัตโนมัติและผู้ประเมินมนุษย์",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consent notice */}
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                <p className="text-[10px] font-mono tracking-widest text-amber-500 uppercase mb-2">การยินยอมเข้าร่วม</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  การกด <span className="text-slate-200 font-semibold">"ยอมรับและเริ่มทำแบบทดสอบ"</span> ถือว่าท่านยินยอมให้ข้อมูลคำตอบของท่านถูกนำไปใช้เพื่อวัตถุประสงค์ทางการวิจัยตามที่ระบุไว้ข้างต้น
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-slate-800 shrink-0 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 h-11 rounded-xl border border-slate-700 text-slate-400 text-sm font-medium hover:text-slate-200 hover:border-slate-600 transition-all duration-150"
                style={{ fontFamily: "'Sarabun', sans-serif" }}
              >
                ย้อนกลับ
              </button>
              <button
                onClick={handleConfirm}
                className="flex-[2] h-11 rounded-xl bg-lime-400 text-slate-950 font-semibold text-sm tracking-wide transition-all duration-150
                  hover:bg-lime-300 hover:shadow-[0_0_24px_rgba(163,230,53,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ fontFamily: "'Sarabun', sans-serif" }}
              >
                ยอมรับและเริ่มทำแบบทดสอบ →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Page ─── */}
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
            Who&apos;s <em className="text-lime-400 not-italic">taking</em>
            <br />the quiz?
          </h1>

          <p className="anim-2 text-center text-sm text-slate-500 mb-10">
            Select your name or enter it manually to begin.
          </p>

          {/* Main card */}
          <div className="anim-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/40">

            {/* Mode toggle */}
            <div className="flex bg-slate-800 rounded-xl p-1 mb-6 gap-1">
              {(["select", "type"] as InputMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setSelectedName(""); setTypedName(""); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono tracking-widest uppercase transition-all duration-200
                    ${mode === m
                      ? "bg-slate-700 text-lime-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                  {m === "select" ? "Select name" : "Type name"}
                </button>
              ))}
            </div>

            {/* Select mode */}
            {mode === "select" && (
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">
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
            )}

            {/* Type mode */}
            {mode === "type" && (
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  placeholder="e.g. Alex Johnson"
                  autoFocus
                  className="w-full h-12 px-4 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                />
              </div>
            )}

            {/* Name preview pill */}
            {activeName && (
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
              Start Quiz →
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