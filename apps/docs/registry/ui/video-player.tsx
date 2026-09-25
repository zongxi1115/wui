"use client"

import * as React from "react"
import {
  ExpandIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  ShrinkIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/registry/ui/button"
import { Slider } from "@/registry/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip"
import { cn } from "@/registry/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const
/** Controls hide after this much pointer inactivity while playing. */
const IDLE_DELAY = 2500

type FeedbackKind =
  | "play"
  | "pause"
  | "forward"
  | "backward"
  | "volume"
  | "mute"

type Feedback = { id: number; kind: FeedbackKind; label?: string }

type VideoPlayerControlsContextValue = {
  videoRef: React.RefObject<HTMLVideoElement | null>
  rootRef: React.RefObject<HTMLDivElement | null>
  volume: number
  paused: boolean
  muted: boolean
  fullscreen: boolean
  /** Whether playback has started at least once. */
  started: boolean
  /** Whether the controls are hidden because the pointer has been idle. */
  idle: boolean
  /** Latest transient action shown by VideoPlayerOverlay. */
  feedback: Feedback | null
  togglePlayback: () => void
  toggleMuted: () => void
  toggleFullscreen: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  syncMedia: (video: HTMLVideoElement) => void
  showFeedback: (kind: FeedbackKind, label?: string) => void
}

type VideoPlayerTimeContextValue = {
  currentTime: number
  duration: number
}

type VideoPlayerContextValue = VideoPlayerControlsContextValue &
  VideoPlayerTimeContextValue

const VideoPlayerControlsContext =
  React.createContext<VideoPlayerControlsContextValue | null>(null)
const VideoPlayerTimeContext =
  React.createContext<VideoPlayerTimeContextValue | null>(null)

function usePlayerControls() {
  const context = React.useContext(VideoPlayerControlsContext)
  if (!context) {
    throw new Error("Video player components must be used within VideoPlayer")
  }
  return context
}

function usePlayerTime() {
  const context = React.useContext(VideoPlayerTimeContext)
  if (!context) {
    throw new Error("Video player components must be used within VideoPlayer")
  }
  return context
}

/** Reads the full player state, including the frequently updating playback time. */
function useVideoPlayer(): VideoPlayerContextValue {
  return { ...usePlayerControls(), ...usePlayerTime() }
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

/**
 * Provides shared playback state and keyboard controls to the player parts.
 * While playing, the controls fade out after 2.5s without pointer activity.
 */
function VideoPlayer({
  ref,
  className,
  children,
  onKeyDown,
  onPointerMove,
  onPointerLeave,
  ...props
}: VideoPlayerProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const idleTimer = React.useRef<number | undefined>(undefined)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [volume, setVolumeState] = React.useState(1)
  const [paused, setPaused] = React.useState(true)
  const [muted, setMuted] = React.useState(false)
  const [fullscreen, setFullscreen] = React.useState(false)
  const [started, setStarted] = React.useState(false)
  const [idle, setIdle] = React.useState(false)
  const [feedback, setFeedback] = React.useState<Feedback | null>(null)

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
    if (!video.paused) setStarted(true)
  }, [])

  const showFeedback = React.useCallback(
    (kind: FeedbackKind, label?: string) => {
      setFeedback((current) => ({ id: (current?.id ?? 0) + 1, kind, label }))
    },
    []
  )

  const wake = React.useCallback(() => {
    setIdle(false)
    window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => {
      const root = rootRef.current
      if (!root || videoRef.current?.paused) return
      // Keep the controls up while they are hovered or hold keyboard focus.
      const engaged = root.querySelector(
        "[data-slot=video-player-controls]:is(:hover, :focus-within)"
      )
      if (!engaged) setIdle(true)
    }, IDLE_DELAY)
  }, [])

  React.useEffect(() => {
    if (paused) {
      window.clearTimeout(idleTimer.current)
      setIdle(false)
    } else {
      wake()
    }
  }, [paused, wake])

  React.useEffect(() => () => window.clearTimeout(idleTimer.current), [])

  // timeupdate only fires ~4 times per second; sample every frame while
  // playing so the progress bar glides instead of stepping.
  React.useEffect(() => {
    if (paused) return
    let frame = 0
    const tick = () => {
      const video = videoRef.current
      if (video) setCurrentTime(video.currentTime)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [paused])

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
    wake()
    if (event.defaultPrevented) return

    const target = event.target as HTMLElement
    if (
      target.matches("input, button, select, textarea, [contenteditable=true]")
    ) {
      return
    }

    const video = videoRef.current
    if (!video) return

    switch (event.key.toLowerCase()) {
      case " ":
      case "k":
        event.preventDefault()
        if (started) showFeedback(video.paused ? "play" : "pause")
        togglePlayback()
        break
      case "m":
        showFeedback(video.muted ? "volume" : "mute")
        toggleMuted()
        break
      case "f":
        toggleFullscreen()
        break
      case "arrowleft":
        event.preventDefault()
        showFeedback("backward", "5 秒")
        seek(video.currentTime - 5)
        break
      case "arrowright":
        event.preventDefault()
        showFeedback("forward", "5 秒")
        seek(video.currentTime + 5)
        break
      case "arrowup":
      case "arrowdown": {
        event.preventDefault()
        const base = video.muted ? 0 : video.volume
        const next = Math.min(
          1,
          Math.max(0, base + (event.key === "ArrowUp" ? 0.1 : -0.1))
        )
        setVolume(next)
        showFeedback(
          next === 0 ? "mute" : "volume",
          `${Math.round(next * 100)}%`
        )
        break
      }
    }
  }

  const controls = React.useMemo<VideoPlayerControlsContextValue>(
    () => ({
      videoRef,
      rootRef,
      volume,
      paused,
      muted,
      fullscreen,
      started,
      idle,
      feedback,
      togglePlayback,
      toggleMuted,
      toggleFullscreen,
      seek,
      setVolume,
      syncMedia,
      showFeedback,
    }),
    [
      feedback,
      fullscreen,
      idle,
      muted,
      paused,
      seek,
      setVolume,
      showFeedback,
      started,
      syncMedia,
      toggleFullscreen,
      toggleMuted,
      togglePlayback,
      volume,
    ]
  )

  const time = React.useMemo(
    () => ({ currentTime, duration }),
    [currentTime, duration]
  )

  return (
    <VideoPlayerControlsContext.Provider value={controls}>
      <VideoPlayerTimeContext.Provider value={time}>
        <TooltipProvider>
          <div
            ref={composeRefs(rootRef, ref)}
            data-slot="video-player"
            data-paused={paused ? "" : undefined}
            data-idle={idle ? "" : undefined}
            data-fullscreen={fullscreen ? "" : undefined}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerMove={(event) => {
              onPointerMove?.(event)
              wake()
            }}
            onPointerLeave={(event) => {
              onPointerLeave?.(event)
              if (event.pointerType === "mouse" && !paused) {
                window.clearTimeout(idleTimer.current)
                setIdle(true)
              }
            }}
            className={cn(
              "group/video relative isolate overflow-hidden bg-black text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[idle]:cursor-none",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </VideoPlayerTimeContext.Provider>
    </VideoPlayerControlsContext.Provider>
  )
}

export interface VideoPlayerVideoProps extends React.ComponentProps<"video"> {}

/** The native video element connected to the nearest VideoPlayer. Clicking it toggles playback. */
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
  const context = usePlayerControls()

  return (
    <video
      ref={composeRefs(context.videoRef, ref)}
      data-slot="video-player-video"
      className={cn("block size-full object-contain", className)}
      onClick={(event) => {
        // Before the first play the overlay's start button already animates.
        if (context.started) {
          context.showFeedback(event.currentTarget.paused ? "play" : "pause")
        }
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

export interface VideoPlayerOverlayProps extends React.ComponentProps<"div"> {
  /** Show a large play button until playback starts for the first time. @default true */
  showPlayButton?: boolean
}

const FEEDBACK_ICONS: Record<FeedbackKind, React.ComponentType> = {
  play: PlayIcon,
  pause: PauseIcon,
  forward: FastForwardIcon,
  backward: RewindIcon,
  volume: Volume2Icon,
  mute: VolumeXIcon,
}

/**
 * Centered layer that shows a large play button before playback starts and a
 * short pulse for actions triggered by clicking the video or keyboard shortcuts.
 */
function VideoPlayerOverlay({
  className,
  showPlayButton = true,
  ...props
}: VideoPlayerOverlayProps) {
  const { started, paused, feedback, togglePlayback } = usePlayerControls()
  const reduceMotion = useReducedMotion()
  const Icon = feedback ? FEEDBACK_ICONS[feedback.kind] : null
  const showStart = showPlayButton && !started && paused

  return (
    <div
      data-slot="video-player-overlay"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
        className
      )}
      {...props}
    >
      <AnimatePresence>
        {showStart ? (
          <motion.button
            key="start"
            type="button"
            aria-label="播放"
            className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-white text-neutral-950 outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:ring-white/40 [&_svg]:size-6"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.3 }
            }
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: EASE }}
            onClick={togglePlayback}
          >
            <PlayIcon className="ml-0.5 fill-current" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      {!showStart && feedback && Icon && !reduceMotion ? (
        <motion.div
          key={feedback.id}
          aria-hidden="true"
          className="absolute flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 1.12] }}
          transition={{ duration: 0.6, times: [0, 0.25, 1], ease: EASE }}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-black/55 [&_svg]:size-6">
            <Icon />
          </span>
          {feedback.label ? (
            <span className="rounded-sm bg-black/55 px-2 py-0.5 text-xs tabular-nums">
              {feedback.label}
            </span>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  )
}

/** Bottom control area. Fades out with the pointer idle while playing. */
function VideoPlayerControls({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="video-player-controls"
      className={cn(
        "absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-2 pt-10 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[idle]/video:pointer-events-none group-data-[idle]/video:translate-y-2 group-data-[idle]/video:opacity-0 motion-reduce:transition-none",
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

/** Cross-fades between icons with a short scale and blur swap. */
function IconSwap({ id, children }: { id: string; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={id}
        className="inline-flex"
        initial={
          reduceMotion ? false : { opacity: 0, scale: 0.5, filter: "blur(2px)" }
        }
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={
          reduceMotion
            ? { opacity: 0, transition: { duration: 0 } }
            : { opacity: 0, scale: 0.5, filter: "blur(2px)" }
        }
        transition={{ duration: 0.18, ease: EASE }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
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
            "size-8 text-white hover:bg-white/15 hover:text-white dark:hover:bg-white/15",
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

function VideoPlayerPlayButton({
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof VideoPlayerTooltipButton>, "label">) {
  const { paused, togglePlayback } = usePlayerControls()

  return (
    <VideoPlayerTooltipButton
      label={paused ? "播放" : "暂停"}
      onClick={(event) => {
        togglePlayback()
        onClick?.(event)
      }}
      {...props}
    >
      <IconSwap id={paused ? "play" : "pause"}>
        {paused ? (
          <PlayIcon className="fill-current" />
        ) : (
          <PauseIcon className="fill-current" />
        )}
      </IconSwap>
    </VideoPlayerTooltipButton>
  )
}

function VideoPlayerMuteButton({
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof VideoPlayerTooltipButton>, "label">) {
  const { muted, volume, toggleMuted } = usePlayerControls()
  const level = muted || volume === 0 ? "muted" : volume < 0.5 ? "low" : "high"
  const Icon =
    level === "muted" ? VolumeXIcon : level === "low" ? Volume1Icon : Volume2Icon

  return (
    <VideoPlayerTooltipButton
      label={muted ? "取消静音" : "静音"}
      onClick={(event) => {
        toggleMuted()
        onClick?.(event)
      }}
      {...props}
    >
      <IconSwap id={level}>
        <Icon />
      </IconSwap>
    </VideoPlayerTooltipButton>
  )
}

function VideoPlayerFullscreenButton({
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof VideoPlayerTooltipButton>, "label">) {
  const { fullscreen, toggleFullscreen } = usePlayerControls()

  return (
    <VideoPlayerTooltipButton
      label={fullscreen ? "退出全屏" : "全屏"}
      onClick={(event) => {
        toggleFullscreen()
        onClick?.(event)
      }}
      {...props}
    >
      <IconSwap id={fullscreen ? "exit" : "enter"}>
        {fullscreen ? <ShrinkIcon /> : <ExpandIcon />}
      </IconSwap>
    </VideoPlayerTooltipButton>
  )
}

// The thumb is forced to white: the base slider uses `bg-background`, which
// turns into a near-black dot on the video in dark mode.
const MEDIA_SLIDER_CLASS =
  "py-2 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:bg-white/30"

function VideoPlayerSeek({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof Slider>,
  "value" | "max" | "onValueChange"
>) {
  const { seek } = usePlayerControls()
  const { currentTime, duration } = usePlayerTime()

  return (
    <Slider
      data-slot="video-player-seek"
      aria-label="播放进度"
      variant="expand"
      min={0}
      max={duration || 1}
      step={0.1}
      value={[currentTime]}
      onValueChange={([value]) => seek(value)}
      formatValue={formatTime}
      className={cn(MEDIA_SLIDER_CLASS, className)}
      {...props}
    />
  )
}

function VideoPlayerVolume({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof Slider>,
  "value" | "max" | "onValueChange"
>) {
  const { muted, volume, setVolume } = usePlayerControls()

  return (
    <Slider
      data-slot="video-player-volume"
      aria-label="音量"
      variant="expand"
      min={0}
      max={1}
      step={0.01}
      value={[muted ? 0 : volume]}
      onValueChange={([value]) => setVolume(value)}
      showValue="never"
      className={cn("w-20", MEDIA_SLIDER_CLASS, className)}
      {...props}
    />
  )
}

function VideoPlayerTime({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { currentTime, duration } = usePlayerTime()

  return (
    <span
      data-slot="video-player-time"
      className={cn("px-1 text-xs tabular-nums text-white/80", className)}
      {...props}
    >
      <span className="text-white">{formatTime(currentTime)}</span>
      <span aria-hidden="true"> / </span>
      <span className="sr-only">共</span>
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
  VideoPlayerOverlay,
  VideoPlayerPlayButton,
  VideoPlayerSeek,
  VideoPlayerTime,
  VideoPlayerVideo,
  VideoPlayerVolume,
  formatTime,
  useVideoPlayer,
}
