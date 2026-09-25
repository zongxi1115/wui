import {
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
} from "@/registry/ui/video-player"

export default function VideoPlayerDemo() {
  return (
    <VideoPlayer
      className="aspect-video w-full max-w-3xl"
      aria-label="视频播放器：花朵延时摄影"
    >
      <VideoPlayerVideo
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        preload="metadata"
        playsInline
      />

      <VideoPlayerOverlay />

      <VideoPlayerControls>
        <VideoPlayerSeek />

        <VideoPlayerControlBar>
          <VideoPlayerControlGroup>
            <VideoPlayerPlayButton />
            <VideoPlayerControlGroup className="group/volume gap-0">
              <VideoPlayerMuteButton />
              <VideoPlayerVolume className="hidden w-0 overflow-hidden px-0 opacity-0 transition-[width,opacity,padding] duration-200 ease-out group-focus-within/volume:w-20 group-focus-within/volume:px-1.5 group-focus-within/volume:opacity-100 group-hover/volume:w-20 group-hover/volume:px-1.5 group-hover/volume:opacity-100 sm:flex" />
            </VideoPlayerControlGroup>
            <VideoPlayerTime />
          </VideoPlayerControlGroup>

          <VideoPlayerControlGroup className="ml-auto">
            <VideoPlayerFullscreenButton />
          </VideoPlayerControlGroup>
        </VideoPlayerControlBar>
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
