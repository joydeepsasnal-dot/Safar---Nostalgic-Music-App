export type ClockFont = 'sans' | 'mono' | 'digital' | 'tech' | 'serif' | 'display';
export type ClockFormat = '12h' | '24h';
export type SecondsStyle = 'inline' | 'superscript' | 'subtle' | 'none';
export type DateFormat = 'full' | 'short' | 'compact' | 'iso' | 'none';
export type ClockPosition = 'top-right' | 'top-left' | 'top-center' | 'badge';
export type ClockSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ClockConfig {
  font: ClockFont;
  format: ClockFormat;
  showSeconds: boolean;
  secondsStyle: SecondsStyle;
  showDate: boolean;
  dateFormat: DateFormat;
  blinkingColon: boolean;
  showListeners: boolean;
  position: ClockPosition;
  size: ClockSize;
  glow: boolean;
}

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  thumbnail?: string;
}

export interface PlaylistData {
  id: 'bus-driver' | 'salon' | 'truck-driver' | string;
  name: string;
  nativeTitle: string;
  nativeFontClass: string;
  subtitle: string;
  route: string;
  songsCount: string;
  motto: string;
  secondaryMotto: string;
  teaButtonText: string;
  youtubePlaylistId: string;
  bgImage: string;
  originalReferenceImage?: string;
  accentColor: string;
  accentBorder: string;
  themeStyle: 'amber' | 'emerald' | 'crimson';
  defaultRain: boolean;
  initialListeners: number;
  featuredTracks: TrackInfo[];
  shortcutsLabel: string;
}
