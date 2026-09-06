import {
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
} from "@/registry/ui/video-player"

export default function VideoPlayerDemo() {
  return (
    <VideoPlayer className="aspect-video w-full max-w-3xl">
      <VideoPlayerVideo
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        preload="metadata"
        playsInline
      />

      <VideoPlayerControls>
        <VideoPlayerSeek />

        <VideoPlayerControlBar>
          <VideoPlayerControlGroup>
            <VideoPlayerPlayButton />
            <VideoPlayerMuteButton />
            <VideoPlayerVolume className="hidden sm:flex" />
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
