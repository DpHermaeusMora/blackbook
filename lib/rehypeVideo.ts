import type { Plugin } from "unified";
import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";

export type RehypeVideoOptions = {
  /**
   * URL suffix verification.
   * @default /\/(.*)(.mp4|.mov)$/
   */
  test?: RegExp;
  /**
   * Support `<details>` tag to wrap <video>.
   * @default true
   */
  details?: boolean;
};

function reElement(node: Element, href: string, alt?: string) {
  node.properties = { alt: alt || "video", src: href };
  node.tagName = "video";
  node.children = [];
}

const rehypeVideo: Plugin<[RehypeVideoOptions?], Root> = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "p" && node.children.length === 1) {
        const child = node.children[0];

        const delimiter = /!\{(?<alt>[^\}]*)\}\((?<filename>.*?)(?=\"|\))\)/;

        if (child.type === "text" && delimiter.test(child.value)) {
          const resolved = delimiter.exec(child.value);

          if (resolved?.groups?.filename) {
            reElement(node, resolved.groups.filename, resolved?.groups?.alt);
          }
        }
      }
    });
  };
};

export default rehypeVideo;
