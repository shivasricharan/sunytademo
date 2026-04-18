"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const initialForm = {
  fullName: "",
  whatsapp: "",
  role: "",
  intent: "",
  stage: "",
  timeline: "",
  learningMode: "",
  programInterest: "",
  nextStep: "",
};

function getScore(form) {
  const stageMap = {
    "Just starting": 1,
    "Some knowledge, not confident": 2,
    "Already learning and comparing options": 3,
    "Ready to act / enroll soon": 4,
  };

  const timelineMap = {
    "Just exploring": 1,
    "Within 3-6 months": 2,
    "Within 1-2 months": 3,
    "Immediately": 4,
  };

  const learningMap = {
    "Need basic understanding first": 1,
    "Want structured guidance": 2,
    "Want certification and career path": 3,
    "Want direct counselling / decision support": 4,
  };

  const nextStepMap = {
    "Send me beginner guidance": 1,
    "Recommend the right program": 2,
    "Invite me to a session / webinar": 3,
    "Talk to me now": 4,
  };

  const stageScore = stageMap[form.stage] || 0;
  const timelineScore = timelineMap[form.timeline] || 0;
  const learningScore = learningMap[form.learningMode] || 0;
  const nextStepScore = nextStepMap[form.nextStep] || 0;

  const total = stageScore + timelineScore + learningScore + nextStepScore;

  let intentLevel = "Low";
  let priorityAction = "Share basic educational content";

  if (total >= 13) {
    intentLevel = "High";
    priorityAction = "Route to counselling / enrollment conversation";
  } else if (total >= 9) {
    intentLevel = "Medium";
    priorityAction = "Recommend specific program with guided follow-up";
  }

  return {
    stageScore,
    timelineScore,
    learningScore,
    nextStepScore,
    total,
    intentLevel,
    priorityAction,
  };
}

function getRecommendedProgram(form, score) {
  const { role, intent, learningMode, programInterest, nextStep } = form;

  if (programInterest && programInterest !== "Not sure yet") {
    return programInterest;
  }

  if (
    intent === "Choose the right certification" ||
    learningMode === "Want certification and career path"
  ) {
    return "CFP Fast Track";
  }

  if (
    intent === "Explore financial planning" ||
    learningMode === "Want structured guidance" ||
    nextStep === "Invite me to a session / webinar"
  ) {
    return "21-Day Comprehensive Financial Planning";
  }

  if (
    intent === "Build a career in finance" &&
    (role === "Student" || role === "Working professional")
  ) {
    return "CFP Fast Track";
  }

  if (
    role === "Existing advisor / wealth manager" ||
    intent === "Upgrade professional knowledge"
  ) {
    return "Wealth Coach Journey";
  }

  if (
    intent === "Need guidance but not sure where to start" &&
    score.intentLevel === "Low"
  ) {
    return "21-Day Comprehensive Financial Planning";
  }

  if (
    role === "Aspiring advisor / planner" &&
    learningMode === "Want certification and career path"
  ) {
    return "NISM Certification Program";
  }

  if (score.intentLevel === "High" && nextStep === "Talk to me now") {
    return "Wealth Coach Journey";
  }

  return "21-Day Comprehensive Financial Planning";
}

