import {
  VideoPlayer,
  VideoPlayerMuteButton,
  VideoPlayerOverlay,
  VideoPlayerSeek,
  VideoPlayerVideo,
} from "@/registry/ui/video-player"

export default function VideoPlayerMinimal() {
  return (
    <article className="w-full max-w-64">
      <VideoPlayer
        className="aspect-[4/5] w-full rounded-lg"
        aria-label="商品视频：春日花束"
      >
        <VideoPlayerVideo
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          preload="metadata"
          className="object-cover"
          muted
          loop
          playsInline
        />
        <VideoPlayerOverlay />
        <VideoPlayerMuteButton className="absolute right-2 top-2 z-20 rounded-full bg-black/40" />
        <VideoPlayerSeek
          showValue="never"
          className="absolute inset-x-3 bottom-1 z-20 w-auto transition-opacity duration-300 group-data-[idle]/video:opacity-0"
        />
      </VideoPlayer>
      <h3 className="mt-3 text-sm font-medium">春日花束 · 12 支装</h3>
      <p className="text-muted-foreground mt-1 text-xs">
        花艺师现场包扎，当日下单次日送达
      </p>
    </article>
  )
}
