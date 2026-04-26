import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { parseApiError } from "@/utils/apiError";

interface LoginFormErrors {
  email?: string;
  password?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(): LoginFormErrors {
    const nextErrors: LoginFormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Az e-mail cím kötelező.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Adj meg egy érvényes e-mail címet.";
    }

    if (!password) {
      nextErrors.password = "A jelszó kötelező.";
    } else if (password.length < 8) {
      nextErrors.password = "A jelszónak legalább 8 karakteresnek kell lennie.";
    }

    return nextErrors;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    setError(null);
    setErrorDetails([]);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await login({ email, password });
      setSuccessMessage("Sikeres bejelentkezés. Átirányítás...");

      const locationState = location.state as { from?: string } | null;
      const targetPath = locationState?.from || (isAdmin ? "/dashboard" : "/dashboard");
      navigate(targetPath, { replace: true });
    } catch (submitError) {
      const parsed = parseApiError(submitError, "Sikertelen bejelentkezés. Ellenőrizd a megadott adatokat.");
      setError(parsed.message);
      setErrorDetails(parsed.details);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <Card>
        <CardContent className="p-6 sm:p-8">
          <SectionTitle title="Bejelentkezés" subtitle="Érd el mentett kedvenceidet és hirdetéseidet." />
          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <InputField
              id="login-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              error={errors.email}
              required
            />
            <InputField
              id="login-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Jelszavad"
              error={errors.password}
              required
            />

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {errorDetails.length > 0 ? (
              <ul className="space-y-1 text-xs text-red-600">
                {errorDetails.map((detail) => (
                  <li key={detail}>- {detail}</li>
                ))}
              </ul>
            ) : null}
            {successMessage ? <p className="text-sm text-success-500">{successMessage}</p> : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <LoadingSpinner size="sm" label="Bejelentkezés..." className="text-white" /> : "Bejelentkezés"}
            </Button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Nincs még fiókod?{" "}
            <Link to="/register" className="font-semibold text-brand-900">
              Regisztráció
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

export default LoginPage;