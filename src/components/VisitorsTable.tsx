"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { useToasts } from "./Toasts";

type Visitor = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  createdAt: string;
};

export default function VisitorsTable({ initial }: { initial: Visitor[] }) {
  const [visitors, setVisitors] = useState<Visitor[]>(initial);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const toasts = useToasts();

  async function handleDelete(id: number) {
    setConfirmId(id);
  }

  async function confirmDelete(id: number) {
    setLoadingIds((s) => [...s, id]);
    try {
      const res = await fetch(`/api/visitors/${id}/delete`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      setVisitors((v) => v.filter((x) => x.id !== id));
      toasts.push({ type: "success", message: "Deleted" });
    } catch (err) {
      console.error(err);
      toasts.push({ type: "error", message: "Delete failed" });
    } finally {
      setLoadingIds((s) => s.filter((x) => x !== id));
      setConfirmId(null);
    }
  }

  async function handleExport() {
    try {
      const res = await fetch("/api/visitors/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "visitors.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  }

  return (
    <div>
      <div className="mt-4">
        <button onClick={handleExport} className="mr-2">Export CSV</button>
      </div>
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Email</th>
            <th className="text-left">Phone</th>
            <th className="text-left">Company</th>
            <th className="text-left">When</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => (
            <tr key={v.id} className="border-t">
              <td>{v.firstName} {v.lastName}</td>
              <td>{v.email}</td>
              <td>{v.phone ?? '-'}</td>
              <td>{v.company ?? '-'}</td>
              <td>{new Date(v.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleDelete(v.id)}
                  disabled={loadingIds.includes(v.id)}
                  className="text-sm text-red-600"
                >
                  {loadingIds.includes(v.id) ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        open={confirmId !== null}
        title="Delete visitor"
        onClose={() => setConfirmId(null)}
        onConfirm={() => confirmDelete(confirmId as number)}
        confirmLabel="Delete"
      >
        <p>Are you sure you want to delete this visitor? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
