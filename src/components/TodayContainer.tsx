import { useReactiveVar } from "@apollo/client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { VFC } from "react";
import { IdTodoDicVar } from "src/cache";
import { SortableItem } from "src/components/SortableItem";
import { TodoItem } from "src/components/TodoItem";
import { TodoTitle } from "src/components/TodoTitle";
// import type { Todos } from "types/generated/graphql";

// type Items = {
//   today: string[];
//   tomorrow: string[];
//   someday: string[];
// };
// type TodoListObject = {
//   today: Todos[];
//   tomorrow: Todos[];
//   someday: Todos[];
// };
type Props = {
  id: string;
  items: string[];
  // setItems: Dispatch<SetStateAction<Items>>;
  // setTodoListObj: Dispatch<SetStateAction<TodoListObject>>;
};
const TARGET_DATE: "today" | "tomorrow" | "someday" = "today";
export const TodayContainer: VFC<Props> = (props) => {
  // const { data, error } = useQuery<GetTodosQuery>(GET_TODOS, {
  //   fetchPolicy: "cache-first",
  //   // eslint-disable-next-line @typescript-eslint/naming-convention
  //   variables: { target_date: props.id },
  // });
  const idTodoDic = useReactiveVar(IdTodoDicVar);
  const { setNodeRef } = useDroppable({ id: props.id });

  return (
    <div className="flex flex-col flex-1 p-4  bg-red-100">
      <TodoTitle title="今日する" className="mb-6 text-red-400 " />
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
                      variant="red"
                      todoLength={props.items ? props.items.length : 0}
                    />
                  </SortableItem>
                );
              })
            : null}
        </div>
      </SortableContext>

      <div className="mt-3">
        <TodoItem targetDate={TARGET_DATE} name="today_new" todoLength={props.items ? props.items.length : 0} />
      </div>
    </div>
  );
};
