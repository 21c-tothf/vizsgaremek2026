import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { usersApi } from "@/api/usersApi";
import type { UpdateUserMeRequest, UserMeResponse } from "@/types/account";
import { parseApiError } from "@/utils/apiError";
import axios from "axios";

function ProfilePage() {
  const { user, isAdmin } = useAuth();

  const [profile, setProfile] = useState<UserMeResponse | null>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileEndpointSupported, setProfileEndpointSupported] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const data = await usersApi.getMe();
        setProfile(data);
        setName(data.name || "");
        setPhoneNumber(data.phoneNumber || "");
      } catch (loadError) {
        if (axios.isAxiosError(loadError) && loadError.response?.status === 404) {
          setProfileEndpointSupported(false);
          const fallback: UserMeResponse | null = user
            ? {
                id: user.id,
                name: user.displayName,
                email: user.email,
                role: String(user.role)
              }
            : null;
          setProfile(fallback);
          setName(fallback?.name || "");
          setPhoneNumber(fallback?.phoneNumber || "");
        } else {
          const parsed = parseApiError(loadError, "A profil betöltése sikertelen.");
          setError(parsed.message);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [user]);

  const createdAtLabel = useMemo(() => {
    if (!profile?.createdAt) {
      return "-";
    }
    return new Date(profile.createdAt).toLocaleString();
  }, [profile?.createdAt]);

  const canViewAccountSummary = isAdmin;

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profileEndpointSupported) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: UpdateUserMeRequest = {
        name: name.trim(),
        phoneNumber: phoneNumber.trim() || undefined
      };

      const updated = await usersApi.updateMe(payload);
      setProfile(updated);
      setName(updated.name || "");
      setPhoneNumber(updated.phoneNumber || "");
      setSuccess("A profil sikeresen frissítve.");
    } catch (saveError) {
      const parsed = parseApiError(saveError, "A profil frissítése sikertelen.");
      setError(parsed.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="card-base h-64 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Profil</h1>
        <p className="text-sm text-zinc-100 sm:text-base">Kezeld a fiókadataidat és az elérhetőségeidet.</p>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}
      {!profileEndpointSupported ? (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          A profil szerkesztési végpont nem érhető el a backendben. A bejelentkezett felhasználó adatai láthatók.
        </p>
      ) : null}

      <div className={`grid gap-5 ${canViewAccountSummary ? "lg:grid-cols-[1.35fr,1fr]" : ""}`}>
        <form onSubmit={handleSave} className="card-base space-y-4 p-5">
          <h2 className="text-lg font-bold text-black">Fiók adatai</h2>

          <div>
            <label htmlFor="profile-name" className="label-base">Név</label>
            <input
              id="profile-name"
              className="input-base"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!profileEndpointSupported}
            />
          </div>

          <div>
            <label htmlFor="profile-phone" className="label-base">Telefonszám</label>
            <input
              id="profile-phone"
              className="input-base"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              disabled={!profileEndpointSupported}
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="label-base">E-mail</label>
            <input id="profile-email" className="input-base" value={profile?.email || user?.email || ""} readOnly />
          </div>

          <Button type="submit" disabled={!profileEndpointSupported || saving || !name.trim()}>
            {saving ? "Mentés..." : "Profil mentése"}
          </Button>
        </form>

        {canViewAccountSummary ? (
          <aside className="card-base space-y-3 p-5 text-sm text-slate-700">
            <h2 className="text-lg font-bold text-slate-900">Fiók összegzés</h2>
            <p><span className="font-semibold">Felhasználó ID:</span> {profile?.id ?? user?.id ?? "-"}</p>
            <p><span className="font-semibold">Szerepkör:</span> {profile?.role ?? user?.role ?? "-"}</p>
            <p><span className="font-semibold">Létrehozva:</span> {createdAtLabel}</p>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

export default ProfilePage;