import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './WebAppPreview.module.css';

interface WebAppPreviewProps {
  posterSrc: string;
  videoSrc?: string | undefined;
  title: string;
}

export function WebAppPreview({ posterSrc, videoSrc, title }: WebAppPreviewProps) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoSrc || reduced) return;
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              /* autoplay rejected — ignore */
            });
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [videoSrc, reduced]);

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {videoSrc ? (
        <>
          <video
            ref={videoRef}
            className={styles.media}
            src={videoSrc}
            poster={posterSrc}
            muted
            loop
            playsInline
            preload="none"
            aria-label={`Preview of ${title}`}
            onClick={reduced ? handleManualPlay : undefined}
            controls={reduced}
          />
          {reduced && !isPlaying && (
            <div className={styles.overlay} data-show="true">
              <span className={styles.playHint}>&gt; click to play</span>
            </div>
          )}
        </>
      ) : (
        <img
          className={styles.media}
          src={posterSrc}
          alt={`Preview of ${title}`}
          loading="lazy"
        />
      )}
    </div>
  );
}
