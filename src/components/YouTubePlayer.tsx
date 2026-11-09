import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ExternalLink, Maximize2, Minimize2, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  playlistId: string;
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
  onProgress: (seconds: number, duration: number) => void;
  onTrackChange?: (title: string, artist: string) => void;
  volume: number;
  isMuted: boolean;
  videoVisible: boolean;
  onToggleVideoVisible: () => void;
  playerRefCallback: (controls: YouTubeControls | null) => void;
}

export interface YouTubeControls {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (val: number) => void;
  seekTo: (seconds: number) => void;
  loadPlaylist: (id: string) => void;
  playAt: (index: number) => void;
  setShuffle: (enabled: boolean) => void;
  setLoop: (enabled: boolean) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  playlistId,
  isPlaying,
  onPlayStateChange,
  onProgress,
  onTrackChange,
  volume,
  isMuted,
  videoVisible,
  onToggleVideoVisible,
  playerRefCallback,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const callbackRef = useRef({ onPlayStateChange, onProgress, onTrackChange });
  callbackRef.current = { onPlayStateChange, onProgress, onTrackChange };
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [pipExpanded, setPipExpanded] = useState(false);

  // Initialize YouTube Iframe API
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
      }

      try {
        ytPlayerRef.current = new window.YT.Player('yt-player-element', {
          height: '100%',
          width: '100%',
          playerVars: {
            listType: 'playlist',
            list: playlistId,
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsReady(true);
              try {
                event.target.setVolume(volume);
                if (isMuted) event.target.mute();
                const data = event.target.getVideoData();
                if (data && data.title && data.title.trim().length > 0) {
                  setCurrentVideoTitle(data.title);
                  callbackRef.current.onTrackChange?.(data.title, data.author || 'YouTube');
                }
              } catch (e) {
                console.warn('onReady setup error:', e);
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING, 5: CUED
              if (event.data === window.YT.PlayerState.PLAYING) {
                callbackRef.current.onPlayStateChange(true);
                try {
                  const data = event.target.getVideoData();
                  if (data && data.title && data.title.trim().length > 0) {
                    setCurrentVideoTitle(data.title);
                    callbackRef.current.onTrackChange?.(data.title, data.author || 'YouTube');
                  }
                } catch {
                  // ignore
                }
              } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
                callbackRef.current.onPlayStateChange(false);
              }
            },
          },
        });
      } catch (err) {
        console.warn('YT player initialization error:', err);
      }
    };

    if (!window.YT || !window.YT.Player) {
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        if (isMounted) initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      isMounted = false;
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // ignore
        }
      }
      ytPlayerRef.current = null;
      playerRefCallback(null);
      setIsReady(false);
    };
  }, []);

  // Report actual YouTube playback progress, not a simulated elapsed timer.
  useEffect(() => {
    if (!isReady) return;
    const report = () => {
      const player = ytPlayerRef.current;
      if (!player || typeof player.getCurrentTime !== 'function') return;
      try {
        const elapsed = player.getCurrentTime();
        const total = player.getDuration();
        if (Number.isFinite(elapsed) && Number.isFinite(total)) {
          callbackRef.current.onProgress(Math.max(0, elapsed), Math.max(0, total));
        }
      } catch { /* Player may be changing tracks. */ }
    };
    report();
    const timer = window.setInterval(report, 500);
    return () => window.clearInterval(timer);
  }, [isReady]);

  // Handle playlist change
  useEffect(() => {
    if (isReady && ytPlayerRef.current && typeof ytPlayerRef.current.cuePlaylist === 'function') {
      try {
        ytPlayerRef.current.cuePlaylist({
          list: playlistId,
          listType: 'playlist',
          index: 0,
        });
      } catch (e) {
        console.warn('loadPlaylist error:', e);
      }
    }
  }, [playlistId, isReady]);

  // Handle volume & mute
  useEffect(() => {
    if (isReady && ytPlayerRef.current) {
      try {
        if (isMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume);
        }
      } catch {
        // ignore
      }
    }
  }, [volume, isMuted, isReady]);

  // Expose player controls to parent
  const controls: YouTubeControls = {
    play: () => {
      try {
        ytPlayerRef.current?.playVideo();
      } catch (e) {
        console.warn(e);
      }
    },
    pause: () => {
      try {
        ytPlayerRef.current?.pauseVideo();
      } catch (e) {
        console.warn(e);
      }
    },
    togglePlay: () => {
      try {
        if (isPlayingRef.current) {
          ytPlayerRef.current?.pauseVideo();
        } else {
          ytPlayerRef.current?.playVideo();
        }
      } catch (e) {
        console.warn(e);
      }
    },
    next: () => {
      try {
        ytPlayerRef.current?.nextVideo();
      } catch (e) {
        console.warn(e);
      }
    },
    prev: () => {
      try {
        ytPlayerRef.current?.previousVideo();
      } catch (e) {
        console.warn(e);
      }
    },
    setVolume: (val: number) => {
      try {
        ytPlayerRef.current?.setVolume(val);
      } catch (e) {
        console.warn(e);
      }
    },
    seekTo: (seconds: number) => {
      try {
        ytPlayerRef.current?.seekTo(seconds, true);
      } catch (e) {
        console.warn(e);
      }
    },
    loadPlaylist: (id: string) => {
      try {
        ytPlayerRef.current?.cuePlaylist({
          list: id,
          listType: 'playlist',
          index: 0,
        });
      } catch (e) {
        console.warn(e);
      }
    },
    playAt: (index: number) => {
      try {
        if (Number.isInteger(index) && index >= 0) ytPlayerRef.current?.playVideoAt(index);
      } catch (e) { console.warn(e); }
    },
    setShuffle: (enabled: boolean) => {
      try { ytPlayerRef.current?.setShuffle(enabled); } catch (e) { console.warn(e); }
    },
    setLoop: (enabled: boolean) => {
      try { ytPlayerRef.current?.setLoop(enabled); } catch (e) { console.warn(e); }
    },
  };

  useEffect(() => {
    playerRefCallback(isReady ? controls : null);
  }, [isReady, isPlaying]);

  return (
    <>
      {/* Video Container (PiP or Hidden) */}
      <div
        className={`fixed z-30 transition-all duration-300 ${
          videoVisible
            ? pipExpanded
              ? 'inset-4 md:inset-12 bg-black/95 rounded-2xl shadow-2xl border border-white/20 p-2 flex flex-col'
              : 'bottom-24 right-4 md:bottom-28 md:right-8 w-72 sm:w-80 h-44 sm:h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black'
            : 'pointer-events-none opacity-0 w-1 h-1 -left-[9999px] top-0'
        }`}
      >
        {videoVisible && (
          <div className="flex items-center justify-between bg-neutral-900/90 px-3 py-1.5 border-b border-white/10 text-xs text-white">
            <span className="truncate font-medium max-w-[180px]">
              {currentVideoTitle || 'YouTube Stream'}
            </span>
            <div className="flex items-center gap-1">
              <a
                href={`https://www.youtube.com/playlist?list=${playlistId}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-amber-400"
                title="Open playlist in YouTube"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setPipExpanded((v) => !v)}
                className="p-1 hover:text-white"
                title={pipExpanded ? 'Shrink to PiP' : 'Expand theater view'}
              >
                {pipExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={onToggleVideoVisible}
                className="p-1 hover:text-white"
                title="Hide video (Audio only mode)"
              >
                <EyeOff className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* The YouTube iframe element placeholder */}
        <div className="w-full h-full min-h-[140px] flex-1">
          <div id="yt-player-element" className="w-full h-full" />
        </div>
      </div>
    </>
  );
};
