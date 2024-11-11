import React, { useEffect, useState } from "react";

const AnimeVoiceReader = ({ steps }) => {
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const animeVoice = voices.find(voice => voice.lang === "en-US") || voices[0];
      setVoice(animeVoice);
    };

    // Load voices and set voice when available
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const readStep = (text) => {
    if (!voice) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.pitch = 1.8; // Higher pitch for anime-like effect
    utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const readGuide = () => {
    steps.forEach((step, index) => {
      setTimeout(() => {
        readStep(`Step ${index + 1}: ${step.action}`);
      }, index * 3000); // Adjust timing to give a pause between steps
    });
  };

  return (
    <button onClick={readGuide} className="readButton" disabled={!voice}>
      Read Step-by-Step Guide
    </button>
  );
};

export default AnimeVoiceReader;
