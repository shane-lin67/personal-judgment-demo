import { cn } from "@/lib/utils";
import { ConversationMessage } from "@/lib/types";

export function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
          isUser && "bg-slate-950 text-slate-50",
          isAssistant && "bg-white text-slate-800",
          message.role === "system" && "bg-amber-50 text-amber-900"
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-3 text-xs opacity-70">
          <span className="uppercase tracking-wide">{message.role}</span>
          <span>{message.timestampLabel}</span>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
      </div>
    </div>
  );
}
