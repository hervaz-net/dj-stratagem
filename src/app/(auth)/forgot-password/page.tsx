import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a secure password reset link for your D&J Stratagem account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <section className="grid min-h-svh place-items-center px-4 py-10">
      <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <AuthForm mode="forgot" />
        </div>
      </div>
    </section>
  );
}
