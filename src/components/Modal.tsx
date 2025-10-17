"use client";

import React from "react";

export default function Modal({ open, title, children, onClose, onConfirm, confirmLabel = "Confirm" }: {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  confirmLabel?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-lg p-6 z-10 w-full max-w-md">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1">Cancel</button>
          <button
            onClick={async () => { await onConfirm(); }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
