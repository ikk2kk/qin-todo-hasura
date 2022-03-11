import { useQuery } from "@apollo/client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GET_TODOS } from "queries/queries";
import type { Dispatch, SetStateAction, VFC } from "react";
import { useEffect } from "react";
import { SortableItem } from "src/components/SortableItem";
import type { GetTodosQuery } from "types/generated/graphql";

type Items = {
  today: string[];
  tomorrow: string[];
  someday: string[];
};

type Props = {
  id: string;
  items: string[];
  setItems: Dispatch<SetStateAction<Items>>;
};

export const TodayContainer: VFC<Props> = (props) => {
  const { data, error } = useQuery<GetTodosQuery>(GET_TODOS, {
    fetchPolicy: "cache-first",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    variables: { target_date: props.id },
  });

  const { setNodeRef } = useDroppable({ id: props.id });

  useEffect(() => {
    // const ids = data?.todos.map((todo) => {
    //   return todo.id;
    // });
    // props.setItems((prev) => {
    //   return { today: ids as string[], tomorrow: prev.tomorrow, someday: prev.someday };
    // });
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
    <div className="flex flex-col flex-1 p-4 space-y-3 bg-gray-100">
      <SortableContext id={props.id} items={props.items} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="space-y-3">
          {props.items.map((id) => {
            return <SortableItem key={id} id={id} />;
          })}
        </div>
      </SortableContext>
      <div>Add NewTask</div>
    </div>
  );
};
