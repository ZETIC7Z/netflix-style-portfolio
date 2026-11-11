import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface Song {
  videoId: string;
  songName: string;
  authorName: string;
  albumArt: string;
  startSeconds?: number;
}

export const DEFAULT_PLAYLIST: Song[] = [
  {
    videoId: 'iNsO2CbCV0Y',
    songName: 'OPM Trending Playlist 2026 — Must Listen Filipino Songs Mix',
    authorName: 'OPM Calm',
    albumArt: 'https://i.ytimg.com/vi/iNsO2CbCV0Y/hqdefault.jpg',
    startSeconds: 2344,
  },
  {
    videoId: '_fgOrexuD_E',
    songName: '45 Sipag Buto AKP UMC 45th Anniversarry Akrho Song LongLive!',
    authorName: 'Jose Blair Becaldo',
    albumArt: 'https://i.ytimg.com/vi/_fgOrexuD_E/hqdefault.jpg',
  },
  {
    videoId: 'xFYQQPAOz7Y',
    songName: 'Lose Yourself',
    authorName: 'Eminem',
    albumArt: 'https://i.ytimg.com/vi/xFYQQPAOz7Y/hqdefault.jpg',
  },
  {
    videoId: '5ymlO_GaWrU',
    songName: 'We The Scepters - Honestas Et Dignitas ( Official Video )',
    authorName: 'We The Scepters',
    albumArt: 'https://i.ytimg.com/vi/5ymlO_GaWrU/hqdefault.jpg',
  },
  {
    videoId: 'y0LQaRHIVoU',
    songName: 'Stig',
    authorName: 'Bugoy na Koykoy',
    albumArt: 'https://i.ytimg.com/vi/y0LQaRHIVoU/hqdefault.jpg',
  },
];

const STORAGE_KEY = 'zeticuz_portfolio_music_playlist_v1';

