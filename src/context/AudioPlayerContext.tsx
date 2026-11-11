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
}

export const DEFAULT_PLAYLIST: Song[] = [
  {
    videoId: 'iNsO2CbCV0Y',
    songName: 'OPM Trending Playlist 2026 — Must Listen Filipino Songs Mix',
    authorName: 'OPM Calm',
    albumArt: 'https://i.ytimg.com/vi/iNsO2CbCV0Y/hqdefault.jpg',
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

const PLAYLIST_STORAGE_KEY = 'zeticuz_portfolio_music_playlist_v2';
const STATE_STORAGE_KEY = 'zeticuz_portfolio_music_state_v2';

interface SavedPlaybackState {
  videoId: string;
  currentSongIndex: number;
  currentTime: number;
  volume: number;
}

function loadSavedPlaylist(): Song[] {
  if (typeof window === 'undefined') return DEFAULT_PLAYLIST;
  try {
    const saved = localStorage.getItem(PLAYLIST_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.videoId) {
        return parsed.map((item: any) => ({
          videoId: String(item.videoId),
          songName: String(item.songName || 'Unknown Track'),
          authorName: String(item.authorName || 'YouTube'),
          albumArt:
            item.albumArt || `https://i.ytimg.com/vi/${String(item.videoId)}/hqdefault.jpg`,
        }));
      }
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_PLAYLIST;
}

function loadSavedState(playlist: Song[]): SavedPlaybackState {
  if (typeof window === 'undefined') {
    return {
      videoId: playlist[0]?.videoId || 'iNsO2CbCV0Y',
      currentSongIndex: 0,
      currentTime: 0,
      volume: 80,
    };
  }
  try {
    const raw = localStorage.getItem(STATE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SavedPlaybackState>;
      let idx =
        typeof parsed.currentSongIndex === 'number' &&
        parsed.currentSongIndex >= 0 &&
        parsed.currentSongIndex < playlist.length
          ? parsed.currentSongIndex
          : 0;

      if (parsed.videoId) {
        const foundIdx = playlist.findIndex((s) => s.videoId === parsed.videoId);
        if (foundIdx !== -1) {
          idx = foundIdx;
        }
      }

      const savedTime =
        typeof parsed.currentTime === 'number' &&
        Number.isFinite(parsed.currentTime) &&
        parsed.currentTime >= 0
          ? parsed.currentTime
          : 0;

      const savedVol =
        typeof parsed.volume === 'number' && parsed.volume >= 0 && parsed.volume <= 100
          ? parsed.volume
          : 80;

      return {
        videoId: playlist[idx]?.videoId || playlist[0]?.videoId || 'iNsO2CbCV0Y',
        currentSongIndex: idx,
        currentTime: savedTime,
        volume: savedVol,
      };
    }
  } catch {
    /* ignore */
  }

  // Fresh browser visit: always start at Song #1 (index 0) and 0:00 (0 seconds)
  return {
    videoId: playlist[0]?.videoId || 'iNsO2CbCV0Y',
    currentSongIndex: 0,
    currentTime: 0,
    volume: 80,
  };
}

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
  moveSongInPlaylist: (fromIndex: number, toIndex: number) => void;
  playSearchedSong: (song: Song) => void;
  selectSongAtIndex: (index: number) => void;
  resetPlaylistToDefault: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const initialPlaylist = useRef<Song[]>(loadSavedPlaylist());
  const initialState = useRef<SavedPlaybackState>(loadSavedState(initialPlaylist.current));

  const [playlist, setPlaylist] = useState<Song[]>(initialPlaylist.current);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(
    initialState.current.currentSongIndex,
  );
  const [playing, setPlaying] = useState<boolean>(true);
  const [completedSongs, setCompletedSongs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(initialState.current.currentTime);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(initialState.current.volume);

  const playlistRef = useRef(playlist);
  const currentSongIndexRef = useRef(currentSongIndex);
  const currentTimeRef = useRef(currentTime);
  const completedSongsRef = useRef(completedSongs);
  const volumeRef = useRef(volume);
  const wantPlayingRef = useRef<boolean>(true);

  // Resume offset is applied when restoring a browser session; cleared once YT playback actively advances past it
  const pendingResumeSecondsRef = useRef<number>(initialState.current.currentTime);
  const hasAppliedResumeSeekRef = useRef<boolean>(false);
  const loadedVideoIdRef = useRef<string | null>(null);
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
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    completedSongsRef.current = completedSongs;
  }, [completedSongs]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const currentSong = playlist[currentSongIndex] || playlist[0] || null;
  const activeVideoId = currentSong?.videoId || '';

  // Helper to persist current playback state to localStorage
  const savePlaybackState = (
    idx = currentSongIndexRef.current,
    time = currentTimeRef.current,
    vol = volumeRef.current,
    list = playlistRef.current,
  ) => {
    try {
      const song = list[idx] || list[0];
      const payload: SavedPlaybackState = {
        videoId: song?.videoId || 'iNsO2CbCV0Y',
        currentSongIndex: idx,
        currentTime: Math.max(0, Math.floor(time || 0)),
        volume: vol,
      };
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  };

  // Persist playlist changes immediately
  useEffect(() => {
    try {
      localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlist));
      savePlaybackState(currentSongIndex, currentTimeRef.current, volumeRef.current, playlist);
    } catch {
      /* ignore */
    }
  }, [playlist, currentSongIndex]);

  // Persist volume changes
  useEffect(() => {
    savePlaybackState(currentSongIndexRef.current, currentTimeRef.current, volume, playlistRef.current);
  }, [volume]);

  // Save exact timestamp when user closes tab, refreshes, or hides page
  useEffect(() => {
    const handleUnload = () => {
      let latestTime = currentTimeRef.current;
      try {
        const state =
          playerRef.current && typeof playerRef.current.getPlayerState === 'function'
            ? playerRef.current.getPlayerState()
            : -1;
        if (
          (state === 1 || state === 2) &&
          playerRef.current &&
          typeof playerRef.current.getCurrentTime === 'function'
        ) {
          const t = playerRef.current.getCurrentTime();
          if (typeof t === 'number' && !isNaN(t) && t > 0) {
            latestTime = t;
          }
        }
      } catch {
        /* ignore */
      }
      savePlaybackState(
        currentSongIndexRef.current,
        latestTime,
        volumeRef.current,
        playlistRef.current,
      );
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, []);

  // Load YouTube IFrame API & initialize player when activeVideoId changes
  useEffect(() => {
    if (typeof window === 'undefined' || !activeVideoId) return;

    // If the same video is already loaded (e.g. playlist was reordered without changing the active song), do not reload the iframe
    if (loadedVideoIdRef.current === activeVideoId && playerRef.current) {
      return;
    }

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
      if (!activeVideoId || !window.YT || !window.YT.Player) return;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          /* ignore */
        }
      }

      const startAt = Math.max(0, Math.floor(pendingResumeSecondsRef.current || 0));
      hasAppliedResumeSeekRef.current = startAt === 0;
      loadedVideoIdRef.current = activeVideoId;

      playerRef.current = new window.YT.Player('sws-yt-player-container', {
        height: '1',
        width: '1',
        videoId: activeVideoId,
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
            try {
              event.target.setVolume(volumeRef.current);
              if (startAt > 0) {
                setCurrentTime(startAt);
                currentTimeRef.current = startAt;
                event.target.seekTo?.(startAt, true);
              } else {
                setCurrentTime(0);
                currentTimeRef.current = 0;
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
              const finishedVideoId = activeVideoId;
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
              if (
                !hasAppliedResumeSeekRef.current &&
                pendingResumeSecondsRef.current > 0 &&
                playerRef.current?.seekTo
              ) {
                const targetSec = pendingResumeSecondsRef.current;
                hasAppliedResumeSeekRef.current = true;
                pendingResumeSecondsRef.current = 0;
                const nowSec = playerRef.current.getCurrentTime?.() || 0;
                if (Math.abs(nowSec - targetSec) > 2) {
                  playerRef.current.seekTo(targetSec, true);
                }
              } else {
                hasAppliedResumeSeekRef.current = true;
                pendingResumeSecondsRef.current = 0;
              }
              if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
                setDuration(playerRef.current.getDuration() || 0);
              }
            } else if (event.data === 2) {
              // PAUSED
              setPlaying(false);
              if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                const t = playerRef.current.getCurrentTime();
                if (typeof t === 'number' && !isNaN(t) && t >= 0) {
                  setCurrentTime(t);
                  currentTimeRef.current = t;
                  savePlaybackState(currentSongIndexRef.current, t, volumeRef.current, playlistRef.current);
                }
              }
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
  }, [activeVideoId]);

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
          if (pendingResumeSecondsRef.current > 0) {
            playerRef.current.seekTo?.(pendingResumeSecondsRef.current, true);
          }
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

  // Track progress when actively playing in YT (state === 1) & sync to localStorage
  useEffect(() => {
    if (playing) {
      progressIntervalRef.current = setInterval(() => {
        if (
          playerRef.current &&
          typeof playerRef.current.getPlayerState === 'function' &&
          typeof playerRef.current.getCurrentTime === 'function'
        ) {
          const playerState = playerRef.current.getPlayerState();
          const d = playerRef.current.getDuration?.() || 0;
          if (typeof d === 'number' && d > 0) setDuration(d);

          // Only overwrite currentTime when YouTube is actively playing (state === 1)
          if (playerState === 1) {
            const t = playerRef.current.getCurrentTime();
            if (typeof t === 'number' && !isNaN(t) && t >= 0) {
              setCurrentTime(t);
              currentTimeRef.current = t;
              savePlaybackState(
                currentSongIndexRef.current,
                t,
                volumeRef.current,
                playlistRef.current,
              );
            }
          }
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

  const selectSongAtIndex = (index: number) => {
    const currentPlaylist = playlistRef.current;
    if (index < 0 || index >= currentPlaylist.length) return;
    wantPlayingRef.current = true;
    pendingResumeSecondsRef.current = 0;
    hasAppliedResumeSeekRef.current = true;
    setCurrentTime(0);
    currentTimeRef.current = 0;

    if (index === currentSongIndexRef.current && playerRef.current?.seekTo) {
      playerRef.current.seekTo(0, true);
      playerRef.current.playVideo?.();
      setPlaying(true);
      savePlaybackState(index, 0, volumeRef.current, currentPlaylist);
      return;
    }

    loadedVideoIdRef.current = null;
    setCurrentSongIndex(index);
    setPlaying(true);
    savePlaybackState(index, 0, volumeRef.current, currentPlaylist);
  };

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
        if (pendingResumeSecondsRef.current > 0) {
          playerRef.current.seekTo?.(pendingResumeSecondsRef.current, true);
        }
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
    pendingResumeSecondsRef.current = 0;
    hasAppliedResumeSeekRef.current = true;
    setCurrentTime(0);
    currentTimeRef.current = 0;

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
            loadedVideoIdRef.current = null;
            setPlaylist(updatedPlaylist);
            setCurrentSongIndex(updatedPlaylist.length - 1);
            setPlaying(true);
            savePlaybackState(updatedPlaylist.length - 1, 0, volumeRef.current, updatedPlaylist);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch related song:', err);
      }
    }

    const nextIdx = (currentIndex + 1) % currentPlaylist.length;
    loadedVideoIdRef.current = null;
    setCurrentSongIndex(nextIdx);
    setPlaying(true);
    savePlaybackState(nextIdx, 0, volumeRef.current, currentPlaylist);
  };

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playlist, currentSongIndex, completedSongs]);

  const playPrev = () => {
    const currentPlaylist = playlistRef.current;
    if (currentPlaylist.length === 0) return;
    wantPlayingRef.current = true;
    pendingResumeSecondsRef.current = 0;
    hasAppliedResumeSeekRef.current = true;
    setCurrentTime(0);
    currentTimeRef.current = 0;
    const prevIdx = (currentSongIndexRef.current - 1 + currentPlaylist.length) % currentPlaylist.length;
    loadedVideoIdRef.current = null;
    setCurrentSongIndex(prevIdx);
    setPlaying(true);
    savePlaybackState(prevIdx, 0, volumeRef.current, currentPlaylist);
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    currentTimeRef.current = seconds;
    pendingResumeSecondsRef.current = seconds;
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
    }
    savePlaybackState(currentSongIndexRef.current, seconds, volumeRef.current, playlistRef.current);
  };

  const handleVolumeChange = (vol: number) => {
    setVolumeState(vol);
    volumeRef.current = vol;
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(vol);
    }
    savePlaybackState(currentSongIndexRef.current, currentTimeRef.current, vol, playlistRef.current);
  };

  const addToPlaylist = (song: Song) => {
    if (playlist.some((s) => s.videoId === song.videoId)) {
      return;
    }
    setPlaylist((prev) => [...prev, song]);
  };

  const removeFromPlaylist = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.length <= 1) {
      return;
    }
    const nextList = playlist.filter((_, idx) => idx !== index);
    setPlaylist(nextList);
    if (currentSongIndex === index) {
      pendingResumeSecondsRef.current = 0;
      hasAppliedResumeSeekRef.current = true;
      setCurrentTime(0);
      currentTimeRef.current = 0;
      loadedVideoIdRef.current = null;
      const nextIdx = index >= nextList.length ? 0 : index;
      setCurrentSongIndex(nextIdx);
      savePlaybackState(nextIdx, 0, volumeRef.current, nextList);
    } else if (currentSongIndex > index) {
      const adjustedIdx = currentSongIndex - 1;
      setCurrentSongIndex(adjustedIdx);
      savePlaybackState(adjustedIdx, currentTimeRef.current, volumeRef.current, nextList);
    }
  };

  const moveSongInPlaylist = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= playlist.length ||
      toIndex >= playlist.length
    ) {
      return;
    }

    const updated = [...playlist];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    let newCurrentIndex = currentSongIndex;
    if (currentSongIndex === fromIndex) {
      newCurrentIndex = toIndex;
    } else if (fromIndex < currentSongIndex && toIndex >= currentSongIndex) {
      newCurrentIndex = currentSongIndex - 1;
    } else if (fromIndex > currentSongIndex && toIndex <= currentSongIndex) {
      newCurrentIndex = currentSongIndex + 1;
    }

    setPlaylist(updated);
    setCurrentSongIndex(newCurrentIndex);
    savePlaybackState(newCurrentIndex, currentTimeRef.current, volumeRef.current, updated);
  };

  const playSearchedSong = (song: Song) => {
    wantPlayingRef.current = true;
    pendingResumeSecondsRef.current = 0;
    hasAppliedResumeSeekRef.current = true;
    setCurrentTime(0);
    currentTimeRef.current = 0;
    loadedVideoIdRef.current = null;

    const existingIndex = playlist.findIndex((s) => s.videoId === song.videoId);
    if (existingIndex !== -1) {
      setCurrentSongIndex(existingIndex);
      setPlaying(true);
      savePlaybackState(existingIndex, 0, volumeRef.current, playlist);
    } else {
      const updatedPlaylist = [...playlist, song];
      setPlaylist(updatedPlaylist);
      const newIdx = updatedPlaylist.length - 1;
      setCurrentSongIndex(newIdx);
      setPlaying(true);
      savePlaybackState(newIdx, 0, volumeRef.current, updatedPlaylist);
    }
  };

  const resetPlaylistToDefault = () => {
    wantPlayingRef.current = true;
    pendingResumeSecondsRef.current = 0;
    hasAppliedResumeSeekRef.current = true;
    setCurrentTime(0);
    currentTimeRef.current = 0;
    loadedVideoIdRef.current = null;
    setPlaylist(DEFAULT_PLAYLIST);
    setCurrentSongIndex(0);
    setPlaying(true);
    setCompletedSongs([]);
    if (playerRef.current?.seekTo && currentSong?.videoId === DEFAULT_PLAYLIST[0].videoId) {
      loadedVideoIdRef.current = DEFAULT_PLAYLIST[0].videoId;
      playerRef.current.seekTo(0, true);
      playerRef.current.playVideo?.();
    }
    savePlaybackState(0, 0, volumeRef.current, DEFAULT_PLAYLIST);
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
        moveSongInPlaylist,
        playSearchedSong,
        selectSongAtIndex,
        resetPlaylistToDefault,
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
