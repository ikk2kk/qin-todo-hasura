import { useQuery } from "@apollo/client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GET_TODOS } from "queries/queries";
import type { Dispatch, SetStateAction, VFC } from "react";
import { useEffect } from "react";
import { SortableItem } from "src/components/SortableItem";
import { TodoItem } from "src/components/TodoItem";
import { TodoTitle } from "src/components/TodoTitle";
import type { GetTodosQuery, Todos } from "types/generated/graphql";

type Items = {
  today: string[];
  tomorrow: string[];
  someday: string[];
};
type TodoListObject = {
  today: Todos[];
  tomorrow: Todos[];
  someday: Todos[];
};
type Props = {
  id: string;
  items: string[];
  setItems: Dispatch<SetStateAction<Items>>;
  setTodoListObj: Dispatch<SetStateAction<TodoListObject>>;
};
const TARGET_DATE: "today" | "tomorrow" | "someday" = "today";
export const TodayContainer: VFC<Props> = (props) => {
  const { data, error } = useQuery<GetTodosQuery>(GET_TODOS, {
    fetchPolicy: "cache-first",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    variables: { target_date: props.id },
  });

  const { setNodeRef } = useDroppable({ id: props.id });

  useEffect(() => {
    props.setTodoListObj((prev) => {
      if (data) {
        return { ...prev, today: data.todos };
      } else {
        return { ...prev };
      }
    });

    props.setItems((prev) => {
      if (data) {
        const ids = data.todos.map((todo) => {
          return todo.id;
        });
        return { today: ids as string[], tomorrow: prev.tomorrow, someday: prev.someday };
      } else {
        return { today: ["a", "b", "c"], tomorrow: prev.tomorrow, someday: prev.someday };
      }
    });
  }, [data]);

  if (error) {
    return (
      <div className="">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-4  bg-red-100">
      <TodoTitle title="今日する" className="mb-6 text-red-400 " />
      <SortableContext id={props.id} items={props.items} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="space-y-3">
          {props.items.map((id) => {
            const todoItem = data?.todos.filter((d: Todos) => {
              return d.id === id;
            });

            if (todoItem?.length !== 0 && todoItem) {
              return (
                <SortableItem key={id} id={id} title={todoItem[0].title}>
                  <TodoItem
                    key={todoItem[0].id}
                    todo={todoItem[0]}
                    targetDate={TARGET_DATE}
                    name={todoItem[0].id}
                    variant="red"
                    todoLength={data ? data.todos.length : 0}
                  />
                </SortableItem>
              );
            } else {
              return null;
            }

            // return <SortableItem key={id} id={id} />;
          })}
          {/* {data
            ? data.todos.map((d) => {
                return <SortableItem key={d.id} id={d.id} />;
              })
            : null} */}
        </div>
      </SortableContext>

      <div className="mt-3">
        <TodoItem targetDate={TARGET_DATE} name="today_new" todoLength={data ? data.todos.length : 0} />
      </div>
    </div>
  );
};
