import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
  const _navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Replace with actual login API endpoint
      // For now, this is a placeholder for client-side validation
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Simulate API call
      setTimeout(() => {
        // TODO: Handle actual authentication
        console.log("Login attempt:", { email, password });
        // _navigate("/dashboard"); // Redirect after successful login
        setLoading(false);
      }, 500);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-ink-2 to-ink">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="rounded-lg border border-line/50 bg-ink/80 backdrop-blur p-8">
          <h1 className="mb-2 text-3xl font-bold text-paper">Sign In</h1>
          <p className="mb-8 text-steel">Access your D&J Stratagem account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-paper mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-line bg-ink-2 px-4 py-2.5 text-paper placeholder-steel/50 transition-colors focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-paper mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-line bg-ink-2 px-4 py-2.5 text-paper placeholder-steel/50 transition-colors focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/20"
              />
            </div>

            {error && <div className="rounded-md bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm text-red-400">{error}</div>}

            <Button type="submit" variant="primary" className="w-full mt-6" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-steel">
              Don't have an account?{" "}
              <a href="#" className="text-amber hover:text-amber-2 font-medium">
                Contact us for access
              </a>
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-ink px-2 text-steel">Or</span>
              </div>
            </div>
            <p className="text-center text-sm text-steel">
              <a href="#" className="text-amber hover:text-amber-2 font-medium">
                Forgot your password?
              </a>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-steel">
          This is a secure login portal for D&J Stratagem platform users.
        </p>
      </div>
    </div>
  );
}
