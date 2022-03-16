import { useMutation } from "@apollo/client";
import { DocumentDuplicateIcon, PlusSmIcon, TrashIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { CREATE_TODO, DELETE_TODO, DUPLICATE_TODO, GET_TODOS, UPDATE_TODO } from "queries/queries";
import type { ChangeEvent, KeyboardEvent, VFC } from "react";
import { useEffect, useState } from "react";
import { Input } from "src/components/Input";
import type { Todos } from "types/generated/graphql";

type Props = {
  todo?: Todos;
  targetDate: "today" | "tomorrow" | "someday";
  name: string;
  variant?: "orange" | "yellow" | "red";
  todoLength: number;
};

export const TodoItem: VFC<Props> = (props) => {
  const [isChecked, setIsChecked] = useState<number>(0);
  const [todoText, setTodoText] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    refetchQueries: [{ query: GET_TODOS, variables: { target_date: props.targetDate } }],
  });

  const [createTodo] = useMutation(CREATE_TODO, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    refetchQueries: [{ query: GET_TODOS, variables: { target_date: props.targetDate } }],
  });
  const [duplicateTodo] = useMutation(DUPLICATE_TODO, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    refetchQueries: [{ query: GET_TODOS, variables: { target_date: props.targetDate } }],
  });
  useEffect(() => {
    if (props.todo) {
      setTodoText(props.todo.title);

      if (props.todo.done === true) {
        setIsChecked(1);
      } else {
        setIsChecked(0);
      }
    }
  }, []);

  const handleCheckBoxChange = async () => {
    if (isChecked === 1) {
      setIsChecked(0);
      try {
        await updateTodo({
          variables: {
            id: props.name,
            title: todoText,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            target_date: props.targetDate,
            done: false,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            order_index: props.todo?.order_index,
          },
        });
      } catch (error) {
        alert("更新失敗");
      }
    } else {
      setIsChecked(1);
      try {
        await updateTodo({
          variables: {
            id: props.name,
            title: todoText,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            target_date: props.targetDate,
            done: true,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            order_index: props.todo?.order_index,
          },
        });
      } catch (error) {
        alert("更新失敗");
      }
    }
  };

  const handleInputFocus = () => {
    setIsFocus(true);
  };

  const handleInputBlur = () => {
    setIsFocus(false);
    if (todoText.length === 0) {
      if (props.todo) {
        setTodoText(props.todo.title);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    return setTodoText(e.target.value);
  };

  const handleInputKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (todoText.length !== 0 && props.name.match("new")) {
        try {
          await createTodo({
            variables: {
              title: todoText,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              target_date: props.targetDate,
              done: false,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              order_index: props.todoLength,
            },
          });
        } catch (error) {
          console.error(error);
          alert("Fail add todo");
        }

        setTodoText("");
      } else if (todoText.length !== 0) {
        try {
          await updateTodo({
            variables: {
              id: props.name,
              title: todoText,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              target_date: props.targetDate,
              done: isChecked ? true : false,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              order_index: props.todo?.order_index,
            },
          });
        } catch (error) {
          alert("更新失敗");
        }
      }
    }
  };

  const handleDuplicate = async () => {
    try {
      await duplicateTodo({
        variables: {
          title: props.todo?.title,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          target_date: props.todo?.target_date,
          done: props.todo?.done,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          created_at: props.todo?.created_at,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          order_index: props.todo?.order_index,
        },
      });
    } catch (error) {
      console.error(error);
      alert("Fail duplicate todo");
    }
  };
  const handleTrash = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      await deleteTodo({ variables: { id: props.name } });
    } catch (error) {
      alert("Fail delete todo");
    }
  };

  return (
    <div className="flex items-center ">
      <label className="mr-4 text-gray-800 hover:cursor-pointer" htmlFor={props.name}>
        <div className="flex items-center bg-green-100">
          <input
            type="checkbox"
            className={clsx(
              "inline-block w-4 h-4 rounded-full border-0 ring-2 ring-gray-300 ring-offset-2 appearance-none hover:cursor-pointer",
              { "bg-orange-500": props.variant === "orange" && isChecked === 1 },
              { "bg-yellow-400": props.variant === "yellow" && isChecked === 1 },
              { "bg-red-500": props.variant === "red" && isChecked === 1 },

              { "bg-white": isChecked === 0 },
              {
                "bg-gray-300 ring-4 ring-offset-0 ": todoText.length === 0 && isFocus === false,
              }
            )}
            disabled={isFocus && todoText.length === 0}
            value={isChecked}
            // onClick={handleClick}
            onChange={handleCheckBoxChange}
          />
          {todoText.length === 0 && isFocus === false ? (
            <PlusSmIcon className="absolute w-4 h-4 text-white bg-gray-300" />
          ) : null}
        </div>
      </label>

      <div className="group container relative">
        <Input
          label=""
          linethrough={isChecked}
          variant={props.variant}
          name={props.name}
          type="text"
          placeholder="タスクを追加する"
          value={todoText}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {props.name.match("new") ? null : (
          <div className="flex absolute inset-y-0 right-1 items-center my-auto space-x-5 h-full opacity-0 group-hover:opacity-100">
            <DocumentDuplicateIcon className="w-5 h-5 text-gray-400 cursor-pointer" onClick={handleDuplicate} />
            <TrashIcon className="w-5 h-5 text-gray-400 cursor-pointer" onClick={handleTrash} />
          </div>
        )}
      </div>
    </div>
  );
};
