/* eslint-disable @typescript-eslint/naming-convention */
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TODO, GET_TODOS } from "queries/queries";
import { TodoItem } from "src/components/TodoItem";
import { TodoTitle } from "src/components/TodoTitle";
import type { GetTodosQuery } from "types/generated/graphql";

const TARGET_DATE = "someday";

export const SomedayTodo = () => {
  const { data, error } = useQuery<GetTodosQuery>(GET_TODOS, {
    fetchPolicy: "cache-first",
    variables: { target_date: TARGET_DATE },
  });
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS, variables: { target_date: TARGET_DATE } }],
  });

  const addTodoItem = async (todoText: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      await createTodo({ variables: { title: todoText, target_date: TARGET_DATE, done: false } });
    } catch (error) {
      console.error(error);
      alert("Fail add todo");
    }
  };

  if (error) {
    return (
      <div className="">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 bg-yellow-100">
      <TodoTitle title="明日する" className="mb-6 text-yellow-400 " />

      <div className="space-y-3">
        {data?.todos.map((todoItem) => {
          return (
            <TodoItem
              key={todoItem.id}
              todo={todoItem}
              targetDate={TARGET_DATE}
              addTodoItem={addTodoItem}
              text={todoItem.title}
              name={todoItem.id}
              done={todoItem.done}
              variant="yellow"
            />
          );
        })}
        <TodoItem targetDate={TARGET_DATE} addTodoItem={addTodoItem} text="" name="tomorrow_new" />
      </div>
    </div>
  );
};
