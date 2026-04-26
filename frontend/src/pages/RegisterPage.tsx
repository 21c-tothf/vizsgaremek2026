import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { parseApiError } from "@/utils/apiError";

interface RegisterFormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(): RegisterFormErrors {
    const nextErrors: RegisterFormErrors = {};

    if (name.trim().length < 2) {
      nextErrors.name = "A névnek legalább 2 karakteresnek kell lennie.";
    }

    if (!email.trim()) {
      nextErrors.email = "Az e-mail cím kötelező.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Adj meg egy érvényes e-mail címet.";
    }

    if (phoneNumber && phoneNumber.length > 20) {
      nextErrors.phoneNumber = "A telefonszám legfeljebb 20 karakter lehet.";
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
      await register({
        name,
        email,
        password,
        phoneNumber: phoneNumber.trim() || undefined
      });
      setSuccessMessage("Sikeres regisztráció. Átirányítás...");
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      const parsed = parseApiError(submitError, "A regisztráció sikertelen. Ellenőrizd az adatokat, és próbáld újra.");
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
          <SectionTitle title="Fiók létrehozása" subtitle="Csatlakozz, és kezdd el kezelni hirdetéseidet és kedvenceidet." />
          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <InputField
              id="register-name"
              label="Teljes név"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Teljes neved"
              error={errors.name}
              required
            />
            <InputField
              id="register-email"
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
              id="register-phone-number"
              label="Telefonszám (opcionális)"
              type="tel"
              autoComplete="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+36 30 123 4567"
              error={errors.phoneNumber}
            />
            <InputField
              id="register-password"
              label="Jelszó"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Válassz erős jelszót"
              error={errors.password}
              hint="Minimum 8 karakter"
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
              {loading ? <LoadingSpinner size="sm" label="Fiók létrehozása..." className="text-white" /> : "Fiók létrehozása"}
            </Button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Már regisztráltál?{" "}
            <Link to="/login" className="font-semibold text-brand-900">
              Bejelentkezés
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

export default RegisterPage;