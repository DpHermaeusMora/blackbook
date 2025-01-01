import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import abLoopPlugin from "videojs-abloop";
import type Player from "video.js/dist/types/player";

export interface Metadata {
  width: number;
  height: number;
}

export interface Props {
  containerClassName?: string;
  metadata?: ((src: string) => Promise<Metadata>) | Metadata;
  abloop: boolean;
  options: {
    autoplay: boolean;
    controls: boolean;
    responsive?: boolean;
    fill?: boolean;
    fluid?: boolean;
    sources: [
      {
        src: string;
        type?: string;
      }
    ];
  };
  onReady?: (player: Player) => void;
}

export default function VideoViewer({
  abloop,
  options,
  onReady,
  metadata: _metadata,
  containerClassName,
}: Props) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    if (_metadata) {
      options.sources.forEach((source) => {
        if (typeof _metadata === "object") {
          setMetadata(_metadata);
        } else {
          _metadata(source.src).then((res) => {
            setMetadata(res);
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (metadata && videoRef.current) {
      // Make sure Video.js player is only initialized once
      if (!playerRef.current) {
        // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
        const videoElement = document.createElement("video-js");

        videoElement.classList.add("vjs-big-play-centered");
        videoElement.classList.add("vjs-show-big-play-button-on-pause");
        videoRef.current.appendChild(videoElement);

        if (abloop) {
          abLoopPlugin(window, videojs);
        }

        const player = (playerRef.current = videojs(
          videoElement,
          {
            ...options,
            plugins: {
              ...(abloop ? { abLoopPlugin: {} } : {}),
            },
          },
          () => {
            videojs.log("player is ready");
            onReady && onReady(player);
          }
        ));
      } else {
        // You could update an existing player in the `else` block here
        // on prop change, for example:
      }
    }
  }, [options, videoRef, metadata]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
        videojs.log("player is deleted");
      }
    };
  }, [playerRef, metadata]);

  return options.fill ? (
    <div data-vjs-player className="fill w-full h-full">
      <div ref={videoRef} className="fill w-full h-full" />
    </div>
  ) : metadata ? (
    <div
      data-vjs-player
      ref={videoRef}
      className={
        metadata
          ? metadata.width >= metadata.height
            ? `vjs-box__horizontal`
            : `vjs-box__vertical`
          : `vjs-box__horizontal`
      }
    />
  ) : (
    <div className="vjs-box__horizontal bg-black flex justify-center items-center">
      <span className="prose text-white font-bold text-xl mr-2">
        encoding video...
      </span>
    </div>
  );
}
