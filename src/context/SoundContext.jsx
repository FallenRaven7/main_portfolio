import React, { createContext, useContext, useState, useEffect } from "react";
import { sound } from "../utils/soundEffects";

const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [volume, setVolumeState] = useState(0.4);

  useEffect(() => {
    // Check session storage (defaults to false per requirements)
    const stored = sessionStorage.getItem("portfolio_sound_enabled");
    if (stored === "true") {
      setSoundEnabled(true);
      sound.setEnabled(true);
    }
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    sessionStorage.setItem("portfolio_sound_enabled", String(next));
    if (next) {
      sound.playSuccess();
    } else {
      sound.stopAmbient();
      setAmbientEnabled(false);
    }
  };

  const toggleAmbient = () => {
    if (!soundEnabled) return;
    const next = !ambientEnabled;
    setAmbientEnabled(next);
    sound.toggleAmbient(next);
  };

  const setVolume = (val) => {
    setVolumeState(val);
    sound.setVolume(val);
  };

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        ambientEnabled,
        toggleAmbient,
        volume,
        setVolume,
        playClick: () => sound.playClick(),
        playHover: () => sound.playHover(),
        playNav: () => sound.playNav(),
        playSuccess: () => sound.playSuccess(),
        playGlitch: () => sound.playGlitch(),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    return {
      soundEnabled: false,
      toggleSound: () => {},
      ambientEnabled: false,
      toggleAmbient: () => {},
      volume: 0.4,
      setVolume: () => {},
      playClick: () => {},
      playHover: () => {},
      playNav: () => {},
      playSuccess: () => {},
      playGlitch: () => {},
    };
  }
  return ctx;
};
