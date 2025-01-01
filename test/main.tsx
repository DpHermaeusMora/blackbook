import React from "react";
import { createRoot } from "react-dom/client";
import Blackbook from "../lib/Blackbook";
import "../lib/index.css";

const md = `!{}(https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8)
  


| hi | hi |
|----|----|
| hi | hi |
| hi | hi |





# hi
## hi
$|A|=\sqrt{a_{1}{}^2+a_{2}{}^2+\cdots+a_{n}{}^2}$
\`\`\`python
print("hi")
\`\`\`
`;

const videoOptions = {
  abloop: false,
  autoplay: false,
  controls: true,
  fill: false,
  metadata: {
    width: 640,
    height: 360,
  },
  onReady: (player) => {
    console.log(player);
  },
};

createRoot(document.getElementById("root")!).render(
  <>
    <Blackbook md={md} videoOptions={videoOptions} />
  </>
);
