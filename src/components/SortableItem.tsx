import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ChangeEvent, ReactNode, VFC } from "react";
import { useState } from "react";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

export const Item: VFC<Props> = (props) => {
  const [text, setText] = useState(props.title);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return <input className="w-full" type="text" value={text} onChange={handleChange} />;
};

export const SortableItem: VFC<Props> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
};
