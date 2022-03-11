/* eslint-disable @typescript-eslint/naming-convention */
import { useQuery } from "@apollo/client";
import { GET_TODOS } from "queries/queries";
import { TodoItem } from "src/components/TodoItem";
import { TodoTitle } from "src/components/TodoTitle";
import type { GetTodosQuery } from "types/generated/graphql";

const TARGET_DATE = "today";

export const TodayTodo = () => {
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
    <div className="flex-1 p-4 bg-red-100">
      <TodoTitle title="今日する" className="mb-6 text-red-400 " />

      <div className="space-y-3">
        {data?.todos.map((todoItem) => {
          return (
            <TodoItem key={todoItem.id} todo={todoItem} targetDate={TARGET_DATE} name={todoItem.id} variant="red" />
          );
        })}
        <TodoItem targetDate={TARGET_DATE} name="today_new" />
      </div>
    </div>
  );
};
