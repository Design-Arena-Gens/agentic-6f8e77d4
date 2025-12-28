"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage, ChatMessageData } from "@/components/chat-message";
import {
  INITIAL_AGENT_STATE,
  advanceConversation,
  AgentState,
} from "@/lib/researcher";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [input, setInput] = useState("");
  const [agentState, setAgentState] = useState<AgentState>(INITIAL_AGENT_STATE);
  const [messages, setMessages] = useState<ChatMessageData[]>(() => [
    {
      id: uuid(),
      role: "agent",
      type: "text",
      text: "Hi! I'm your Cooking Researcher. When you're ready to kick things off, just type “hello lets start” and I’ll guide you through planning what to cook.",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }

    const userMessage: ChatMessageData = {
      id: uuid(),
      role: "user",
      type: "text",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    window.requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
    });

    const userText = userMessage.text ?? "";
    const { response, nextState } = advanceConversation(userText, agentState);

    setAgentState(nextState);

    const agentMessage: ChatMessageData =
      response.type === "text"
        ? {
            id: uuid(),
            role: "agent",
            type: "text",
            text: response.message,
            timestamp: new Date(),
          }
        : {
            id: uuid(),
            role: "agent",
            type: "summary",
            summary: response,
            timestamp: new Date(),
          };

    // small delay for conversational pacing
    setTimeout(() => {
      setMessages((prev) => [...prev, agentMessage]);
      setIsProcessing(false);
    }, 320);
  };

  const placeholderText = useMemo(() => {
    if (agentState.stage === "waitingStart") {
      return "Type “hello lets start” to begin.";
    }
    if (agentState.stage === "gathering") {
      return "Share your thoughts…";
    }
    return "Ask for groceries, timeline, techniques, or a fresh research angle…";
  }, [agentState.stage]);

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-zinc-100 font-sans text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_55%)]" />
      <header className="relative z-10 border-b border-zinc-200/60 bg-white/70 px-6 py-10 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/70">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">
            Guided Culinary Research
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Agentic Cooking Companion
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Share what you want to cook and I’ll investigate the best path—from
            ingredient strategy to technique drills. Say “hello lets start” to
            activate discovery mode.
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 pb-36 pt-8 sm:px-6 lg:px-8">
        <section className="flex flex-1 flex-col gap-4 overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-900/70">
          <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4 dark:border-zinc-800/60">
            <div>
              <h2 className="text-lg font-semibold">Researcher Stream</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Insights tailored to your cooking ambitions.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300">
              Agent online
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={scrollAnchorRef} />
          </div>
        </section>
      </main>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative z-20 mx-auto flex w-full max-w-4xl items-end gap-3 rounded-3xl border border-zinc-200/80 bg-white/80 px-5 py-4 shadow-lg backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80"
      >
        <div className="flex-1">
          <label htmlFor="chat-input" className="sr-only">
            Chat with the cooking researcher agent
          </label>
          <textarea
            id="chat-input"
            className="h-20 w-full resize-none rounded-2xl border border-transparent bg-transparent px-3 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-emerald-300 focus:bg-white focus:ring-1 focus:ring-emerald-300 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            placeholder={placeholderText}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isProcessing}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-400 dark:focus-visible:ring-offset-zinc-900"
          disabled={isProcessing || !input.trim()}
        >
          {isProcessing ? (
            <>
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              Working…
            </>
          ) : (
            <>
              Send
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="22" x2="11" y1="2" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
