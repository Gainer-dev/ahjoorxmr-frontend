"use client";

import { useState, useRef, useCallback } from "react";
import { X, Users, DollarSign, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface CircleInfo {
  id: string;
  name: string;
  creator: string;
  members: string[];
  totalSlots: number;
  contribution: string;
  duration: string;
}

interface Props {
  circle: CircleInfo;
  onClose: () => void;
}

type State = "idle" | "loading" | "success" | "error";

function truncateAddress(addr: string): string {
  if (addr.length <= 14) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

export default function JoinCircleModal({ circle, onClose }: Props) {
  const [state, setState] = useState<State>("idle");
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, true, onClose);

  const handleConfirm = useCallback(async () => {
    setState("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      setState("success");
    } catch {
      setState("error");
    }
  }, []);

  const handleRetry = useCallback(() => setState("idle"), []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={state !== "loading" ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-[#ffffff14] overflow-hidden"
        style={{ background: "#1C1C1E" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#ffffff0f]">
          <h2 id="join-modal-title" className="text-lg font-bold text-white font-sora">
            Join Circle
          </h2>
          {state !== "loading" && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#ffffff0f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6B76]"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-6 py-6">
          {state === "success" ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-[#4ADE8020] flex items-center justify-center">
                <CheckCircle2 size={28} className="text-[#4ADE80]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">You joined the circle!</h3>
                <p className="text-sm text-[#A1A1AA]">
                  Welcome to <span className="text-white font-medium">{circle.name}</span>. You can now track it in your dashboard.
                </p>
              </div>
              <a
                href="/dashboard"
                className="mt-2 inline-block px-6 py-2.5 bg-[#4B6B76] hover:bg-[#3D5A64] text-white text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6B76] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1E]"
              >
                Go to Dashboard
              </a>
            </div>
          ) : state === "error" ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-[#FF5B5B20] flex items-center justify-center">
                <AlertCircle size={28} className="text-[#FF5B5B]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">Transaction failed</h3>
                <p className="text-sm text-[#A1A1AA]">
                  Something went wrong while joining the circle. Please try again.
                </p>
              </div>
              <div className="flex gap-3 mt-2 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-[#ffffff0a] hover:bg-[#ffffff14] text-white text-sm font-medium rounded-lg border border-[#ffffff14] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6B76]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRetry}
                  className="flex-1 px-4 py-2.5 bg-[#4B6B76] hover:bg-[#3D5A64] text-white text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6B76]"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Circle info */}
              <div className="rounded-xl bg-[#ffffff05] border border-[#ffffff0a] p-4 mb-5">
                <h3 className="text-base font-semibold text-white font-sora mb-3">{circle.name}</h3>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A1A1AA] flex items-center gap-1.5">
                      <Users size={13} aria-hidden="true" />
                      Members
                    </span>
                    <span className="text-white font-medium">
                      {circle.members.length}/{circle.totalSlots}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A1A1AA] flex items-center gap-1.5">
                      <DollarSign size={13} aria-hidden="true" />
                      Contribution
                    </span>
                    <span className="text-white font-medium">{circle.contribution}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A1A1AA] flex items-center gap-1.5">
                      <Clock size={13} aria-hidden="true" />
                      Duration
                    </span>
                    <span className="text-white font-medium">{circle.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-1 border-t border-[#ffffff0a]">
                    <span className="text-[#A1A1AA]">Organizer</span>
                    <span className="text-white font-mono text-xs">{truncateAddress(circle.creator)}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#A1A1AA] mb-5 leading-relaxed">
                By joining, you agree to make regular contributions for the full duration of this circle. Missed contributions may result in penalties.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-[#ffffff0a] hover:bg-[#ffffff14] text-white text-sm font-medium rounded-lg border border-[#ffffff14] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6B76]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={state === "loading"}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4B6B76] hover:bg-[#3D5A64] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6B76] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1E]"
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                      Joining...
                    </>
                  ) : (
                    "Confirm & Join"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
