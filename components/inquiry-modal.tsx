"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export function InquiryModal({
  label = "Request a conversation",
  className = "btn btn-outline",
}: {
  label?: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className={className}
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        {label} <ArrowUpRight aria-hidden="true" size={16} />
      </button>
      <dialog className="modal" ref={dialogRef}>
        <div className="modal-box max-w-2xl! bg-base-100 text-base-content">
          <form method="dialog">
            <button
              aria-label="Close inquiry form"
              className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3"
              type="submit"
            >
              ✕
            </button>
          </form>
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
            Job inquiry
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Tell us about the work.
          </h2>
          <p className="mt-2 mb-4 text-sm text-base-content/70">
            A person reads every request. This is the same form as the contact
            page — no separate booking desk, and no invented callback promise.
          </p>
          <ContactForm />
        </div>
        <form className="modal-backdrop" method="dialog">
          <button type="submit">Close</button>
        </form>
      </dialog>
    </>
  );
}
