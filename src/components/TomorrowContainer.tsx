import { useReactiveVar } from "@apollo/client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { VFC } from "react";
import { IdTodoDicVar } from "src/cache";
import { SortableItem } from "src/components/SortableItem";
import { TodoItem } from "src/components/TodoItem";
import { TodoTitle } from "src/components/TodoTitle";

type Props = {
  id: string;
  items: string[];
};
const TARGET_DATE: "today" | "tomorrow" | "someday" = "tomorrow";
export const TomorrowContainer: VFC<Props> = (props) => {
  const idTodoDic = useReactiveVar(IdTodoDicVar);
  const { setNodeRef } = useDroppable({ id: props.id });

  return (
    <div className="flex flex-col flex-1 p-4 ">
      <TodoTitle title="明日する" className="mb-6 text-orange-400 " />
      <SortableContext id={props.id} items={props.items} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="space-y-3">
          {props.items.length !== 0
            ? props.items.map((id) => {
                const todoItem = idTodoDic[id];
                return (
                  <SortableItem key={id} id={id} title={todoItem.title}>
                    <TodoItem
                      key={todoItem.id}
                      todo={todoItem}
                      targetDate={TARGET_DATE}
                      name={todoItem.id}
                      variant="orange"
                      todoLength={props.items ? props.items.length : 0}
                    />
                  </SortableItem>
                );
              })
            : null}
        </div>
      </SortableContext>

      <div className="mt-3">
        <TodoItem targetDate={TARGET_DATE} name="tomorrow_new" todoLength={props.items ? props.items.length : 0} />
      </div>
    </div>
  );
};
