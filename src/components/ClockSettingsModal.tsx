import React from 'react';
import { ClockConfig, ClockFont, ClockFormat, SecondsStyle, DateFormat, ClockPosition, ClockSize } from '../types/index.ts';
import { X, Check, Type, Clock, Calendar, Sparkles, Layout } from 'lucide-react';

interface ClockSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ClockConfig;
  onChange: (updated: ClockConfig) => void;
  accentColor: string;
}

export const ClockSettingsModal: React.FC<ClockSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  accentColor,
}) => {
  if (!isOpen) return null;

  const fontOptions: { id: ClockFont; label: string; preview: string; fontClass: string }[] = [
    { id: 'sans', label: 'Minimalist Sans', preview: '18:47', fontClass: 'font-sans-clean' },
    { id: 'mono', label: 'JetBrains Mono', preview: '18:47', fontClass: 'font-mono-code' },
    { id: 'digital', label: 'Vintage 80s LED', preview: '18:47', fontClass: 'font-digital text-2xl' },
    { id: 'tech', label: 'Share Tech Terminal', preview: '18:47', fontClass: 'font-tech' },
    { id: 'serif', label: 'Classic Editorial', preview: '18:47', fontClass: 'font-serif-display' },
  ];

  const presets = [
    {
      name: 'Bus Driver Look',
      desc: '24H • Superscript Seconds • Clean Grotesk',
      apply: () =>
        onChange({
          ...config,
          font: 'sans',
          format: '24h',
          showSeconds: true,
          secondsStyle: 'superscript',
          showDate: false,
          position: 'top-right',
          size: 'md',
        }),
    },
    {
      name: 'Truck Driver Look',
      desc: '12H AM/PM • Monospace • Highway Listeners',
      apply: () =>
        onChange({
          ...config,
          font: 'mono',
          format: '12h',
          showSeconds: false,
          showDate: false,
          showListeners: true,
          position: 'top-left',
          size: 'md',
        }),
    },
    {
      name: 'Retro Salon Clock',
      desc: 'Digital LED • 12H • Full Date Display',
      apply: () =>
        onChange({
          ...config,
          font: 'digital',
          format: '12h',
          showSeconds: true,
          secondsStyle: 'inline',
          showDate: true,
          dateFormat: 'short',
          position: 'top-right',
          size: 'lg',
        }),
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clock-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/95 p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <h2 id="clock-settings-title" className="text-lg font-bold">
              Customizable Live Clock
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close clock settings"
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Style Presets */}
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Quick Theme Presets
          </label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={preset.apply}
                className="flex flex-col items-start p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-all hover:scale-[1.02]"
              >
                <span className="text-xs font-bold text-white">{preset.name}</span>
                <span className="text-[10px] text-white/60 mt-0.5 line-clamp-1">{preset.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Style Selection */}
        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-amber-400" /> Minimalist Font Family
          </label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {fontOptions.map((f) => {
              const active = config.font === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange({ ...config, font: f.id })}
                  className={`flex flex-col items-start justify-between p-3 rounded-xl border text-left transition-all ${
                    active
                      ? 'border-amber-400 bg-amber-500/10 text-white'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-white/70">{f.label}</span>
                    {active && <Check className="h-3.5 w-3.5 text-amber-400" />}
                  </div>
                  <span className={`mt-2 text-xl font-bold ${f.fontClass}`}>{f.preview}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clock Format & Seconds Style */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Time Format
            </label>
            <div className="mt-2 flex rounded-lg border border-white/10 p-1 bg-white/5">
              <button
                type="button"
                onClick={() => onChange({ ...config, format: '24h' })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  config.format === '24h' ? 'bg-amber-500 text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                24-Hour (18:47)
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...config, format: '12h' })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  config.format === '12h' ? 'bg-amber-500 text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                12-Hour (6:47 PM)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Seconds Indicator
            </label>
            <div className="mt-2 flex rounded-lg border border-white/10 p-1 bg-white/5">
              {(['superscript', 'inline', 'none'] as SecondsStyle[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...config,
                      showSeconds: st !== 'none',
                      secondsStyle: st,
                    })
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                    (config.secondsStyle === st && config.showSeconds) || (!config.showSeconds && st === 'none')
                      ? 'bg-amber-500 text-black'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {st === 'superscript' ? '¹⁸:⁴⁷ ⁴⁸' : st === 'inline' ? ':48' : 'Off'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Date format & Position */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-400" /> Live Date Display
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { id: 'full', label: 'Full Date' },
                { id: 'short', label: 'Short' },
                { id: 'compact', label: 'DD/MM/YYYY' },
                { id: 'none', label: 'Hidden' },
              ].map((d) => {
                const active = (config.showDate && config.dateFormat === d.id) || (!config.showDate && d.id === 'none');
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...config,
                        showDate: d.id !== 'none',
                        dateFormat: d.id as DateFormat,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      active
                        ? 'border-amber-400 bg-amber-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Layout className="h-3.5 w-3.5 text-amber-400" /> Position
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { id: 'top-right', label: 'Top Right' },
                { id: 'top-left', label: 'Top Left' },
                { id: 'top-center', label: 'Top Center' },
              ].map((p) => {
                const active = config.position === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onChange({ ...config, position: p.id as ClockPosition })}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      active
                        ? 'border-amber-400 bg-amber-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toggles: Blinking colon, Glow */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
            <input
              type="checkbox"
              checked={config.blinkingColon}
              onChange={(e) => onChange({ ...config, blinkingColon: e.target.checked })}
              className="rounded accent-amber-500 h-4 w-4"
            />
            Blinking colon (:)
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
            <input
              type="checkbox"
              checked={config.glow}
              onChange={(e) => onChange({ ...config, glow: e.target.checked })}
              className="rounded accent-amber-500 h-4 w-4"
            />
            Night Glow Glow Effect
          </label>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
