/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PLAYLISTS } from './data/playlists.ts';
import { PlaylistData, ClockConfig, TrackInfo } from './types/index.ts';
import { LiveClock } from './components/LiveClock.tsx';
import { ClockSettingsModal } from './components/ClockSettingsModal.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { MusicPlayer } from './components/MusicPlayer.tsx';
import { YouTubePlayer, YouTubeControls } from './components/YouTubePlayer.tsx';
import { StationHero } from './components/StationHero.tsx';
import { RainCanvas } from './components/RainCanvas.tsx';
import { ChaiCelebration } from './components/ChaiCelebration.tsx';
import { TracklistDrawer } from './components/TracklistDrawer.tsx';
import {
  playHornSound,
  playChaiSound,
  playScissorsSound,
  playSpraySound,
  setAmbientRain,
} from './utils/audioEffects.ts';
import { Radio, Sparkles, ExternalLink } from 'lucide-react';

export default function App() {
  const [playlists, setPlaylists] = useState<PlaylistData[]>(PLAYLISTS);
  const [activePlaylist, setActivePlaylist] = useState<PlaylistData>(PLAYLISTS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tracklistOpen, setTracklistOpen] = useState(false);
  const [clockModalOpen, setClockModalOpen] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | undefined>(
    PLAYLISTS[0].featuredTracks[0]
  );

  // Ambient effects state
  const [rainActive, setRainActive] = useState(PLAYLISTS[0].defaultRain);
  const [chaiCount, setChaiCount] = useState(0);
  const [showChaiToast, setShowChaiToast] = useState(false);
  const [chaiMessage, setChaiMessage] = useState('ড্রাইভার সাহেব চা পেয়ে খুব খুশি!');

  // Live Listeners counter
  const [listenersCount, setListenersCount] = useState(PLAYLISTS[0].initialListeners);

  // Clock configuration state
  const [clockConfig, setClockConfig] = useState<ClockConfig>({
    font: 'sans',
    format: '24h',
    showSeconds: true,
    secondsStyle: 'superscript',
    showDate: true,
    dateFormat: 'short',
    blinkingColon: true,
    showListeners: true,
    position: 'top-right',
    size: 'md',
    glow: true,
  });

  const ytControlsRef = useRef<YouTubeControls | null>(null);

  // Handle switching playlists
  const handleSelectPlaylist = (playlist: PlaylistData) => {
    setActivePlaylist(playlist);
    setRainActive(playlist.defaultRain);
    setAmbientRain(playlist.defaultRain);
    setListenersCount(playlist.initialListeners);
    setCurrentTrack(playlist.featuredTracks[0]);
    setCurrentTime(0);

    // Adjust default clock flavor to match the screenshot vibe
    if (playlist.id === 'truck-driver') {
      setClockConfig((prev) => ({
        ...prev,
        position: 'top-left',
        format: '12h',
        font: 'mono',
        showSeconds: false,
        showListeners: true,
      }));
    } else if (playlist.id === 'bus-driver') {
      setClockConfig((prev) => ({
        ...prev,
        position: 'top-right',
        format: '24h',
        font: 'sans',
        secondsStyle: 'superscript',
        showSeconds: true,
      }));
    }

    if (ytControlsRef.current) {
      ytControlsRef.current.loadPlaylist(playlist.youtubePlaylistId);
    }
  };

  // Ambient rain toggling
  const handleToggleRain = () => {
    const next = !rainActive;
    setRainActive(next);
    setAmbientRain(next);
  };

  // Horn sound effect
  const handleHorn = () => {
    playHornSound(activePlaylist.id === 'truck-driver' ? 'truck' : 'bus');
  };

  // Chai Toast click
  const handleChaiClick = () => {
    playChaiSound();
    setChaiCount((prev) => prev + 1);
    const msgs: Record<string, string> = {
      'bus-driver': 'ড্রাইভার সাহেব চা খেয়ে তরতাজা! (Hot tea for driver)',
      salon: 'सैलून में कड़क चाय की चुस्की! (Classic chai at the barber)',
      'truck-driver': 'हाईवे ढाबे की स्पेशल मसाला चाय! (Grand Trunk road chai)',
    };
    setChaiMessage(msgs[activePlaylist.id] || 'Fresh hot chai cup served!');
    setShowChaiToast(true);
    setTimeout(() => setShowChaiToast(false), 3500);
  };

  // Scissors & Spray
  const handleScissors = () => playScissorsSound();
  const handleSpray = () => playSpraySound();

  // Custom playlist submission
  const handleCustomPlaylist = (id: string, name: string) => {
    const newPl: PlaylistData = {
      id: `custom-${Date.now()}`,
      name: name,
      nativeTitle: 'कस्टम प्लेलिस्ट',
      nativeFontClass: 'font-hindi',
      subtitle: 'User Playlist Stream',
      route: 'Custom YouTube Channel',
      songsCount: 'Custom Playlist',
      motto: 'Enjoy your custom YouTube stream on Safar Radio',
      secondaryMotto: 'Personal Highway Mix',
      teaButtonText: 'Have a Cup of Tea',
      youtubePlaylistId: id,
      bgImage: activePlaylist.bgImage,
      accentColor: '#38bdf8',
      accentBorder: 'border-sky-500/30',
      themeStyle: 'amber',
      defaultRain: false,
      initialListeners: 120,
      shortcutsLabel: 'Space Play/Pause • N P Next/Prev',
      featuredTracks: [
        { id: 'custom-1', title: 'Custom Stream Track', artist: 'YouTube Playlist', duration: '4:00' },
      ],
    };
    setPlaylists((prev) => [...prev, newPl]);
    handleSelectPlaylist(newPl);
  };

  // Progress timer simulation while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= duration) return 0;
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Listener count subtle fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setListenersCount((cnt) => cnt + (Math.floor(Math.random() * 5) - 2));
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (ytControlsRef.current) {
          ytControlsRef.current.togglePlay();
        } else {
          setIsPlaying((p) => !p);
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const nextTime = Math.min(currentTime + 10, duration);
        setCurrentTime(nextTime);
        ytControlsRef.current?.seekTo(nextTime);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const prevTime = Math.max(currentTime - 10, 0);
        setCurrentTime(prevTime);
        ytControlsRef.current?.seekTo(prevTime);
      } else if (e.key === 'n' || e.key === 'N') {
        ytControlsRef.current?.next();
      } else if (e.key === 'p' || e.key === 'P') {
        ytControlsRef.current?.prev();
      } else if (e.key === 'h' || e.key === 'H') {
        handleHorn();
      } else if (e.key === 'r' || e.key === 'R') {
        handleToggleRain();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((v) => !v);
      } else if (e.key === '[') {
        setSidebarOpen((v) => !v);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, duration, isPlaying, rainActive]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 font-sans-clean select-none">
      {/* Full-bleed Immersive Theme Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={activePlaylist.bgImage}
          alt={activePlaylist.name}
          className="h-full w-full object-cover transition-all duration-700 filter brightness-85"
        />
        {/* Subtle cinematic gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/70 pointer-events-none" />
      </div>

      {/* Rain canvas overlay */}
      <RainCanvas active={rainActive} intensity={0.7} />

      {/* Top Header Bar */}
      <header className="relative z-20 flex w-full items-center justify-between px-4 sm:px-8 pt-4">
        {/* Left top: Playlist trigger & station brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open playlist sidebar"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-neutral-900/80 px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-neutral-800"
          >
            <Radio className="h-4 w-4 text-amber-400" />
            <span>Playlists</span>
          </button>

          {clockConfig.position !== 'top-left' && (
            <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-3">
              <span className="text-xl">
                {activePlaylist.id === 'bus-driver' ? '🚌' : activePlaylist.id === 'salon' ? '💈' : '🚛'}
              </span>
              <div className="flex flex-col">
                <span className={`text-sm font-bold text-white tracking-wide ${activePlaylist.nativeFontClass}`}>
                  {activePlaylist.nativeTitle}
                </span>
                <span className="text-[10px] text-white/60">
                  {activePlaylist.subtitle}
                </span>
              </div>
            </div>
          )}

          {clockConfig.position === 'top-left' && (
            <div className="ml-2">
              <LiveClock
                config={clockConfig}
                onOpenSettings={() => setClockModalOpen(true)}
                playlist={activePlaylist}
                listenersCount={listenersCount}
              />
            </div>
          )}
        </div>

        {/* Center Clock if positioned top-center */}
        {clockConfig.position === 'top-center' && (
          <div className="hidden sm:block">
            <LiveClock
              config={clockConfig}
              onOpenSettings={() => setClockModalOpen(true)}
              playlist={activePlaylist}
              listenersCount={listenersCount}
            />
          </div>
        )}

        {/* Right Top Area: Clock (default) or external buttons */}
        <div className="flex items-center gap-3">
          {clockConfig.position === 'top-right' ? (
            <LiveClock
              config={clockConfig}
              onOpenSettings={() => setClockModalOpen(true)}
              playlist={activePlaylist}
              listenersCount={listenersCount}
            />
          ) : (
            <button
              type="button"
              onClick={() => setClockModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md hover:bg-black/60 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Clock Style</span>
            </button>
          )}

          {/* Quick Support / Chai button at top right matching screenshot 1/3 */}
          <button
            type="button"
            onClick={handleChaiClick}
            aria-label="Tea for driver"
            className="hidden md:flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md hover:bg-amber-500/20 transition-all"
          >
            <span>☕</span>
            <span>{activePlaylist.teaButtonText}</span>
          </button>
        </div>
      </header>

      {/* Main Hero & Station Content */}
      <main className="relative z-10 flex min-h-[calc(100vh-160px)] flex-col items-center justify-center">
        <StationHero
          playlist={activePlaylist}
          rainActive={rainActive}
          onToggleRain={handleToggleRain}
          onChaiClick={handleChaiClick}
          onHornClick={handleHorn}
          onScissorsClick={handleScissors}
          onSprayClick={handleSpray}
          chaiCount={chaiCount}
        />
      </main>

      {/* Persistent Bottom Floating Music Player Bar */}
      <MusicPlayer
        playlist={activePlaylist}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (ytControlsRef.current) {
            ytControlsRef.current.togglePlay();
          } else {
            setIsPlaying((p) => !p);
          }
        }}
        onNext={() => ytControlsRef.current?.next()}
        onPrev={() => ytControlsRef.current?.prev()}
        volume={volume}
        onVolumeChange={(val) => {
          setVolume(val);
          ytControlsRef.current?.setVolume(val);
        }}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((v) => !v)}
        currentTime={currentTime}
        duration={duration}
        onSeek={(seconds) => {
          setCurrentTime(seconds);
          ytControlsRef.current?.seekTo(seconds);
        }}
        currentTrack={currentTrack}
        videoVisible={videoVisible}
        onToggleVideoVisible={() => setVideoVisible((v) => !v)}
        onToggleTracklist={() => setTracklistOpen((v) => !v)}
        tracklistOpen={tracklistOpen}
      />

      {/* YouTube Player Iframe backend */}
      <YouTubePlayer
        playlistId={activePlaylist.youtubePlaylistId}
        isPlaying={isPlaying}
        onPlayStateChange={(playing) => setIsPlaying(playing)}
        onTrackChange={(title, artist) => {
          setCurrentTrack({
            id: `yt-${Date.now()}`,
            title,
            artist,
            thumbnail: activePlaylist.bgImage,
          });
        }}
        volume={volume}
        isMuted={isMuted}
        videoVisible={videoVisible}
        onToggleVideoVisible={() => setVideoVisible((v) => !v)}
        playerRefCallback={(controls) => {
          ytControlsRef.current = controls;
        }}
      />

      {/* Left Collapsible Sidebar */}
      <Sidebar
        playlists={playlists}
        activePlaylistId={activePlaylist.id}
        onSelectPlaylist={handleSelectPlaylist}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen((v) => !v)}
        rainActive={rainActive}
        onToggleRain={handleToggleRain}
        onPlayHorn={handleHorn}
        onChaiClick={handleChaiClick}
        onScissorsClick={handleScissors}
        onSprayClick={handleSpray}
        onOpenClockSettings={() => setClockModalOpen(true)}
        onCustomPlaylistSubmit={handleCustomPlaylist}
      />

      {/* Right Slide-over Tracklist Drawer */}
      <TracklistDrawer
        isOpen={tracklistOpen}
        onClose={() => setTracklistOpen(false)}
        playlist={activePlaylist}
        currentTrackId={currentTrack?.id}
        onSelectTrack={(track) => {
          setCurrentTrack(track);
          setIsPlaying(true);
          ytControlsRef.current?.play();
        }}
      />

      {/* Customizable Live Clock Settings Modal */}
      <ClockSettingsModal
        isOpen={clockModalOpen}
        onClose={() => setClockModalOpen(false)}
        config={clockConfig}
        onChange={(updated) => setClockConfig(updated)}
        accentColor={activePlaylist.accentColor}
      />

      {/* Steaming Chai Toast Notification */}
      <ChaiCelebration
        show={showChaiToast}
        onClose={() => setShowChaiToast(false)}
        count={chaiCount}
        message={chaiMessage}
      />
    </div>
  );
}
