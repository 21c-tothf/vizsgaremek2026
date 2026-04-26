import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import { adminApi } from "@/api/adminApi";
import type { AdminMessageItem } from "@/types/admin";
import { parseApiError } from "@/utils/apiError";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import Button from "@/components/ui/Button";

function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<number | null>(null);

  async function loadMessages() {
    setLoading(true);
    setError(null);

    try {
      const data = await adminApi.getMessages();
      setMessages(data);
    } catch (loadError) {
      const parsed = parseApiError(loadError, "Az admin üzenetek betöltése sikertelen.");
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMessages();
  }, []);

  async function markAsRead(id: number) {
    setMarkingId(id);
    setError(null);
    setSuccess(null);

    try {
      const updated = await adminApi.markMessageRead(id);
      setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, isRead: updated.isRead ?? true } : message)));
      setSuccess("Az üzenet olvasottnak jelölve.");
    } catch (updateError) {
      const parsed = parseApiError(updateError, "Az olvasottra jelölés végpont nem elérhető vagy hibát adott.");
      setError(parsed.message);
    } finally {
      setMarkingId(null);
    }
  }

  const unreadCount = useMemo(() => messages.filter((message) => !message.isRead).length, [messages]);

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle title="Admin üzenetek" subtitle="A piactér összes üzenetének áttekintése moderációs célból." />
        <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{unreadCount} olvasatlan</p>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}

      {loading ? (
        <div className="card-base h-72 animate-pulse" />
      ) : (
        <AdminTable headers={["Feladó", "Hirdetés", "Időpont", "Üzenet", "Állapot", "Műveletek"]}>
          {messages.map((message) => {
            const listingId = message.carId ?? message.listingId;
            const timestamp = message.sentAt || message.createdAt;

            return (
              <tr key={message.id}>
                <td className="px-4 py-3">#{message.senderId}</td>
                <td className="px-4 py-3">{listingId ? `Hirdetés #${listingId}` : "-"}</td>
                <td className="px-4 py-3">{timestamp ? new Date(timestamp).toLocaleString() : "-"}</td>
                <td className="px-4 py-3">
                  <p className="max-w-md whitespace-pre-wrap text-sm text-slate-700">{message.message}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={message.isRead ? "Olvasott" : "Olvasatlan"} tone={message.isRead ? "success" : "warning"} />
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={Boolean(message.isRead) || markingId === message.id}
                    onClick={() => void markAsRead(message.id)}
                  >
                    {markingId === message.id ? "Frissítés..." : message.isRead ? "Olvasott" : "Olvasottnak jelölés"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}
    </section>
  );
}

export default AdminMessagesPage;