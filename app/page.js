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
    "I am just getting started": 1,
    "I know a little, but I need more clarity": 2,
    "I have been exploring and comparing options": 3,
    "I am ready to take the next serious step": 4,
  };

  const timelineMap = {
    "I am only exploring for now": 1,
    "Maybe in the next 3 to 6 months": 2,
    "Likely in the next 1 to 2 months": 3,
    "I want to move ahead soon": 4,
  };

  const learningMap = {
    "I want to understand the basics first": 1,
    "I want a clear and structured path": 2,
    "I want a certification or career-focused path": 3,
    "I want to speak to someone and decide properly": 4,
  };

  const nextStepMap = {
    "Share something simple to help me begin": 1,
    "Help me choose the right path": 2,
    "Invite me to a session or workshop": 3,
    "I would like to talk to someone soon": 4,
  };

  const stageScore = stageMap[form.stage] || 0;
  const timelineScore = timelineMap[form.timeline] || 0;
  const learningScore = learningMap[form.learningMode] || 0;
  const nextStepScore = nextStepMap[form.nextStep] || 0;

  const total = stageScore + timelineScore + learningScore + nextStepScore;

  let intentLevel = "Just getting started";
  let priorityAction =
    "Start with a simple, beginner-friendly introduction to financial planning";

  if (total >= 13) {
    intentLevel = "Ready for the next step";
    priorityAction =
      "Have a conversation to choose the right path and take the next step with confidence";
  } else if (total >= 9) {
    intentLevel = "Gaining clarity";
    priorityAction =
      "Explore a structured pathway that helps you move forward with more clarity and direction";
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

  if (programInterest && programInterest !== "I am not sure yet") {
    return programInterest;
  }

  if (
    intent === "I want help choosing the right certification" ||
    learningMode === "I want a certification or career-focused path"
  ) {
    return "CFP Fast Track";
  }

  if (
    intent === "I want to understand financial planning better" ||
    learningMode === "I want a clear and structured path" ||
    nextStep === "Invite me to a session or workshop"
  ) {
    return "21-Day Comprehensive Financial Planning";
  }

  if (
    intent === "I want to build a career in finance" &&
    (role === "Student" || role === "Working professional")
  ) {
    return "CFP Fast Track";
  }

  if (
    role === "Existing advisor / wealth manager" ||
    intent === "I want to deepen my professional knowledge"
  ) {
    return "Wealth Coach Journey";
  }

  if (
    intent === "I need guidance, but I do not know where to begin" &&
    score.intentLevel === "Just getting started"
  ) {
    return "21-Day Comprehensive Financial Planning";
  }

  if (
    role === "Aspiring advisor / planner" &&
    learningMode === "I want a certification or career-focused path"
  ) {
    return "NISM Certification Program";
  }

  if (
    score.intentLevel === "Ready for the next step" &&
    nextStep === "I would like to talk to someone soon"
  ) {
    return "Wealth Coach Journey";
  }

  return "21-Day Comprehensive Financial Planning";
}

