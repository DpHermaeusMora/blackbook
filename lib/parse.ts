import rehypePrism from "@mapbox/rehype-prism";
import rehypeReact from "rehype-react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import * as prod from "react/jsx-runtime";
import remarkBreaks from "remark-breaks";
import VideoViewer from "./VideoViewer";
import rehypeVideo from "./rehypeVideo";
import rehypeTable from "./rehypeTable";
import type { Props as VideoViewerProps } from "./VideoViewer";

function rehypeOptions(videoOptions: Props["videoOptions"]) {
  return {
    // @ts-ignore
    Fragment: prod.Fragment,
    // @ts-ignore
    jsx: prod.jsx,
    // @ts-ignore
    jsxs: prod.jsxs,
    components: {
      video: (node: { src: string; alt: string }) =>
        VideoViewer({
          metadata: videoOptions.metadata,
          abloop: videoOptions.abloop,
          options: {
            controls: videoOptions.controls,
            fill: videoOptions.fill,
            autoplay: videoOptions.autoplay,
            sources: [
              {
                src: node.src,
              },
            ],
          },
        }),
    },
  };
}

export interface Props {
  md: string;
  videoOptions: Omit<VideoViewerProps["options"], "sources"> & {
    metadata: VideoViewerProps["metadata"];
    onReady: VideoViewerProps["onReady"];
    abloop: VideoViewerProps["abloop"];
  };
}

export default async function parse({ md, videoOptions }: Props) {
  const { result } = await unified()
    .use(remarkParse, { fragment: true })
    .use(remarkMath)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypeVideo)
    .use(rehypeTable)
    // @ts-ignore
    .use(rehypeReact, rehypeOptions(videoOptions))
    .use(rehypeSanitize, {
      ...defaultSchema,
      tagNames: [...(defaultSchema.tagNames || []), "video"],
      attributes: {
        ...defaultSchema.attributes,
        video: [...(defaultSchema.attributes?.video || ["src", "alt"])],
        code: [
          ...(defaultSchema.attributes?.code || []),
          // List of all allowed languages:
          ["class", "language-javascript", "language-math", "math-inline"],
        ],
        span: [
          ...(defaultSchema.attributes?.span || []),
          ["class", "katex", "katex-display"],
        ],
      },
    })
    .use(rehypeKatex)
    .use(rehypePrism, { ignoreMissing: true })
    .process(md);
  return result;
}
