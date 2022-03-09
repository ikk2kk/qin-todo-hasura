/* eslint-disable @typescript-eslint/naming-convention */
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TODO, GET_TODOS } from "queries/queries";
import { TodoItem } from "src/components/TodoItem";
import { TodoTitle } from "src/components/TodoTitle";
import type { GetTodosQuery } from "types/generated/graphql";

export const TodayTodo = () => {
  const { data, error } = useQuery<GetTodosQuery>(GET_TODOS, {
    fetchPolicy: "cache-first",
    variables: { target_date: "today" },
  });
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS, variables: { target_date: "today" } }],
  });

  // const [todoItemList, setTodoItemList] = useState([
  //   { id: "today0", text: "Next.jsのセットアップ" },
  //   { id: "today1", text: "ESLintのインストール" },
  // ]);
  const addTodoItem = async (todoText: string) => {
    // alert("AddTodoItem");
    // setTodoItemList((prev) => {
    //   const id = "today" + todoItemList.length;
    //   return [...prev, { id: id, text: todoText }];
    // });
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      await createTodo({ variables: { title: todoText, target_date: "today", done: false } });
      // alert("Add todo");
      // reset();
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
    <div className="flex-1 p-4 bg-red-100">
      <TodoTitle title="今日する" className="mb-6 text-red-400 " />

      <div className="space-y-3">
        {data?.todos.map((todoItem) => {
          return (
            <TodoItem
              key={todoItem.id}
              todo={todoItem}
              addTodoItem={addTodoItem}
              text={todoItem.title}
              name={todoItem.id}
              done={todoItem.done}
              variant="red"
            />
          );
        })}
        <TodoItem addTodoItem={addTodoItem} text="" name="today_new" />
      </div>
    </div>
  );
};
