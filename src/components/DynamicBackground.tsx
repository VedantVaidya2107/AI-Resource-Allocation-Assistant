'use client';

import React, { useState, useEffect } from 'react';

const quotes = [
  "Efficiency is doing things right; effectiveness is doing the right things.",
  "The best way to predict the future is to create it.",
  "Orchestrate your team like a masterpiece.",
  "Resource management is not just about tools, it's about people.",
  "Focus on progress, not just utilization.",
  "Data-driven decisions are the foundation of success.",
  "Unlock the true potential of your workforce.",
  "Balance workload, ignite productivity.",
  "The right person in the right seat changes everything.",
  "Strategic allocation is the key to project velocity."
];

export default function DynamicBackground() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 1000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dynamic-bg">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="quote-container">
        <p className={`quote-text ${fade ? 'fade-in' : 'fade-out'}`}>
          "{quotes[quoteIndex]}"
        </p>
      </div>

      <div className="noise-overlay"></div>

      <style jsx>{`
        .dynamic-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
          background: var(--background);
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }

        .orb-1 {
          top: -10%;
          right: -10%;
          width: 60vw;
          height: 60vh;
          background: radial-gradient(circle, var(--accent-blue) 0%, transparent 60%);
          opacity: 0.12;
          animation: orbFloat1 25s ease-in-out infinite;
        }

        .orb-2 {
          bottom: -5%;
          left: -10%;
          width: 50vw;
          height: 50vh;
          background: radial-gradient(circle, var(--accent-cyan) 0%, transparent 60%);
          opacity: 0.1;
          animation: orbFloat2 30s ease-in-out infinite;
          animation-delay: 2s;
        }

        .orb-3 {
          top: 20%;
          left: 10%;
          width: 40vw;
          height: 40vh;
          background: radial-gradient(circle, var(--accent-purple) 0%, transparent 60%);
          opacity: 0.08;
          animation: orbFloat3 35s ease-in-out infinite;
          animation-delay: 5s;
        }

        .quote-container {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 100%;
          max-width: 600px;
          padding: 0 24px;
        }

        .quote-text {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--foreground);
          opacity: 0.3;
          font-style: italic;
          transition: opacity 1s ease-in-out, transform 1s ease-in-out;
        }

        .fade-in {
          opacity: 0.3;
          transform: translateY(0);
        }

        .fade-out {
          opacity: 0;
          transform: translateY(-10px);
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          mix-blend-mode: overlay;
          pointer-events: none;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4vw, -5vh) scale(1.1); }
          66% { transform: translate(-3vw, 4vh) scale(0.9); }
        }

        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-5vw, 4vh) scale(1.1); }
          66% { transform: translate(3vw, -4vh) scale(1); }
        }

        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2vw, 3vh) scale(1.1); }
          66% { transform: translate(-4vw, -2vh) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
