import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Auth() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">
          {isSignUp ? "Create Your Account" : "Log in to Flowva"}
        </h1>
        <p className="auth-subtitle">
          {isSignUp
            ? "Sign up to manage your tools"
            : "Log in to continue"}
        </p>

        <form onSubmit={handleAuth}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-primary-btn" disabled={loading}>
            {loading
              ? "Loading..."
              : isSignUp
              ? "Sign up Account"
              : "Sign in"}
          </button>

          {error && <p className="auth-error">{error}</p>}
        </form>

        <div className="auth-divider">or</div>

        <button className="auth-google-btn">
          Sign in with Google
        </button>

        <div className="auth-toggle">
          {isSignUp ? "Already have an account? " : "Don’t have an account? "}
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
