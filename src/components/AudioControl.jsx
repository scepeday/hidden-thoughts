import { useEffect, useRef, useState } from "react";

const audioModules = import.meta.glob("../assets/audio/background-music.mp3", {
  eager: true,
  import: "default",
});

const audioSource = audioModules["../assets/audio/background-music.mp3"] ?? null;

export default function AudioControl() {
  const audioRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [hasError, setHasError] = useState(!audioSource);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || hasError) {
      return;
    }

    audio.volume = 0.72;

    async function attemptAutoplay() {
      try {
        await audio.play();
        setHasStarted(true);
        setIsPlaying(true);
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
        setIsPlaying(false);
      }
    }

    attemptAutoplay();
  }, [hasError]);

  async function handlePlayPause() {
    const audio = audioRef.current;

    if (!audio || hasError) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setHasStarted(true);
      setIsPlaying(true);
      setAutoplayBlocked(false);
    } catch {
      setAutoplayBlocked(true);
      setIsPlaying(false);
    }
  }

  function handleMuteToggle() {
    const audio = audioRef.current;

    if (!audio || hasError) {
      return;
    }

    audio.muted = !isMuted;
    setIsMuted((currentValue) => !currentValue);
  }

  function handleAudioError() {
    setHasError(true);
    setIsPlaying(false);
  }

  if (hasError) {
    return null;
  }

  return (
    <div
      className="audio-control"
      aria-label="Background music controls"
      data-autoplay-blocked={autoplayBlocked}
    >
      <audio
        ref={audioRef}
        src={audioSource}
        loop
        preload="auto"
        onPause={() => setIsPlaying(false)}
        onPlay={() => {
          setHasStarted(true);
          setIsPlaying(true);
        }}
        onError={handleAudioError}
      />
      <button
        id="audio-toggle"
        type="button"
        className="audio-button audio-button--primary"
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause background sound" : "Play background sound"}
      >
        {hasStarted ? (isPlaying ? "Pause sound" : "Play sound") : "Play sound"}
      </button>
      {hasStarted && (
        <button
          type="button"
          className="audio-button"
          onClick={handleMuteToggle}
          aria-label={isMuted ? "Unmute background sound" : "Mute background sound"}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      )}
    </div>
  );
}
