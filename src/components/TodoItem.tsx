import { useMutation } from "@apollo/client";
import { CheckIcon, DocumentDuplicateIcon, PlusSmIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import { useNotifications } from "@mantine/notifications";
import clsx from "clsx";
import { CREATE_TODO, DELETE_TODO, DUPLICATE_TODO, GET_TODOS_ALL, UPDATE_TODO } from "queries/queries";
import type { ChangeEvent, KeyboardEvent, VFC } from "react";
import { useEffect, useState } from "react";
import { Textarea } from "src/components/Textarea";
import type { Todos } from "types/generated/graphql";

type Props = {
  todo?: Todos;
  targetDate: "today" | "tomorrow" | "someday";
  name: string;
  variant?: "orange" | "yellow" | "red";
  todoLength: number;
};

export const TodoItem: VFC<Props> = (props) => {
  const notifications = useNotifications();
  const [isChecked, setIsChecked] = useState<number>(0);
  const [todoText, setTodoText] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    refetchQueries: [{ query: GET_TODOS_ALL }],
  });

  const [createTodo] = useMutation(CREATE_TODO, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    refetchQueries: [{ query: GET_TODOS_ALL }],
  });
  const [duplicateTodo] = useMutation(DUPLICATE_TODO, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    refetchQueries: [{ query: GET_TODOS_ALL }],
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

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    return setTodoText(e.target.value);
  };
  // const handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
  //   console.log(e.nativeEvent.isComposing, e);
  // };
  const handleInputKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.which === 13) {
      // if (e.key === "Enter" && e.isC === 13) {
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
    const id = notifications.showNotification({
      loading: true,
      title: "Loading your data",
      message: "Data will be loaded in 3 seconds, you cannot close this yet",
      autoClose: false,
      disallowClose: true,
    });
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      await deleteTodo({ variables: { id: props.name } });

      notifications.updateNotification(id, {
        id,
        color: "teal",
        title: "Data was deleted",
        message: "Notification will close in 2 seconds, you can close this notification now",
        icon: <CheckIcon />,
        autoClose: 2000,
      });
    } catch (error) {
      // alert("Fail delete todo");
      notifications.updateNotification(id, {
        id,
        color: "red",
        title: "Failed to delete data",
        message: "Notification will close in 2 seconds, you can close this notification now",
        icon: <XIcon />,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="flex relative ">
      <div className="relative w-10">
        <label className="absolute top-1 mr-4 text-gray-800 hover:cursor-pointer" htmlFor={props.name}>
          <div className="flex items-center bg-transparent">
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
      </div>

      <div className="group container flex relative justify-between ">
        <Textarea
          label=""
          linethrough={isChecked}
          variant={props.variant}
          name={props.name}
          placeholder="タスクを追加する"
          value={todoText}
          onKeyDown={handleInputKeyDown}
          // onKeyUp={handleInputKeyUp}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />

        {props.name.match("new") ? null : (
          <div className="flex my-auto space-x-3 h-full  opacity-0 group-hover:opacity-100">
            <DocumentDuplicateIcon className="w-5 h-5 text-gray-400 cursor-pointer" onClick={handleDuplicate} />
            <TrashIcon className="w-5 h-5 text-gray-400 cursor-pointer" onClick={handleTrash} />
          </div>
        )}
      </div>
    </div>
  );
};
