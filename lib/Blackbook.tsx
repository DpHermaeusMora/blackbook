import { createElement, Fragment, useEffect, useState } from "react";
import type { Props as ParseProps } from "./parse";
import parse from "./parse";

interface Props extends ParseProps {
  className?: string;
}

export default function Viewer(props: Props) {
  const [Content, setContent] = useState(createElement(Fragment));

  useEffect(
    function () {
      (async function () {
        const result = await parse({
          md: props.md,
          videoOptions: props.videoOptions,
        });

        setContent(result);
      })();
    },
    [props.md, props.videoOptions]
  );

  return (
    <section
      className="break-all flex flex-col relative
      prose 
      prose-img:ml-auto
      prose-img:mr-auto
      prose-img:mt-0
      prose-img:mb-0
      prose-img:pt-8
      prose-img:pb-8
      prose-pre:!bg-black
      prose-blockquote:border-l
      prose-code:before:hidden  
      prose-p:after:hidden
      prose-p:before:hidden
      prose-blockquote:not-italic
      prose-code:after:hidden
      prose-code:tag
      prose-a:no-underline
      prose-a:font-bold
      prose-pre:inline-block
      prose-pre:w-full
      prose-pre:!mt-5
      prose-pre:!mb-5
      child-last:pb-8"
    >
      {Content}
    </section>
  );
}