interface AudioPlayerContextType {
  playlist: Song[];
  setPlaylist: React.Dispatch<React.SetStateAction<Song[]>>;
  currentSongIndex: number;
  setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (vol: number) => void;
  completedSongs: string[];
  setCompletedSongs: React.Dispatch<React.SetStateAction<string[]>>;
  togglePlay: () => void;
  playNext: (isAutoEnd?: boolean) => void;
  playPrev: () => void;
  seekTo: (seconds: number) => void;
  addToPlaylist: (song: Song) => void;
  removeFromPlaylist: (index: number, e: React.MouseEvent) => void;
  playSearchedSong: (song: Song) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [playlist, setPlaylist] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Song[];
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].videoId === 'iNsO2CbCV0Y') {
          return parsed;
        }
      }
    } catch {
      /* ignore */
    }
    return DEFAULT_PLAYLIST;
  });

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(true);
  const [completedSongs, setCompletedSongs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(2344);
  const [duration, setDuration] = useState<number>(4508);
  const [volume, setVolumeState] = useState<number>(80);

  const playlistRef = useRef(playlist);
  const currentSongIndexRef = useRef(currentSongIndex);
  const completedSongsRef = useRef(completedSongs);
  const volumeRef = useRef(volume);
  const wantPlayingRef = useRef<boolean>(true);
  const hasUsedInitialOffsetRef = useRef<boolean>(false);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isApiLoadedRef = useRef(false);
  const playNextRef = useRef<((isAutoEnd?: boolean) => void) | null>(null);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentSongIndexRef.current = currentSongIndex;
  }, [currentSongIndex]);

  useEffect(() => {
    completedSongsRef.current = completedSongs;
  }, [completedSongs]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const currentSong = playlist[currentSongIndex] || null;

  // Persist playlist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlist));
    } catch {
      /* ignore */
    }
  }, [playlist]);

  // Load YouTube IFrame API & initialize player
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.YT && !isApiLoadedRef.current) {
      isApiLoadedRef.current = true;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const initPlayer = () => {
      if (!currentSong || !window.YT || !window.YT.Player) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          /* ignore */
        }
      }

      const startAt =
        currentSong.videoId === 'iNsO2CbCV0Y' && !hasUsedInitialOffsetRef.current
          ? currentSong.startSeconds || 2344
          : currentSong.startSeconds || 0;

      playerRef.current = new window.YT.Player('sws-yt-player-container', {
        height: '1',
        width: '1',
        videoId: currentSong.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
          start: startAt,
        },
        events: {
          onReady: (event: any) => {
            hasUsedInitialOffsetRef.current = true;
            try {
              event.target.setVolume(volumeRef.current);
              if (startAt > 0) {
                setCurrentTime(startAt);
              }
              if (wantPlayingRef.current) {
                event.target.playVideo();
              }
            } catch {
              /* ignore */
            }
          },
          onStateChange: (event: any) => {
            if (event.data === 0) {
              // ENDED
              const finishedVideoId = currentSong?.videoId;
              if (finishedVideoId) {
                setCompletedSongs((prev) => {
                  if (prev.includes(finishedVideoId)) return prev;
                  const newCompleted = [...prev, finishedVideoId];
                  completedSongsRef.current = newCompleted;
                  return newCompleted;
                });
              }
              if (playNextRef.current) {
                playNextRef.current(true);
              }
            } else if (event.data === 1) {
              // PLAYING
              wantPlayingRef.current = true;
              setPlaying(true);
              if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
                setDuration(playerRef.current.getDuration() || 0);
              }
            } else if (event.data === 2) {
              // PAUSED
              setPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevReady) prevReady();
        initPlayer();
      };
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentSongIndex]);

  // Ensure default autoplay resumes immediately upon first user gesture if browser policy deferred initial unmuted playback
  useEffect(() => {
    const unlockAutoplay = () => {
      if (!wantPlayingRef.current || !playerRef.current) return;
      try {
        const state =
          typeof playerRef.current.getPlayerState === 'function'
            ? playerRef.current.getPlayerState()
            : -1;
        if (state !== 1) {
          playerRef.current.setVolume?.(volumeRef.current);
          playerRef.current.playVideo?.();
          setPlaying(true);
        }
      } catch {
        /* ignore */
      }
    };

    window.addEventListener('pointerdown', unlockAutoplay, { passive: true });
    window.addEventListener('keydown', unlockAutoplay, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAutoplay);
      window.removeEventListener('keydown', unlockAutoplay);
    };
  }, []);

  // Track progress when playing
  useEffect(() => {
    if (playing) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const t = playerRef.current.getCurrentTime();
          const d = playerRef.current.getDuration() || 0;
          if (typeof t === 'number' && !isNaN(t)) setCurrentTime(t);
          if (typeof d === 'number' && d > 0) setDuration(d);
        }
      }, 500);
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [playing]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      const state =
        typeof playerRef.current.getPlayerState === 'function'
          ? playerRef.current.getPlayerState()
          : playing
            ? 1
            : 2;
      if (state === 1) {
        wantPlayingRef.current = false;
        playerRef.current.pauseVideo();
        setPlaying(false);
      } else {
        wantPlayingRef.current = true;
        playerRef.current.playVideo();
        setPlaying(true);
      }
    } catch {
      /* ignore */
    }
  };

  const playNext = async (isAutoEnd = false) => {
    const currentPlaylist = playlistRef.current;
    const currentIndex = currentSongIndexRef.current;
    const currentCompleted = completedSongsRef.current;

    if (currentPlaylist.length === 0) return;

    wantPlayingRef.current = true;
    const nextIndex = currentIndex + 1;
    const reachedEnd = nextIndex >= currentPlaylist.length;

    const defaultIds = DEFAULT_PLAYLIST.map((s) => s.videoId);
    const completedDefaults = defaultIds.filter((id) => currentCompleted.includes(id));
    const allDefaultsPlayed = completedDefaults.length >= DEFAULT_PLAYLIST.length;

    if (isAutoEnd && (reachedEnd || allDefaultsPlayed)) {
      const seedSong = DEFAULT_PLAYLIST[Math.floor(Math.random() * DEFAULT_PLAYLIST.length)];
      let searchQuerySeed = 'OPM Trending Filipino Songs Playlist';
      if (seedSong.videoId === 'xFYQQPAOz7Y') {
        searchQuerySeed = 'Eminem hip hop rap music';
      } else if (seedSong.videoId === '_fgOrexuD_E') {
        searchQuerySeed = 'AKP Cebu Akrho anniversary song';
      } else if (seedSong.videoId === '5ymlO_GaWrU') {
        searchQuerySeed = 'We The Scepters Honestas Et Dignitas';
      } else if (seedSong.videoId === 'y0LQaRHIVoU') {
        searchQuerySeed = 'Bugoy na Koykoy hip hop rap music';
      }

      try {
        const apiKey =
          (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_YOUTUBE_API_KEY ||
          'AIzaSyAeIy261EmClOm7zElt2Y0j2wMazfDjC9M';
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchQuerySeed,
          )}&type=video&maxResults=10&key=${apiKey}`,
          { referrerPolicy: 'no-referrer' },
        );
        if (res.ok) {
          const data = await res.json();
          const candidateSongs: Song[] = (data.items || [])
            .map((item: any) => ({
              videoId: item.id?.videoId,
              songName: item.snippet?.title,
              authorName: item.snippet?.channelTitle,
              albumArt:
                item.snippet?.thumbnails?.high?.url ||
                `https://i.ytimg.com/vi/${item.id?.videoId}/hqdefault.jpg`,
            }))
            .filter((s: Song) => s.videoId && !currentPlaylist.some((p) => p.videoId === s.videoId));

          if (candidateSongs.length > 0) {
            const randomSong = candidateSongs[Math.floor(Math.random() * candidateSongs.length)];
            const updatedPlaylist = [...currentPlaylist, randomSong];
            setPlaylist(updatedPlaylist);
            setCurrentSongIndex(updatedPlaylist.length - 1);
            setPlaying(true);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch related song:', err);
      }
    }

    const nextIdx = (currentIndex + 1) % currentPlaylist.length;
    setCurrentSongIndex(nextIdx);
    setPlaying(true);
  };

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playlist, currentSongIndex, completedSongs]);

  const playPrev = () => {
    const currentPlaylist = playlistRef.current;
    if (currentPlaylist.length === 0) return;
    wantPlayingRef.current = true;
    setCurrentSongIndex((prev) => (prev - 1 + currentPlaylist.length) % currentPlaylist.length);
    setPlaying(true);
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setVolumeState(vol);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(vol);
    }
  };

  const addToPlaylist = (song: Song) => {
    if (playlist.some((s) => s.videoId === song.videoId)) {
      alert('Song already in playlist!');
      return;
    }
    setPlaylist((prev) => [...prev, song]);
  };

  const removeFromPlaylist = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.length <= 1) {
      alert('Cannot delete the last song!');
      return;
    }
    setPlaylist((prev) => prev.filter((_, idx) => idx !== index));
    if (currentSongIndex === index) {
      setCurrentSongIndex(0);
      setPlaying(false);
    } else if (currentSongIndex > index) {
      setCurrentSongIndex((prev) => prev - 1);
    }
  };

  const playSearchedSong = (song: Song) => {
    wantPlayingRef.current = true;
    const existingIndex = playlist.findIndex((s) => s.videoId === song.videoId);
    if (existingIndex !== -1) {
      setCurrentSongIndex(existingIndex);
      setPlaying(true);
    } else {
      const updatedPlaylist = [...playlist, song];
      setPlaylist(updatedPlaylist);
      setCurrentSongIndex(updatedPlaylist.length - 1);
      setPlaying(true);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        playlist,
        setPlaylist,
        currentSongIndex,
        setCurrentSongIndex,
        playing,
        setPlaying,
        currentTime,
        duration,
        volume,
        setVolume: handleVolumeChange,
        completedSongs,
        setCompletedSongs,
        togglePlay,
        playNext: () => playNext(false),
        playPrev,
        seekTo,
        addToPlaylist,
        removeFromPlaylist,
        playSearchedSong,
      }}
    >
      {children}
      {/* Hidden YouTube IFrame Container */}
      <div
        className="pointer-events-none fixed left-0 top-0 h-0 w-0 overflow-hidden opacity-0"
        dangerouslySetInnerHTML={{ __html: '<div id="sws-yt-player-container"></div>' }}
      />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
