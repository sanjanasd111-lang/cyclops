"use client";

// @ts-ignore
import { useChat } from "ai/react";
import { Bot, Send, User, Sparkles } from "lucide-react";

interface CopilotProps {
  role?: string;
  context?: Record<string, any>;
  className?: string;
}

export function CopilotChat({ role = "STUDENT", context = {}, className = "" }: CopilotProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai/copilot",
    body: { userRole: role, profileContext: context },
  });

  return (
    <div className={`flex flex-col h-[520px] w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden text-slate-100 ${className}`}>
      {/* Header */}
      <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 border border-slate-700 p-0.5 overflow-hidden">
            <img src="/cyclops-icon.png" alt="Cyclops" className="h-full w-full object-contain rounded-full" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Cyclops AI Copilot</h3>
            <p className="text-[10px] text-slate-400 font-mono">Streaming Token Intelligence</p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-md">
          {role}
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/50 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-8">
            <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
              <Bot className="h-6 w-6" />
            </div>
            <p className="text-sm text-slate-300 font-medium">How can I assist you today?</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Ask about your skill scores, curriculum recommendations, clinical trial protocols, or job opportunities.
            </p>
          </div>
        )}

        {messages.map((m: any) => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed transition-all ${
              m.role === "user"
                ? "ml-auto bg-emerald-600 text-white shadow-md"
                : "mr-auto bg-slate-900 text-slate-200 border border-slate-800 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider mb-1 opacity-70">
              {m.role === "user" ? (
                <>
                  <User className="h-3 w-3" /> You
                </>
              ) : (
                <>
                  <Bot className="h-3 w-3 text-emerald-400" /> Copilot
                </>
              )}
            </div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 italic bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg w-fit">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-emerald-400" />
            <span>Copilot is generating streaming response...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-slate-800 p-3 bg-slate-950 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask Copilot a question..."
          className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-md"
        >
          <span>Send</span>
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
