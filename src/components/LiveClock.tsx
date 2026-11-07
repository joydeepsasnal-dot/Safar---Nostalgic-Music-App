import React, { useState, useEffect } from 'react';
import { ClockConfig, PlaylistData } from '../types/index.ts';
import { getTimeParts, formatDate } from '../utils/time.ts';
import { Settings2, Radio, Calendar } from 'lucide-react';

interface LiveClockProps {
  config: ClockConfig;
  onOpenSettings: () => void;
  playlist: PlaylistData;
  listenersCount: number;
}

export const LiveClock: React.FC<LiveClockProps> = ({
  config,
  onOpenSettings,
  playlist,
  listenersCount,
}) => {
  const [now, setNow] = useState<Date>(new Date());
  const [colonVisible, setColonVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date();
      setNow(currentDate);
      if (config.blinkingColon) {
        setColonVisible((v) => !v);
      } else {
        setColonVisible(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config.blinkingColon]);

  const { hours, minutes, seconds, period } = getTimeParts(now, config.format);
  const formattedDate = formatDate(now, config.dateFormat);

  // Map font config to css classes
  const getFontFamilyClass = () => {
    switch (config.font) {
      case 'mono':
        return 'font-mono-code';
      case 'digital':
        return 'font-digital tracking-wider';
      case 'tech':
        return 'font-tech tracking-wide';
      case 'serif':
        return 'font-serif-display';
      case 'sans':
      default:
        return 'font-sans-clean font-semibold';
    }
  };

  const getSizeClass = () => {
    switch (config.size) {
      case 'sm':
        return 'text-lg md:text-xl';
      case 'lg':
        return 'text-3xl md:text-5xl';
      case 'xl':
        return 'text-4xl md:text-6xl';
      case 'md':
      default:
        return 'text-2xl md:text-3xl';
    }
  };

  const getGlowStyle = () => {
    if (!config.glow) return {};
    return {
      textShadow: `0 0 16px ${playlist.accentColor}80, 0 0 32px ${playlist.accentColor}40`,
    };
  };

  return (
    <div
      className="group relative inline-flex flex-col items-end transition-all duration-300"
      data-testid="live-clock-container"
    >
      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Clock and time settings"
        className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-1.5 transition-all duration-200 hover:bg-white/10 text-left"
        title="Click to customize minimalist clock & font"
      >
        {/* Listeners badge (if left aligned or enabled) */}
        {config.showListeners && (
          <div className="mr-1 hidden sm:flex items-center gap-1.5 text-xs text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono-code font-medium">{listenersCount} listening</span>
            <span className="text-white/40">•</span>
          </div>
        )}

        {/* Time Display */}
        <div
          className={`flex items-baseline select-none text-white ${getFontFamilyClass()} ${getSizeClass()}`}
          style={getGlowStyle()}
        >
          <span className="font-bold">{hours}</span>

          <span
            className={`mx-0.5 inline-block transition-opacity duration-150 ${
              colonVisible ? 'opacity-100' : 'opacity-20'
            }`}
          >
            :
          </span>

          <span className="font-bold">{minutes}</span>

          {config.showSeconds && (
            <>
              {config.secondsStyle === 'superscript' ? (
                <span className="ml-1 text-[0.55em] font-medium text-white/80 self-start pt-0.5">
                  {seconds}
                </span>
              ) : config.secondsStyle === 'subtle' ? (
                <span className="ml-1 text-[0.7em] font-normal text-white/50">
                  {seconds}
                </span>
              ) : (
                <span className="ml-1 text-[0.8em] font-medium text-white/75">
                  :{seconds}
                </span>
              )}
            </>
          )}

          {config.format === '12h' && period && (
            <span className="ml-1.5 text-xs sm:text-sm font-semibold tracking-wider text-white/80 uppercase">
              {period}
            </span>
          )}
        </div>

        {/* Customize gear icon visible on hover / focus */}
        <span
          aria-hidden="true"
          className="ml-1 rounded-lg p-1 text-white/50 opacity-60 transition-all hover:bg-white/10 hover:text-white hover:opacity-100 group-hover:opacity-100"
        >
          <Settings2 className="h-3.5 w-3.5" />
        </span>
      </button>

      {/* Date display */}
      {config.showDate && formattedDate && (
        <div className="flex items-center gap-1.5 px-3 text-xs tracking-wide text-white/60">
          <Calendar className="h-3 w-3 opacity-60" />
          <span className="font-medium">{formattedDate}</span>
        </div>
      )}
    </div>
  );
};
