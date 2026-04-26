import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/api/adminApi";
import type { AdminUserItem } from "@/types/admin";
import { parseApiError } from "@/utils/apiError";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [workingUserId, setWorkingUserId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserItem | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError(null);

    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (loadError) {
      const parsed = parseApiError(loadError, "A felhasználók betöltése sikertelen.");
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function deleteUser(userId: number) {
    setWorkingUserId(userId);
    setError(null);
    setSuccess(null);
    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setSuccess("Felhasználó törölve.");
    } catch (deleteError) {
      const parsed = parseApiError(deleteError, "A felhasználó törlése sikertelen.");
      setError(parsed.message);
    } finally {
      setWorkingUserId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }
    await deleteUser(deleteTarget.id);
    setDeleteTarget(null);
  }

  async function toggleUserStatus(user: AdminUserItem) {
    setWorkingUserId(user.id);
    setError(null);
    setSuccess(null);
    try {
      const updated = (user.isEnabled ?? true)
        ? await adminApi.disableUser(user.id)
        : await adminApi.enableUser(user.id);

      setUsers((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
      setSuccess((updated.isEnabled ?? true) ? "Felhasználó engedélyezve." : "Felhasználó letiltva.");
    } catch (statusError) {
      const parsed = parseApiError(statusError, "A felhasználó állapotának frissítése sikertelen.");
      setError(parsed.message);
    } finally {
      setWorkingUserId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    const normalizedName = nameFilter.trim().toLowerCase();
    const normalizedEmail = emailFilter.trim().toLowerCase();

    return users.filter((user) => {
      const nameMatch = !normalizedName || (user.name || "").toLowerCase().includes(normalizedName);
      const emailMatch = !normalizedEmail || (user.email || "").toLowerCase().includes(normalizedEmail);
      return nameMatch && emailMatch;
    });
  }, [users, nameFilter, emailFilter]);

  return (
    <section className="space-y-5">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Admin felhasználók</h1>
        <p className="text-sm text-zinc-100 sm:text-base">Fiókállapotok kezelése és regisztrált felhasználók felügyelete.</p>
      </header>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p> : null}

      <div className="card-base p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-user-filter-name" className="label-base">Szűrés név alapján</label>
            <input
              id="admin-user-filter-name"
              className="input-base"
              placeholder="pl. Teszt Felhasználó"
              value={nameFilter}
              onChange={(event) => setNameFilter(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="admin-user-filter-email" className="label-base">Szűrés e-mail alapján</label>
            <input
              id="admin-user-filter-email"
              className="input-base"
              placeholder="pl. user1@local.test"
              value={emailFilter}
              onChange={(event) => setEmailFilter(event.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card-base h-72 animate-pulse" />
      ) : (
        <AdminTable headers={["Felhasználó", "E-mail", "Szerepkör", "Állapot", "Csatlakozott", "Műveletek"]}>
          {filteredUsers.map((user) => {
            const isEnabled = user.isEnabled ?? true;
            return (
              <tr key={user.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <StatusBadge label={user.role} tone={user.role === "ADMIN" ? "warning" : "neutral"} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label={isEnabled ? "Engedélyezett" : "Letiltott"} tone={isEnabled ? "success" : "danger"} />
                </td>
                <td className="px-4 py-3">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className={isEnabled ? "border-amber-500 text-amber-700 hover:bg-amber-50" : "border-emerald-500 text-emerald-700 hover:bg-emerald-50"}
                      disabled={workingUserId === user.id || user.role === "ADMIN"}
                      onClick={() => void toggleUserStatus(user)}
                    >
                      {workingUserId === user.id ? "Frissítés..." : isEnabled ? "Letiltás" : "Engedélyezés"}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="border-danger-500 text-danger-500 hover:bg-red-50"
                      disabled={workingUserId === user.id || user.role === "ADMIN"}
                      onClick={() => setDeleteTarget(user)}
                    >
                      {user.role === "ADMIN" ? "Védett" : "Törlés"}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Felhasználó törlése"
        description={`Biztosan törölni szeretnéd ezt a felhasználót: "${deleteTarget?.name || "ismeretlen"}"? Ez a művelet nem vonható vissza.`}
        confirmLabel="Törlés"
        isConfirming={Boolean(deleteTarget && workingUserId === deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </section>
  );
}

export default AdminUsersPage;