export default function HomePage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const score = getScore(form);
    const recommendedProgram = getRecommendedProgram(form, score);

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        ...score,
        recommendedProgram,
        formType: "sunyta_demo",
        demoType: "Financial Education Intent",
        submittedAt: new Date().toISOString(),
        source: "sunyta.netlify.app",
      };

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Submission failed");
      }

      setResult({
        ...score,
        recommendedProgram,
      });
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <Header />

      <section className="container">
        <div className="grid-2">
          <div
            className="glass"
            style={{
              borderRadius: "32px",
              padding: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "8px",
              }}
            >
              <div className="hero-badge">Structured learner intent • Premium demo</div>
            </div>

            <div
              style={{
                position: "relative",
                width: "140px",
                height: "44px",
                marginTop: "6px",
                marginBottom: "10px",
              }}
            >
              <img
                src="/sunyta.png"
                alt="Sunyta"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            <h1
              style={{
                fontSize: "clamp(34px, 6vw, 58px)",
                lineHeight: 1.05,
                fontWeight: 800,
                marginTop: "18px",
                marginBottom: "18px",
              }}
            >
              See how <span className="gradient-text">Vouch</span> can help Sunyta
              understand where a learner stands before the conversation begins.
            </h1>

            <p
              style={{
                color: "var(--muted)",
                fontSize: "17px",
                lineHeight: 1.7,
                maxWidth: "680px",
              }}
            >
              This demo shows how incoming learner interest can be turned into
              structured intent signals across financial planning education journeys
              — from early exploration to certification readiness to counselling
              support.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px",
                marginTop: "26px",
              }}
            >
              {[
                "CFP Fast Track",
                "21-Day Financial Planning",
                "NISM Programs",
                "Wealth Coach Pathway",
              ].map((item) => (
                <div
                  key={item}
                  className="glass metric-card"
                  style={{ borderRadius: "22px" }}
                >
                  <div style={{ fontSize: "14px", color: "var(--muted)" }}>
                    Program fit
                  </div>
                  <div style={{ fontSize: "17px", fontWeight: 700, marginTop: "6px" }}>
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="glass"
            style={{
              borderRadius: "32px",
              padding: "24px",
            }}
          >
            {!result ? (
              <>
                <div style={{ marginBottom: "18px" }}>
                  <h2 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "8px" }}>
                    Know where you stand
                  </h2>
                  <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.6 }}>
                    A simple flow that turns vague interest into structured signals.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label className="label">Full name</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Enter your name"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">WhatsApp number</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Enter WhatsApp number"
                      value={form.whatsapp}
                      onChange={(e) => updateField("whatsapp", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Who are you?</label>
                    <select
                      className="select"
                      value={form.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option>Student</option>
                      <option>Working professional</option>
                      <option>Aspiring advisor / planner</option>
                      <option>Existing advisor / wealth manager</option>
                      <option>Business owner</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Why are you here today?</label>
                    <select
                      className="select"
                      value={form.intent}
                      onChange={(e) => updateField("intent", e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option>Explore financial planning</option>
                      <option>Build a career in finance</option>
                      <option>Upgrade professional knowledge</option>
                      <option>Choose the right certification</option>
                      <option>Need guidance but not sure where to start</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Where do you see yourself right now?</label>
                    <select
                      className="select"
                      value={form.stage}
                      onChange={(e) => updateField("stage", e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option>Just starting</option>
                      <option>Some knowledge, not confident</option>
                      <option>Already learning and comparing options</option>
                      <option>Ready to act / enroll soon</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">When do you want to take action?</label>
                    <select
                      className="select"
                      value={form.timeline}
                      onChange={(e) => updateField("timeline", e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option>Just exploring</option>
                      <option>Within 3-6 months</option>
                      <option>Within 1-2 months</option>
                      <option>Immediately</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">What kind of help do you want most?</label>
                    <select
                      className="select"
                      value={form.learningMode}
                      onChange={(e) => updateField("learningMode", e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option>Need basic understanding first</option>
                      <option>Want structured guidance</option>
                      <option>Want certification and career path</option>
                      <option>Want direct counselling / decision support</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Which Sunyta pathway feels closest?</label>
                    <select
                      className="select"
                      value={form.programInterest}
                      onChange={(e) => updateField("programInterest", e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option>CFP Fast Track</option>
                      <option>21-Day Comprehensive Financial Planning</option>
                      <option>NISM Certification Program</option>
                      <option>Wealth Coach Journey</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">What should happen next?</label>
                    <select
                      className="select"
                      value={form.nextStep}
                      onChange={(e) => updateField("nextStep", e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option>Send me beginner guidance</option>
                      <option>Recommend the right program</option>
                      <option>Invite me to a session / webinar</option>
                      <option>Talk to me now</option>
                    </select>
                  </div>

                  {error ? (
                    <div style={{ color: "#fca5a5", fontSize: "14px" }}>{error}</div>
                  ) : null}

                  <button type="submit" className="button-primary" disabled={submitting}>
                    {submitting ? "Submitting..." : "See My Path"}
                  </button>
                </form>
              </>
            ) : (
              <div>
                <div className="hero-badge">Result</div>

                <h2 style={{ fontSize: "28px", fontWeight: 800, marginTop: "18px" }}>
                  Learner classified as{" "}
                  <span className="gradient-text">{result.intentLevel}</span> intent
                </h2>

                <p style={{ color: "var(--muted)", lineHeight: 1.7, marginTop: "10px" }}>
                  This is how Vouch turns an incoming learner into a structured,
                  usable signal for follow-up, counselling, and program recommendation.
                </p>

                <div
                  className="glass"
                  style={{
                    borderRadius: "24px",
                    padding: "20px",
                    marginTop: "18px",
                  }}
                >
                  <div style={{ color: "var(--muted)", fontSize: "14px" }}>
                    Best-fit Sunyta pathway
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "6px" }}>
                    {result.recommendedProgram}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "14px",
                    marginTop: "24px",
                  }}
                >
                  <div className="glass metric-card" style={{ borderRadius: "20px" }}>
                    <div style={{ color: "var(--muted)", fontSize: "13px" }}>Stage score</div>
                    <div style={{ fontSize: "28px", fontWeight: 800 }}>{result.stageScore}</div>
                  </div>

                  <div className="glass metric-card" style={{ borderRadius: "20px" }}>
                    <div style={{ color: "var(--muted)", fontSize: "13px" }}>Timeline score</div>
                    <div style={{ fontSize: "28px", fontWeight: 800 }}>{result.timelineScore}</div>
                  </div>

                  <div className="glass metric-card" style={{ borderRadius: "20px" }}>
                    <div style={{ color: "var(--muted)", fontSize: "13px" }}>Learning score</div>
                    <div style={{ fontSize: "28px", fontWeight: 800 }}>{result.learningScore}</div>
                  </div>

                  <div className="glass metric-card" style={{ borderRadius: "20px" }}>
                    <div style={{ color: "var(--muted)", fontSize: "13px" }}>Next-step score</div>
                    <div style={{ fontSize: "28px", fontWeight: 800 }}>{result.nextStepScore}</div>
                  </div>
                </div>

                <div
                  className="glass"
                  style={{
                    borderRadius: "24px",
                    padding: "20px",
                    marginTop: "18px",
                  }}
                >
                  <div style={{ color: "var(--muted)", fontSize: "14px" }}>Intent score</div>
                  <div style={{ fontSize: "36px", fontWeight: 900, marginTop: "6px" }}>
                    {result.total}/16
                  </div>

                  <div style={{ color: "var(--muted)", fontSize: "14px", marginTop: "16px" }}>
                    Recommended action
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "6px" }}>
                    {result.priorityAction}
                  </div>
                </div>

                <button
                  className="button-primary"
                  style={{ marginTop: "20px", width: "100%" }}
                  onClick={() => setResult(null)}
                >
                  Try another submission
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}