function getInterpretationCards(form, result) {
  const stageTextMap = {
    "I am just getting started":
      "You seem to be at the beginning of your journey, so a simple and reassuring starting point may help most.",
    "I know a little, but I need more clarity":
      "You already have some exposure, but a clearer path could help you move forward with more confidence.",
    "I have been exploring and comparing options":
      "You are actively considering your options, which means this may be a good time to narrow your direction.",
    "I am ready to take the next serious step":
      "You seem close to making a decision and may benefit from more direct guidance now.",
  };

  const timelineTextMap = {
    "I am only exploring for now":
      "You are not in a hurry right now, which gives you space to explore with clarity.",
    "Maybe in the next 3 to 6 months":
      "You are thinking ahead, which is a good stage to choose a path carefully.",
    "Likely in the next 1 to 2 months":
      "You may be approaching decision time, so this is a useful moment to get direction.",
    "I want to move ahead soon":
      "You seem ready to move quickly, so timely guidance could be especially valuable.",
  };

  const learningTextMap = {
    "I want to understand the basics first":
      "A beginner-friendly and confidence-building approach may be the most useful starting point for you.",
    "I want a clear and structured path":
      "You seem to value clarity and progression, so a guided path may suit you well.",
    "I want a certification or career-focused path":
      "You appear to be looking for a more goal-oriented journey with a stronger professional outcome.",
    "I want to speak to someone and decide properly":
      "A direct conversation may help you make a more confident decision than exploring alone.",
  };

  const nextStepTextMap = {
    "Share something simple to help me begin":
      "You are looking for a light and comfortable next step before committing further.",
    "Help me choose the right path":
      "You want support in narrowing the options and choosing what fits you best.",
    "Invite me to a session or workshop":
      "You seem open to guided learning before making a bigger decision.",
    "I would like to talk to someone soon":
      "You may be ready for a direct conversation rather than more self-exploration.",
  };

  return [
    {
      title: "Where you are right now",
      text: stageTextMap[form.stage] || "Your current stage is becoming clearer.",
    },
    {
      title: "Your timeline",
      text: timelineTextMap[form.timeline] || "Your timeline helps shape the right next step.",
    },
    {
      title: "What may help most",
      text:
        learningTextMap[form.learningMode] ||
        "Your support preference helps guide the right path.",
    },
    {
      title: "What you seem ready for",
      text: nextStepTextMap[form.nextStep] || result.priorityAction,
    },
  ];
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
    const interpretationCards = getInterpretationCards(form, score);

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        ...score,
        recommendedProgram,
        formType: "sunyta_demo",
        demoType: "Financial Education Journey",
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
        interpretationCards,
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
                position: "relative",
                width: "150px",
                height: "48px",
                marginBottom: "16px",
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

            <div className="hero-badge">A simple guided experience</div>

            <h1
              style={{
                fontSize: "clamp(34px, 6vw, 58px)",
                lineHeight: 1.05,
                fontWeight: 800,
                marginTop: "18px",
                marginBottom: "18px",
                maxWidth: "760px",
              }}
            >
              Find the learning path that feels right for where you are today.
            </h1>

            <p
              style={{
                color: "var(--muted)",
                fontSize: "17px",
                lineHeight: 1.7,
                maxWidth: "700px",
              }}
            >
              Whether you are just beginning, exploring certifications, or looking for
              the right next step in your financial learning journey, this short guided
              experience is designed to help you move ahead with more clarity.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px",
                marginTop: "28px",
              }}
            >
              {[
                {
                  title: "Understand where you are",
                  text: "Get a clearer sense of your current stage before making a decision.",
                },
                {
                  title: "See what fits best",
                  text: "Discover which path may be most relevant to your goals right now.",
                },
                {
                  title: "Move ahead with confidence",
                  text: "Know what kind of next step may help you move forward more comfortably.",
                },
                {
                  title: "Avoid unnecessary confusion",
                  text: "Bring more direction to your choices before committing time and effort.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="glass metric-card"
                  style={{ borderRadius: "22px" }}
                >
                  <div style={{ fontSize: "17px", fontWeight: 700 }}>
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--muted)",
                      marginTop: "8px",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.text}
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
                    Take a moment to reflect on where you are
                  </h2>
                  <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.6 }}>
                    Your answers will help surface a path that may feel more relevant to your
                    current stage, goals, and level of readiness.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label className="label">Your name</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Type your name"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Your WhatsApp number</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Type your WhatsApp number"
                      value={form.whatsapp}
                      onChange={(e) => updateField("whatsapp", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      Which of these feels closest to where you are today?
                    </label>
                    <select
                      className="select"
                      value={form.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      required
                    >
                      <option value="">Choose the option that feels closest to you</option>
                      <option>Student</option>
                      <option>Working professional</option>
                      <option>Aspiring advisor / planner</option>
                      <option>Existing advisor / wealth manager</option>
                      <option>Business owner</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">What would you like help with right now?</label>
                    <select
                      className="select"
                      value={form.intent}
                      onChange={(e) => updateField("intent", e.target.value)}
                      required
                    >
                      <option value="">Choose what you would like help with</option>
                      <option>I want to understand financial planning better</option>
                      <option>I want to build a career in finance</option>
                      <option>I want to deepen my professional knowledge</option>
                      <option>I want help choosing the right certification</option>
                      <option>I need guidance, but I do not know where to begin</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      How would you describe where you are right now?
                    </label>
                    <select
                      className="select"
                      value={form.stage}
                      onChange={(e) => updateField("stage", e.target.value)}
                      required
                    >
                      <option value="">Choose the stage that feels most like you</option>
                      <option>I am just getting started</option>
                      <option>I know a little, but I need more clarity</option>
                      <option>I have been exploring and comparing options</option>
                      <option>I am ready to take the next serious step</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      When do you feel you may want to take the next step?
                    </label>
                    <select
                      className="select"
                      value={form.timeline}
                      onChange={(e) => updateField("timeline", e.target.value)}
                      required
                    >
                      <option value="">Choose the timeline that feels right</option>
                      <option>I am only exploring for now</option>
                      <option>Maybe in the next 3 to 6 months</option>
                      <option>Likely in the next 1 to 2 months</option>
                      <option>I want to move ahead soon</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      What kind of support would feel most helpful right now?
                    </label>
                    <select
                      className="select"
                      value={form.learningMode}
                      onChange={(e) => updateField("learningMode", e.target.value)}
                      required
                    >
                      <option value="">
                        Choose the kind of support you would value most
                      </option>
                      <option>I want to understand the basics first</option>
                      <option>I want a clear and structured path</option>
                      <option>I want a certification or career-focused path</option>
                      <option>I want to speak to someone and decide properly</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      Which path feels most relevant to what you are looking for?
                    </label>
                    <select
                      className="select"
                      value={form.programInterest}
                      onChange={(e) => updateField("programInterest", e.target.value)}
                      required
                    >
                      <option value="">Choose the path that feels most relevant</option>
                      <option>CFP Fast Track</option>
                      <option>21-Day Comprehensive Financial Planning</option>
                      <option>NISM Certification Program</option>
                      <option>Wealth Coach Journey</option>
                      <option>I am not sure yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      What would feel like the right next step for you?
                    </label>
                    <select
                      className="select"
                      value={form.nextStep}
                      onChange={(e) => updateField("nextStep", e.target.value)}
                      required
                    >
                      <option value="">Choose what would feel best from here</option>
                      <option>Share something simple to help me begin</option>
                      <option>Help me choose the right path</option>
                      <option>Invite me to a session or workshop</option>
                      <option>I would like to talk to someone soon</option>
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
                <div className="hero-badge">A reflection of where you are today</div>

                <h2 style={{ fontSize: "28px", fontWeight: 800, marginTop: "18px" }}>
                  Here is a clearer view of what may help you next
                </h2>

                <p style={{ color: "var(--muted)", lineHeight: 1.7, marginTop: "10px" }}>
                  Based on what you shared, this is the stage you may be in right now and the
                  kind of next step that could support you with more confidence and clarity.
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
                    Where you seem to be right now
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "6px" }}>
                    {result.intentLevel}
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
                  <div style={{ color: "var(--muted)", fontSize: "14px" }}>
                    A path that may suit you best
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "6px" }}>
                    {result.recommendedProgram}
                  </div>
                </div>

                <div style={{ marginTop: "10px", color: "var(--muted)", fontSize: "14px" }}>
                  What could support you best from here:{" "}
                  <strong>{result.priorityAction}</strong>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "14px",
                    marginTop: "24px",
                  }}
                >
                  {result.interpretationCards.map((card) => (
                    <div
                      key={card.title}
                      className="glass metric-card"
                      style={{ borderRadius: "20px" }}
                    >
                      <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                        {card.title}
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          marginTop: "8px",
                          lineHeight: 1.6,
                        }}
                      >
                        {card.text}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="button-primary"
                  style={{ marginTop: "20px", width: "100%" }}
                  onClick={() => setResult(null)}
                >
                  Start Over
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