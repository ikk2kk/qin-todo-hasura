/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from "@apollo/client";
import { GET_TODOS } from "queries/queries";
import { TodoItem } from "src/components/TodoItem";
import { TodoTitle } from "src/components/TodoTitle";
import type { GetTodosQuery } from "types/generated/graphql";

const TARGET_DATE = "tomorrow";

export const TomorrowTodo = () => {
  const { data, error } = useQuery<GetTodosQuery>(GET_TODOS, {
    fetchPolicy: "cache-first",
    variables: { target_date: TARGET_DATE },
  });

  if (error) {
    return (
      <div className="">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 bg-orange-100">
      <TodoTitle title="明日する" className="mb-6 text-orange-400 " />

      <div className="space-y-3">
        {data?.todos.map((todoItem) => {
          return (
            <TodoItem key={todoItem.id} todo={todoItem} targetDate={TARGET_DATE} name={todoItem.id} variant="orange" />
          );
        })}
        <TodoItem targetDate={TARGET_DATE} name="tomorrow_new" />
      </div>
    </div>
  );
};
