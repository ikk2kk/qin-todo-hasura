import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode, VFC } from "react";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

export const SortableItem: VFC<Props> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });
  if (transform) {
    transform.scaleX = 1.0;
    transform.scaleY = 1.0;
  }

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
