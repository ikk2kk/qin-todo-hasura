import clsx from "clsx";
import type { VFC } from "react";

type Props = {
  title: string;
  className?: string;
};

export const TodoTitle: VFC<Props> = (props) => {
  return (
    <div className="">
      <div>
        <h1 className={clsx("font-mono text-[22px] leading-[26px]", props.className)}>{props.title}</h1>
      </div>
    </div>
  );
};
