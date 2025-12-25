import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { Star, Share2, Users } from "lucide-react";
import "./rewards.css";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DAILY_POINTS = 5;

const Rewards = () => {
  const { session } = useAuth();

  const [profile, setProfile] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("earn");
  const [redeemFilter, setRedeemFilter] = useState("all");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      const { data: rewardsData } = await supabase
        .from("rewards")
        .select("*")
        .order("points_required", { ascending: true });

      const { data: redemptionData } = await supabase
        .from("redemptions")
        .select("reward_id")
        .eq("user_id", session.user.id);

      setProfile(profileData);
      setRewards(rewardsData || []);
      setRedemptions(redemptionData || []);
      setLoading(false);
    };

    fetchData();
  }, [session]);

  /* ---------------- DAILY CLAIM ---------------- */
  const handleDailyClaim = async () => {
    if (profile.claimed_today) return;

    const newPoints = profile.points + DAILY_POINTS;
    const newStreak = (profile.daily_streak || 0) + 1;

    await supabase
      .from("profiles")
      .update({
        points: newPoints,
        daily_streak: newStreak,
        claimed_today: true,
        last_claimed_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setProfile({
      ...profile,
      points: newPoints,
      daily_streak: newStreak,
      claimed_today: true,
    });
  };

  /* ---------------- HELPERS ---------------- */
  const isRedeemed = (id) =>
    redemptions.some((r) => r.reward_id === id);

  const filteredRewards = rewards.filter((reward) => {
    const unlocked = profile.points >= reward.points_required;
    const redeemed = isRedeemed(reward.id);

    if (redeemFilter === "unlocked") return unlocked && !redeemed;
    if (redeemFilter === "locked") return !unlocked;
    if (redeemFilter === "coming") return reward.coming_soon;
    return true;
  });

  if (loading || !profile) {
    return <p className="loading">Loading rewards…</p>;
  }

  return (
    <div className="rewards-container">
      {/* HEADER (NO LOGOUT HERE ANYMORE) */}
      <header className="rewards-header">
        <div>
          <h1>Rewards Hub</h1>
          <p>Earn points, unlock rewards, and celebrate your progress!</p>
        </div>
      </header>

      {/* TABS */}
      <div className="rewards-tabs flowva-tabs">
        <button
          className={`tab ${activeTab === "earn" ? "active" : ""}`}
          onClick={() => setActiveTab("earn")}
        >
          Earn Points
        </button>
        <button
          className={`tab ${activeTab === "redeem" ? "active" : ""}`}
          onClick={() => setActiveTab("redeem")}
        >
          Redeem Rewards
        </button>
      </div>

      {/* ====================== EARN ====================== */}
      {activeTab === "earn" && (
        <>
          <h2 className="section-title">Your Rewards Journey</h2>

          <div className="earn-grid">
            {/* POINTS BALANCE */}
            <div className="card">
              <div className="card-title with-icon">
                <Star size={18} />
                <h3>Points Balance</h3>
              </div>

              <div className="points">{profile.points}</div>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${Math.min(
                      (profile.points / 5000) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <small>
                Progress to $5 Gift Card ({profile.points} / 5000)
              </small>
            </div>

            {/* DAILY STREAK */}
            <div className="card">
              <h3>Daily Streak</h3>

              <div className="streak-count">
                {profile.daily_streak || 0} day
              </div>

              <div className="streak-days">
                {DAYS.map((day, i) => (
                  <span
                    key={i}
                    className={`day ${
                      i < (profile.daily_streak || 0) ? "active" : ""
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>

              <button
                className="primary-btn"
                disabled={profile.claimed_today}
                onClick={handleDailyClaim}
              >
                {profile.claimed_today
                  ? "Claimed Today"
                  : "Claim Today's Points"}
              </button>
            </div>

            {/* TOP TOOL SPOTLIGHT */}
            <div className="card spotlight">
              <div className="spotlight-header">
                <span className="badge">Featured</span>

                <div className="spotlight-title-row">
                  <h3>Top Tool Spotlight</h3>
                  <span className="tool-name">Reclaim</span>
                </div>
              </div>

              <div className="spotlight-body">
                <p>
                  Automate and optimize your schedule with an AI-powered
                  calendar assistant.
                </p>

                <div className="spotlight-actions horizontal">
                  <button className="secondary-btn">Sign up</button>
                  <button className="primary-btn small">
                    Claim 50 pts
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* EARN MORE */}
          <h2 className="section-title">Earn More Points</h2>

          <div className="earn-grid">
            <div className="card outline">
              <div className="with-icon">
                <div className="card-icon">
                  <Star size={20} />
                </div>
                <div>
                  <h3>Refer & win 10,000 points!</h3>
                  <p>
                    Invite friends and earn bonus points when they complete
                    onboarding.
                  </p>
                </div>
              </div>
            </div>

            <div className="card outline share-stack">
              <div className="share-stack-top">
                <div className="card-icon">
                  <Share2 size={20} />
                </div>
                <div>
                  <h3>Share Your Stack</h3>
                  <span className="subtext">Earn +25 pts</span>
                </div>
              </div>

              <div className="share-stack-bottom">
                <span>Share your tool stack</span>
                <button className="icon-btn">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* REFER & EARN */}
          <h2 className="section-title">Refer & Earn</h2>

          <div className="card referral">
            <div className="ref-header">
              <div className="ref-icon">
                <Users size={20} />
              </div>
              <div>
                <h3>Share Your Link</h3>
                <p>Invite friends and earn 25 points when they join!</p>
              </div>
            </div>

            <div className="ref-metrics">
              <div className="metric">
                <strong>0</strong>
                <span>Referrals</span>
              </div>
              <div className="metric">
                <strong>0</strong>
                <span>Points Earned</span>
              </div>
            </div>

            <label>Your personal referral link</label>
            <div className="ref-input">
              <input
                readOnly
                value={`https://flowwahub.com/signup/?ref=${profile.id}`}
              />
              <button className="copy-btn">📋</button>
            </div>
          </div>
        </>
      )}

      {/* ====================== REDEEM ====================== */}
      {activeTab === "redeem" && (
        <>
          <h2 className="section-title">Redeem Your Points</h2>

          <div className="redeem-filters">
            <button
              className={`filter ${
                redeemFilter === "all" ? "active" : ""
              }`}
              onClick={() => setRedeemFilter("all")}
            >
              All Rewards <span>{rewards.length}</span>
            </button>
            <button
              className={`filter ${
                redeemFilter === "unlocked" ? "active" : ""
              }`}
              onClick={() => setRedeemFilter("unlocked")}
            >
              Unlocked
            </button>
            <button
              className={`filter ${
                redeemFilter === "locked" ? "active" : ""
              }`}
              onClick={() => setRedeemFilter("locked")}
            >
              Locked
            </button>
            <button
              className={`filter ${
                redeemFilter === "coming" ? "active" : ""
              }`}
              onClick={() => setRedeemFilter("coming")}
            >
              Coming Soon
            </button>
          </div>

          <div className="rewards-grid">
            {filteredRewards.map((reward) => {
              const unlocked =
                profile.points >= reward.points_required;
              const redeemed = isRedeemed(reward.id);

              return (
                <div
                  key={reward.id}
                  className={`reward-card ${
                    unlocked ? "" : "locked"
                  }`}
                >
                  <div className="reward-icon">🎁</div>
                  <h3>{reward.title}</h3>
                  <p>{reward.description}</p>
                  <div className="points-req">
                    ⭐ {reward.points_required} pts
                  </div>
                  <button disabled={!unlocked || redeemed}>
                    {redeemed
                      ? "Redeemed"
                      : unlocked
                      ? "Redeem"
                      : "Locked"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* LOGOUT AT BOTTOM */}
      <div className="logout-footer">
        <button
          className="logout-btn bottom"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Rewards;
