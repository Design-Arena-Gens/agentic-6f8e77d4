import { AgentSummaryResponse } from "@/lib/researcher";
import clsx from "clsx";

export type ChatMessageKind = "text" | "summary";

export interface ChatMessageData {
  id: string;
  role: "agent" | "user";
  type: ChatMessageKind;
  text?: string;
  summary?: AgentSummaryResponse;
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.type === "summary" && message.summary) {
    return (
      <article
        className="w-full rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80"
        aria-label={message.summary.title}
      >
        <header className="mb-4 space-y-1">
          <p className="text-xs uppercase tracking-wide text-emerald-500">
            Research snapshot
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {message.summary.title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {message.summary.headline}
          </p>
        </header>
        <div className="space-y-4">
          {message.summary.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {section.heading}
              </h3>
              <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <footer className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          {message.summary.followUpPrompt}
        </footer>
      </article>
    );
  }

  return (
    <div
      className={clsx("flex w-full", {
        "justify-end": message.role === "user",
        "justify-start": message.role === "agent",
      })}
    >
      <p
        className={clsx(
          "max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
          message.role === "user"
            ? "bg-emerald-600 text-white"
            : "border border-zinc-200 bg-white/90 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-50"
        )}
      >
        {message.text}
      </p>
    </div>
  );
}
