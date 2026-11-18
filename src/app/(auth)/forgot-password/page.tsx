import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a secure password reset link for your D&J Stratagem account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <section className="auth-single auth-forgot-page">
      <AuthForm mode="forgot" />
    </section>
  );
}
