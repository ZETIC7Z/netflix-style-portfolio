import { useState } from 'react';
import { useAudioPlayer, type Song } from '../context/AudioPlayerContext';

/* Exact Lucide-equivalent inline SVG icons (zero external icon bundle overhead) */
const PlayIcon = ({ size = 15, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

const PauseIcon = ({ size = 15, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="14" y="4" width="4" height="16" rx="1" />
    <rect x="6" y="4" width="4" height="16" rx="1" />
  </svg>
);

const SkipBackIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="19 20 9 12 19 4 19 20" />
    <line x1="5" x2="5" y1="19" y2="5" />
  </svg>
);

const SkipForwardIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 4 15 12 5 20 5 4" />
    <line x1="19" x2="19" y1="5" y2="19" />
  </svg>
);

const Volume2Icon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const MoreHorizontalIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const SearchIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ListIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" x2="21" y1="6" y2="6" />
    <line x1="8" x2="21" y1="12" y2="12" />
    <line x1="8" x2="21" y1="18" y2="18" />
    <line x1="3" x2="3.01" y1="6" y2="6" />
    <line x1="3" x2="3.01" y1="12" y2="12" />
    <line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
);

const PlusIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const Trash2Icon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const XIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const Maximize2Icon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" x2="14" y1="3" y2="10" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </svg>
);

const Minimize2Icon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" x2="21" y1="10" y2="3" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </svg>
);

