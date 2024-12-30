import type { Plugin } from "unified";
import type { Root, Element, ElementContent } from "hast";
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

// [
//     {
//         "type": "text",
//         "value": "| a   | b",
//         "position": {
//             "start": {
//                 "line": 3,
//                 "column": 1,
//                 "offset": 176
//             },
//             "end": {
//                 "line": 3,
//                 "column": 10,
//                 "offset": 185
//             }
//         }
//     },
//     {
//         "type": "element",
//         "tagName": "br",
//         "properties": {},
//         "children": [],
//         "position": {
//             "start": {
//                 "line": 3,
//                 "column": 10,
//                 "offset": 185
//             },
//             "end": {
//                 "line": 4,
//                 "column": 1,
//                 "offset": 189
//             }
//         }
//     },
//     {
//         "type": "text",
//         "value": "\n"
//     },
//     {
//         "type": "text",
//         "value": "| --- | --- |"
//     },
//     {
//         "type": "element",
//         "tagName": "br",
//         "properties": {},
//         "children": []
//     },
//     {
//         "type": "text",
//         "value": "\n"
//     },
//     {
//         "type": "text",
//         "value": "| 1   | 21  |"
//     }
// ]

function reElement(node: Element) {
  const all = node.children.filter(determineTableElement) as (ElementContent & {
    type: "text";
  })[];

  const [th, borderline, ...td] = all;

  if (!th || !borderline || !td) {
    return;
  }

  node.tagName = "table";

  node.children = [
    {
      type: "element",
      tagName: "thead",
      properties: {},
      children: [
        {
          type: "element",
          tagName: "tr",
          properties: {},
          children: th.value
            .split("|")
            .filter((d) => d.trim() !== "")
            .map((d) => ({
              type: "element",
              tagName: "th",
              properties: {},
              children: [{ type: "text", value: d }],
            })),
        },
      ],
    },
    {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: td.map((d) => ({
        type: "element",
        tagName: "tr",
        properties: {},
        children: d.value
          .split("|")
          .filter((d) => d.trim() !== "")
          .map((d) => ({
            type: "element",
            tagName: "td",
            properties: {},
            children: [{ type: "text", value: d }],
          })),
      })),
    },
  ];
}

function determineTableElement(node: ElementContent) {
  return (
    node?.type === "text" &&
    node.value.startsWith("|") &&
    node.value.endsWith("|")
  );
}

const rehypeTable: Plugin<[RehypeVideoOptions?], Root> = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "p" && determineTableElement(node.children[0])) {
        const raw = node.children.reduce((prev: any, cur: any) => {
          prev += cur.value || "";
          return prev;
        }, "");

        const delimiter = /^\|.*\|\n\|\s*[:-]+[\s\S]*\|.*\|$/;

        if (delimiter.test(raw)) {
          reElement(node);
        }
      }
    });
  };
};

export default rehypeTable;
