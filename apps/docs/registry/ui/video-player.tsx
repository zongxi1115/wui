"use client"

import * as React from "react"
import {
  ExpandIcon,
  PauseIcon,
  PlayIcon,
  ShrinkIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Slider } from "@/registry/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"
import { cn } from "@/registry/lib/utils"

type VideoPlayerContextValue = {
  videoRef: React.RefObject<HTMLVideoElement | null>
  rootRef: React.RefObject<HTMLDivElement | null>
  currentTime: number
  duration: number
  volume: number
  paused: boolean
  muted: boolean
  fullscreen: boolean
  togglePlayback: () => void
  toggleMuted: () => void
  toggleFullscreen: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  syncMedia: (video: HTMLVideoElement) => void
}

const VideoPlayerContext = React.createContext<VideoPlayerContextValue | null>(
  null
)

function useVideoPlayer() {
  const context = React.useContext(VideoPlayerContext)

  if (!context) {
    throw new Error("Video player components must be used within VideoPlayer")
  }

  return context
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00"

  const hours = Math.floor(value / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  const seconds = Math.floor(value % 60)

  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    : `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = value
    }
  }
}

export interface VideoPlayerProps extends React.ComponentProps<"div"> {}

/** Provides shared playback state and keyboard controls to the player parts. */
function VideoPlayer({
  ref,
  className,
  children,
  onKeyDown,
  ...props
}: VideoPlayerProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [volume, setVolumeState] = React.useState(1)
  const [paused, setPaused] = React.useState(true)
  const [muted, setMuted] = React.useState(false)
  const [fullscreen, setFullscreen] = React.useState(false)

  const togglePlayback = React.useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }, [])

  const toggleMuted = React.useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }, [])

  const seek = React.useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.min(Math.max(time, 0), video.duration || 0)
    setCurrentTime(video.currentTime)
  }, [])

  const setVolume = React.useCallback((nextVolume: number) => {
    const video = videoRef.current
    if (!video) return
    const normalizedVolume = Math.min(Math.max(nextVolume, 0), 1)
    video.volume = normalizedVolume
    video.muted = normalizedVolume === 0
    setVolumeState(normalizedVolume)
    setMuted(video.muted)
  }, [])

  const toggleFullscreen = React.useCallback(() => {
    const root = rootRef.current
    if (!root) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void root.requestFullscreen()
  }, [])

  const syncMedia = React.useCallback((video: HTMLVideoElement) => {
    setCurrentTime(video.currentTime)
    setDuration(Number.isFinite(video.duration) ? video.duration : 0)
    setVolumeState(video.volume)
    setPaused(video.paused)
    setMuted(video.muted)
  }, [])

  React.useEffect(() => {
    function handleFullscreenChange() {
      setFullscreen(document.fullscreenElement === rootRef.current)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const target = event.target as HTMLElement
    if (target.matches("input, button, select, textarea, [contenteditable=true]")) {
      return
    }

    const video = videoRef.current
    if (!video) return

    switch (event.key.toLowerCase()) {
      case " ":
      case "k":
        event.preventDefault()
        togglePlayback()
        break
      case "m":
        toggleMuted()
        break
      case "f":
        toggleFullscreen()
        break
      case "arrowleft":
        event.preventDefault()
        seek(video.currentTime - 5)
        break
      case "arrowright":
        event.preventDefault()
        seek(video.currentTime + 5)
        break
    }
  }

  const context = React.useMemo<VideoPlayerContextValue>(
    () => ({
      videoRef,
      rootRef,
      currentTime,
      duration,
      volume,
      paused,
      muted,
      fullscreen,
      togglePlayback,
      toggleMuted,
      toggleFullscreen,
      seek,
      setVolume,
      syncMedia,
    }),
    [
      currentTime,
      duration,
      fullscreen,
      muted,
      paused,
      seek,
      setVolume,
      syncMedia,
      toggleFullscreen,
      toggleMuted,
      togglePlayback,
      volume,
    ]
  )

  return (
    <VideoPlayerContext.Provider value={context}>
      <TooltipProvider>
        <div
          ref={composeRefs(rootRef, ref)}
          data-slot="video-player"
          data-paused={paused ? "" : undefined}
          data-fullscreen={fullscreen ? "" : undefined}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={cn(
            "group/video relative isolate overflow-hidden bg-black text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </VideoPlayerContext.Provider>
  )
}

export interface VideoPlayerVideoProps extends React.ComponentProps<"video"> {}

/** The native video element connected to the nearest VideoPlayer. */
function VideoPlayerVideo({
  ref,
  className,
  onClick,
  onDurationChange,
  onEnded,
  onLoadedMetadata,
  onPause,
  onPlay,
  onTimeUpdate,
  onVolumeChange,
  ...props
}: VideoPlayerVideoProps) {
  const context = useVideoPlayer()

  return (
    <video
      ref={composeRefs(context.videoRef, ref)}
      data-slot="video-player-video"
      className={cn("block size-full object-contain", className)}
      onClick={(event) => {
        context.togglePlayback()
        onClick?.(event)
      }}
      onDurationChange={(event) => {
        context.syncMedia(event.currentTarget)
        onDurationChange?.(event)
      }}
      onEnded={(event) => {
        context.syncMedia(event.currentTarget)
        onEnded?.(event)
      }}
      onLoadedMetadata={(event) => {
        context.syncMedia(event.currentTarget)
        onLoadedMetadata?.(event)
      }}
      onPause={(event) => {
        context.syncMedia(event.currentTarget)
        onPause?.(event)
      }}
      onPlay={(event) => {
        context.syncMedia(event.currentTarget)
        onPlay?.(event)
      }}
      onTimeUpdate={(event) => {
        context.syncMedia(event.currentTarget)
        onTimeUpdate?.(event)
      }}
      onVolumeChange={(event) => {
        context.syncMedia(event.currentTarget)
        onVolumeChange?.(event)
      }}
      {...props}
    />
  )
}

function VideoPlayerControls({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="video-player-controls"
      className={cn(
        "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-2 pt-10",
        className
      )}
      {...props}
    />
  )
}

function VideoPlayerControlBar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="video-player-control-bar"
      className={cn("flex min-h-9 items-center gap-1", className)}
      {...props}
    />
  )
}

function VideoPlayerControlGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="video-player-control-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function VideoPlayerTooltipButton({
  label,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "size-8 text-white hover:bg-white/15 hover:text-white",
            className
          )}
          aria-label={label}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" size="sm">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function VideoPlayerPlayButton(
  {
    onClick,
    ...props
  }: Omit<React.ComponentProps<typeof VideoPlayerTooltipButton>, "label">
) {
  const { paused, togglePlayback } = useVideoPlayer()
  const label = paused ? "Play" : "Pause"

  return (
    <VideoPlayerTooltipButton
      label={label}
      onClick={(event) => {
        togglePlayback()
        onClick?.(event)
      }}
      {...props}
    >
      {paused ? <PlayIcon className="fill-current" /> : <PauseIcon />}
    </VideoPlayerTooltipButton>
  )
}

function VideoPlayerMuteButton(
  {
    onClick,
    ...props
  }: Omit<React.ComponentProps<typeof VideoPlayerTooltipButton>, "label">
) {
  const { muted, volume, toggleMuted } = useVideoPlayer()
  const label = muted ? "Unmute" : "Mute"
  const Icon =
    muted || volume === 0
      ? VolumeXIcon
      : volume < 0.5
        ? Volume1Icon
        : Volume2Icon

  return (
    <VideoPlayerTooltipButton
      label={label}
      onClick={(event) => {
        toggleMuted()
        onClick?.(event)
      }}
      {...props}
    >
      <Icon />
    </VideoPlayerTooltipButton>
  )
}

function VideoPlayerFullscreenButton(
  {
    onClick,
    ...props
  }: Omit<React.ComponentProps<typeof VideoPlayerTooltipButton>, "label">
) {
  const { fullscreen, toggleFullscreen } = useVideoPlayer()
  const label = fullscreen ? "Exit fullscreen" : "Fullscreen"

  return (
    <VideoPlayerTooltipButton
      label={label}
      onClick={(event) => {
        toggleFullscreen()
        onClick?.(event)
      }}
      {...props}
    >
      {fullscreen ? <ShrinkIcon /> : <ExpandIcon />}
    </VideoPlayerTooltipButton>
  )
}

function VideoPlayerSeek({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Slider>, "value" | "max" | "onValueChange">) {
  const { currentTime, duration, seek } = useVideoPlayer()

  return (
    <Slider
      data-slot="video-player-seek"
      aria-label="Seek video"
      min={0}
      max={duration || 1}
      step={0.1}
      value={[currentTime]}
      onValueChange={([value]) => seek(value)}
      formatValue={formatTime}
      className={cn(
        "py-2 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-track]]:bg-white/30",
        className
      )}
      {...props}
    />
  )
}

function VideoPlayerVolume({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Slider>, "value" | "max" | "onValueChange">) {
  const { muted, volume, setVolume } = useVideoPlayer()

  return (
    <Slider
      data-slot="video-player-volume"
      aria-label="Volume"
      min={0}
      max={1}
      step={0.01}
      value={[muted ? 0 : volume]}
      onValueChange={([value]) => setVolume(value)}
      showValue="never"
      className={cn(
        "w-20 py-2 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-track]]:bg-white/30",
        className
      )}
      {...props}
    />
  )
}

function VideoPlayerTime({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { currentTime, duration } = useVideoPlayer()

  return (
    <span
      data-slot="video-player-time"
      className={cn("px-1 text-xs tabular-nums text-white/80", className)}
      {...props}
    >
      <span className="text-white">{formatTime(currentTime)}</span>
      <span aria-hidden="true"> / </span>
      <span className="sr-only">of</span>
      {formatTime(duration)}
    </span>
  )
}

export {
  VideoPlayer,
  VideoPlayerControlBar,
  VideoPlayerControlGroup,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeek,
  VideoPlayerTime,
  VideoPlayerVideo,
  VideoPlayerVolume,
  formatTime,
  useVideoPlayer,
}
