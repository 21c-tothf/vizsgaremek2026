import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { messagesApi } from "@/api/messagesApi";
import { parseApiError } from "@/utils/apiError";

interface ContactFormProps {
  listingId: number;
  receiverId: number;
}

function ContactForm({ listingId, receiverId }: ContactFormProps) {
  const { isAuthenticated, user } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isAuthenticated || !user) {
      setError("Jelentkezz be az eladó kapcsolatfelvételéhez.");
      return;
    }

    if (message.trim().length < 5) {
      setError("Az üzenet legalább 5 karakterből álljon.");
      return;
    }

    setLoading(true);
    try {
      await messagesApi.sendMessage({
        carId: listingId,
        senderId: user.id,
        receiverId,
        message: message.trim()
      });
      setMessage("");
      setSuccess("Az üzenet sikeresen elküldve.");
    } catch (submitError) {
      const parsed = parseApiError(submitError, "Az üzenet küldése most nem sikerült.");
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold text-black">Kapcsolat az eladóval</h2>
        <p className="mt-1 text-sm text-slate-600">Kérdezz rá az autó állapotára, előéletére és próbakör lehetőségre.</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <label htmlFor="contact-message" className="label-base">
            Üzeneted
          </label>
          <textarea
            id="contact-message"
            className="input-base min-h-28 resize-y"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Szia! Érdekel ez az autó. Megvan még?"
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-success-500">{success}</p> : null}

          {!isAuthenticated ? (
            <Link to="/login" className="text-sm font-semibold text-brand-900">
              Bejelentkezés az üzenetküldéshez
            </Link>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Küldés..." : "Üzenet küldése"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ContactForm;