const MusicIcon = ({ size = 28, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const ChevronUpIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const GripVerticalIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
);

export default function SWSMusicPlayer({ onClose, id = 'sws-music-player' }: { onClose?: () => void; id?: string }) {
  const {
    playlist,
    currentSongIndex,
    playing,
    currentTime,
    duration,
    volume,
    setVolume,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    addToPlaylist,
    removeFromPlaylist,
    moveSongInPlaylist,
    playSearchedSong,
    selectSongAtIndex,
    resetPlaylistToDefault,
  } = useAudioPlayer();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Volume slider popover state
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const currentSong = playlist[currentSongIndex] || null;

  // Seek handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo(val);
  };

  // Volume handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
  };

  // Format elapsed time (seconds -> mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Format remaining time (seconds -> -mm:ss)
  const formatRemainingTime = (secs: number) => {
    const rem = duration - secs;
    if (isNaN(rem) || rem <= 0) return '-0:00';
    const m = Math.floor(rem / 60);
    const s = Math.floor(rem % 60);
    return `-${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // YouTube Search using API Key (exact SWS implementation)
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    setSearchLoading(true);
    try {
      const apiKey =
        (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_YOUTUBE_API_KEY ||
        'AIzaSyAeIy261EmClOm7zElt2Y0j2wMazfDjC9M';
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          q,
        )}&type=video&maxResults=8&key=${apiKey}`,
        { referrerPolicy: 'no-referrer' },
      );
      if (res.ok) {
        const data = await res.json();
        const songs: Song[] = (data.items || []).map((item: any) => ({
          videoId: item.id?.videoId,
          songName: item.snippet?.title,
          authorName: item.snippet?.channelTitle,
          albumArt:
            item.snippet?.thumbnails?.high?.url ||
            `https://i.ytimg.com/vi/${item.id?.videoId}/hqdefault.jpg`,
        }));
        setSearchResults(songs);
      } else {
        console.error('YouTube search error:', res.status, res.statusText);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <div
        id={id}
        className="flex items-center justify-between gap-4 rounded-xl border border-crimson-2/30 bg-[#0b0b12]/95 px-4 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl"
      >
        <div className="flex min-w-0 items-center gap-3">
          {currentSong && (
            <img
              src={currentSong.albumArt}
              alt=""
              className="h-9 w-9 shrink-0 rounded-md border border-crimson-2/30 object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-crimson-2">
              {currentSong ? currentSong.songName : 'ZETICUZ Playlist'}
            </p>
            <p className="truncate text-[10px] text-mist">
              {currentSong ? currentSong.authorName : 'No song playing'} · {formatTime(currentTime)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={playPrev}
            className="p-1 text-mist transition-colors hover:text-crimson-2"
            aria-label="Previous track"
          >
            <SkipBackIcon size={15} />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-crimson-2/60 bg-gradient-to-b from-crimson-2 to-crimson text-bone shadow-md shadow-crimson/20 transition-transform hover:scale-105"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <PauseIcon size={13} /> : <PlayIcon size={13} className="ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={() => playNext()}
            className="p-1 text-mist transition-colors hover:text-crimson-2"
            aria-label="Next track"
          >
            <SkipForwardIcon size={15} />
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="ml-1 rounded border border-crimson-2/30 bg-crimson/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-bone transition hover:bg-crimson/30"
            title="Expand Music Player"
          >
            Expand
          </button>
        </div>
      </div>
    );
  }

  const progressPct = duration ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <div
      id={id}
      className={`relative flex select-none flex-col justify-between overflow-hidden rounded-xl border border-crimson-2/30 bg-[#0b0b12]/92 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(229,19,43,0.12)] backdrop-blur-xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-[999] h-auto md:inset-10' : 'w-full'
      }`}
      style={isFullscreen ? {} : { height: '260px' }}
    >
      {/* Subtle top-right crimson glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-crimson/15 blur-3xl"
      />

      {/* Main Container */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-4 pb-2">
        {/* Title Bar (Minimized / Maximize / Close controls at far right) */}
        <div className="absolute right-4 top-3 z-20 flex items-center gap-2.5 text-crimson-2/70">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="cursor-pointer text-sm font-bold transition-colors hover:text-crimson-2"
            title="Minimize Player"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="cursor-pointer transition-colors hover:text-crimson-2"
            title={isFullscreen ? 'Exit Full Screen' : 'Open Full Screen Player'}
          >
            {isFullscreen ? <Minimize2Icon size={13} /> : <Maximize2Icon size={13} />}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isFullscreen) {
                setIsFullscreen(false);
              } else if (onClose) {
                onClose();
              }
            }}
            className="cursor-pointer transition-colors hover:text-crimson-2"
            title="Close"
          >
            <XIcon size={13} />
          </button>
        </div>

        {/* Content Panel */}
        <div className="mt-2 flex flex-1 gap-5 overflow-hidden">
          {/* Left Side: Cover Art and Elapsed Time */}
          <div className="flex w-24 flex-shrink-0 flex-col items-center gap-2">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-crimson-2/30 bg-black/50 shadow-lg">
              {currentSong ? (
                <img
                  src={currentSong.albumArt}
                  alt={currentSong.songName}
                  className={`h-full w-full select-none object-cover ${playing ? 'animate-pulse' : ''}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <MusicIcon size={28} className="text-crimson-2/40" />
                </div>
              )}
            </div>
            {/* Elapsed Time below album art */}
            <span className="font-mono text-[11px] tracking-wider text-crimson-2/90">
              {formatTime(currentTime)}
            </span>
          </div>

          {/* Right Side: Metadata, Progress Bar, and Remaining Time */}
          <div className="flex min-w-0 flex-1 flex-col justify-center pr-8">
            <h3 className="truncate font-sans text-[16px] font-bold uppercase tracking-wide text-crimson-2 drop-shadow-[0_0_12px_rgba(255,61,90,0.35)] sm:text-[17px]">
              {currentSong ? currentSong.songName : 'ZETICUZ Playlist'}
            </h3>
            <p className="mt-1 truncate font-sans text-[12px] text-bone/80">
              {currentSong ? currentSong.authorName : 'No song playing'}
            </p>

            {/* Progress Slider Container */}
            <div className="relative mt-4 w-full">
              <input
                type="range"
                min="0"
                max={duration || 4508}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Seek music track"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-crimson/20 accent-crimson-2 outline-none"
                style={{
                  background: `linear-gradient(to right, #ff3d5a 0%, #e5132b ${progressPct}%, rgba(255,61,90,0.22) ${progressPct}%, rgba(255,61,90,0.22) 100%)`,
                }}
              />
              {/* Remaining Time display to the right end */}
              <div className="mt-1 flex justify-end">
                <span className="font-mono text-[10px] text-crimson-2/75">
                  {formatRemainingTime(currentTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls and Action Toolbar (Bottom) */}
        <div className="relative mt-1 flex h-12 items-center justify-between border-t border-crimson-2/20 text-crimson-2/85">
          {/* Left Controls: Volume & Options */}
          <div className="relative flex flex-shrink-0 items-center gap-4">
            {/* Volume Speaker Icon & Popover */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="cursor-pointer transition-colors hover:text-crimson-2"
                title="Volume"
              >
                <Volume2Icon size={16} />
              </button>
              {showVolumeSlider && (
                <div className="absolute left-6 z-30 flex items-center rounded-md border border-crimson-2/35 bg-[#120d12] p-2 shadow-xl">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-label="Music volume"
                    className="h-1 w-16 cursor-pointer rounded-full bg-crimson/25 accent-crimson-2 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Choose Options (•••) */}
            <button
              type="button"
              onClick={() => {
                setShowOptions(!showOptions);
                setShowSearch(false);
                setShowPlaylist(false);
              }}
              className="cursor-pointer transition-colors hover:text-crimson-2"
              title="Choose Options"
            >
              <MoreHorizontalIcon size={16} />
            </button>
          </div>

          {/* Center Playback Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={playPrev}
              className="cursor-pointer p-1 transition-colors hover:text-crimson-2"
              title="Previous Song"
            >
              <SkipBackIcon size={18} />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-crimson-2/70 bg-gradient-to-b from-crimson-2 to-crimson text-bone shadow-md shadow-crimson/25 transition-transform hover:scale-105"
              title={playing ? 'Pause' : 'Play'}
            >
              {playing ? <PauseIcon size={15} /> : <PlayIcon size={15} className="ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => playNext()}
              className="cursor-pointer p-1 transition-colors hover:text-crimson-2"
              title="Next Song"
            >
              <SkipForwardIcon size={18} />
            </button>
          </div>

          {/* Right Action Icons: Search & Playlist */}
          <div className="flex items-center gap-4">
            {/* Search Button to open YouTube Search Overlay */}
            <button
              type="button"
              onClick={() => {
                setShowSearch(!showSearch);
                setShowPlaylist(false);
                setShowOptions(false);
              }}
              className={`cursor-pointer transition-colors hover:text-crimson-2 ${
                showSearch ? 'text-crimson-2 drop-shadow-[0_0_8px_rgba(255,61,90,0.6)]' : ''
              }`}
              title="Search Music"
            >
              <SearchIcon size={16} />
            </button>

            {/* Open Playing Next List */}
            <button
              type="button"
              onClick={() => {
                setShowPlaylist(!showPlaylist);
                setShowSearch(false);
                setShowOptions(false);
              }}
              className={`cursor-pointer transition-colors hover:text-crimson-2 ${
                showPlaylist ? 'text-crimson-2 drop-shadow-[0_0_8px_rgba(255,61,90,0.6)]' : ''
              }`}
              title="Open Playing Next List"
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── SEARCH / ADD SONGS OVERLAY ─── */}
      {showSearch && (
        <div className=" absolute inset-0 z-20 flex flex-col rounded-xl border border-crimson-2/25 bg-[#09090f]/95 p-4 text-bone backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between border-b border-crimson-2/20 pb-1">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-crimson-2">
              <SearchIcon size={12} /> YouTube Search
            </span>
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="cursor-pointer transition-colors hover:text-crimson-2"
            >
              <XIcon size={15} />
            </button>
          </div>

          <div className="mb-2 flex items-center gap-1.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search YouTube music..."
              className="h-7 flex-1 rounded border border-crimson-2/30 bg-black/50 px-3 text-[11px] text-bone placeholder:text-smoke focus:border-crimson-2 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searchLoading}
              className="h-7 cursor-pointer rounded border border-crimson-2/60 bg-gradient-to-b from-crimson-2 to-crimson px-3 text-[10px] font-bold uppercase tracking-wider text-bone hover:brightness-110 disabled:opacity-60"
            >
              {searchLoading ? '...' : 'Search'}
            </button>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 text-[11px]">
            {searchResults.length === 0 ? (
              <p className="mt-8 text-center text-smoke">Search to see results</p>
            ) : (
              searchResults.map((song) => {
                const isAdded = playlist.some((s) => s.videoId === song.videoId);
                return (
                  <div
                    key={song.videoId}
                    onClick={() => playSearchedSong(song)}
                    className="flex cursor-pointer items-center gap-2 rounded border border-crimson-2/15 bg-black/40 p-1.5 transition-colors hover:bg-crimson/10"
                  >
                    <img
                      src={song.albumArt}
                      alt=""
                      className="pointer-events-none h-8 w-8 select-none rounded object-cover"
                    />
                    <div className="pointer-events-none min-w-0 flex-1">
                      <p className="truncate text-[10px] font-bold text-bone">{song.songName}</p>
                      <p className="truncate text-[9px] text-mist">{song.authorName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToPlaylist(song);
                      }}
                      disabled={isAdded}
                      className={`rounded p-1.5 transition-colors ${
                        isAdded
                          ? 'cursor-default text-[#46e3a8]'
                          : 'cursor-pointer border border-crimson-2/25 bg-crimson/15 text-bone/90 hover:bg-crimson/30 hover:text-crimson-2'
                      }`}
                      title="Add to Playlist"
                    >
                      {isAdded ? '✓' : <PlusIcon size={12} />}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── OPTIONS OVERLAY ─── */}
      {showOptions && (
        <div className="absolute inset-0 z-20 flex flex-col rounded-xl border border-crimson-2/25 bg-[#09090f]/95 p-4 text-bone backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between border-b border-crimson-2/20 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-crimson-2">
              Choose Options
            </span>
            <button
              type="button"
              onClick={() => setShowOptions(false)}
              className="cursor-pointer transition-colors hover:text-crimson-2"
            >
              <XIcon size={15} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-3 p-4">
            <button
              type="button"
              onClick={() => {
                resetPlaylistToDefault();
                setShowOptions(false);
              }}
              className="w-full cursor-pointer rounded border border-crimson-2/40 bg-crimson/15 py-2 text-center text-xs font-bold uppercase tracking-wider text-crimson-2 transition-colors hover:bg-crimson/25"
            >
              Reset Playlist to Default (0:00)
            </button>
            <p className="text-center text-[10px] text-mist">
              Search icon adds tracks · Playing Next lets you drag or ↑↓ reorder tracks. Your playlist & playback timestamp auto-resume in this browser.
            </p>
          </div>
        </div>
      )}

      {/* ─── PLAYLIST / QUEUE OVERLAY ─── */}
      {showPlaylist && (
        <div className="absolute inset-0 z-20 flex flex-col rounded-xl border border-crimson-2/25 bg-[#09090f]/95 p-4 text-bone backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between border-b border-crimson-2/20 pb-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-crimson-2">
                <ListIcon size={12} /> Playing Next ({playlist.length})
              </span>
              <span className="hidden text-[9px] uppercase tracking-wider text-smoke sm:inline">
                · Drag or ↑↓ to rearrange
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPlaylist(false)}
              className="cursor-pointer transition-colors hover:text-crimson-2"
            >
              <XIcon size={15} />
            </button>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 text-[11px]">
            {playlist.map((song, idx) => (
              <div
                key={song.videoId + '-' + idx}
                draggable
                onDragStart={() => setDraggedIdx(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverIdx !== idx) setDragOverIdx(idx);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIdx !== null && draggedIdx !== idx) {
                    moveSongInPlaylist(draggedIdx, idx);
                  }
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onClick={() => selectSongAtIndex(idx)}
                className={`flex cursor-pointer items-center gap-2 rounded border p-1.5 transition-colors ${
                  dragOverIdx === idx && draggedIdx !== idx
                    ? 'border-crimson-2 bg-crimson/30'
                    : idx === currentSongIndex
                      ? 'border-crimson-2/50 bg-crimson/20'
                      : 'border-transparent bg-black/40 hover:bg-crimson/10'
                }`}
              >
                <span
                  className="cursor-grab text-smoke/70 hover:text-crimson-2 active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVerticalIcon size={12} />
                </span>
                <span className="w-4 text-center font-mono text-crimson-2/60">{idx + 1}</span>
                <img src={song.albumArt} alt="" className="h-8 w-8 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold text-bone">{song.songName}</p>
                  <p className="truncate text-[9px] text-mist">{song.authorName}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSongInPlaylist(idx, idx - 1);
                    }}
                    className="cursor-pointer rounded p-1 text-smoke transition-colors hover:bg-white/5 hover:text-crimson-2 disabled:cursor-not-allowed disabled:opacity-25"
                    title="Move track up"
                    aria-label="Move track up"
                  >
                    <ChevronUpIcon size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === playlist.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSongInPlaylist(idx, idx + 1);
                    }}
                    className="cursor-pointer rounded p-1 text-smoke transition-colors hover:bg-white/5 hover:text-crimson-2 disabled:cursor-not-allowed disabled:opacity-25"
                    title="Move track down"
                    aria-label="Move track down"
                  >
                    <ChevronDownIcon size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => removeFromPlaylist(idx, e)}
                    className="cursor-pointer rounded p-1.5 text-smoke transition-colors hover:bg-white/5 hover:text-crimson-2"
                    title="Remove from playlist"
                    aria-label="Remove from playlist"
                  >
                    <Trash2Icon size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
