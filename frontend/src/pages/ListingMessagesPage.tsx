import { useEffect, useMemo, useState } from "react";
import { messagesApi } from "@/api/messagesApi";
import type { MessageResponse, MessageThreadResponse } from "@/types/messages";
import { parseApiError } from "@/utils/apiError";
import Button from "@/components/ui/Button";

interface FlatMessage {
  id: number;
  carId: number;
  senderId: number;
  receiverId: number;
  message: string;
  sentAt: string;
  isRead?: boolean;
  listingTitle?: string;
}

function ListingMessagesPage() {
  const [messages, setMessages] = useState<FlatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [markingReadId, setMarkingReadId] = useState<number | null>(null);

  async function loadMessages() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await messagesApi.getMyListingsMessages();

      const flat: FlatMessage[] = Array.isArray(data)
        ? (data as Array<MessageThreadResponse | MessageResponse>).flatMap((item) => {
            if ("messages" in item) {
              return item.messages.map((message) => ({
                ...message,
                listingTitle: item.listingTitle
              }));
            }
            return [item as MessageResponse];
          })
        : [];

      flat.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
      setMessages(flat);
    } catch (loadError) {
      const parsed = parseApiError(loadError, "A hirdetéseidhez tartozó üzenetek betöltése sikertelen.");
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMessages();
  }, []);

  async function markAsRead(messageId: number) {
    setMarkingReadId(messageId);
    setError(null);
    setSuccess(null);

    try {
      const updated = await messagesApi.markAsRead(messageId);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? {
                ...message,
                isRead: updated.isRead ?? true
              }
            : message
        )
      );
      setSuccess("Az üzenet olvasottnak jelölve.");
    } catch (updateError) {
      const parsed = parseApiError(updateError, "Az olvasottra jelölés nem támogatott vagy sikertelen.");
      setError(parsed.message);
    } finally {
      setMarkingReadId(null);
    }
  }

  const unreadCount = useMemo(() => messages.filter((message) => !message.isRead).length, [messages]);

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Hirdetés üzenetek</h1>
          <p className="text-sm text-zinc-100 sm:text-base">Az érdeklődőktől érkező üzenetek a hirdetéseidhez.</p>
        </div>
        <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{unreadCount} olvasatlan</p>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="card-base h-28 animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="card-base p-6 text-sm text-slate-600">Nem található üzenet a hirdetéseidhez.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <article key={message.id} className="card-base p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Listing #{message.carId} {message.listingTitle ? `- ${message.listingTitle}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{new Date(message.sentAt).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${message.isRead ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {message.isRead ? "Olvasott" : "Olvasatlan"}
                </span>
              </div>

              <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-800">{message.message}</p>

              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={Boolean(message.isRead) || markingReadId === message.id}
                  onClick={() => void markAsRead(message.id)}
                >
                  {markingReadId === message.id ? "Frissítés..." : message.isRead ? "Már olvasott" : "Olvasottnak jelölés"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ListingMessagesPage;