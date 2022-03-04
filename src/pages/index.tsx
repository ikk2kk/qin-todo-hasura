import type { Reference } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { DELETE_TODO, GET_TODOS, UPDATE_TODO } from "queries/queries";
import type { VFC } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Layout } from "src/components/layout";
import type { GetTodosQuery, Todos } from "types/generated/graphql";

const Home: NextPage = () => {
  const { data, error } = useQuery<GetTodosQuery>(GET_TODOS, {
    fetchPolicy: "cache-first",
  });

  if (error) {
    return (
      <div className="">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {data?.todos.map((todo) => {
        return (
          <div key={todo.id}>
            {/* {todo.title} */}
            <TodoItem todo={todo} />
          </div>
        );
      })}
    </Layout>
  );
};

export default Home;

type TodoItemProps = {
  todo: Todos;
};

// eslint-disable-next-line react/destructuring-assignment
const TodoItem: VFC<TodoItemProps> = ({ todo }) => {
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, { data: { delete_todos_by_pk } }) {
      cache.modify({
        fields: {
          todos(existingEventRefs, { readField }) {
            return existingEventRefs.filter((ref: Reference) => {
              return delete_todos_by_pk.id !== readField("id", ref);
            });
          },
        },
      });
    },
  });

  const { handleSubmit, register, reset } = useForm<{ title: string }>({
    defaultValues: {
      title: todo.title,
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTodo({ variables: { id: todo.id } });
      alert("削除しました");
    } catch (error) {
      console.error(error);
      alert("削除失敗");
    }
  };
  return (
    <div>
      {isEditing ? <input type="text" {...register("title")} /> : <span>{todo.title}</span>}
      {isEditing ? (
        <button
          onClick={handleSubmit(async (data) => {
            try {
              await updateTodo({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                variables: { id: todo.id, title: data.title, target_date: "", done: true },
              });
              alert("更新完了");
              setIsEditing(false);
              reset();
            } catch (error) {
              console.error(error);
              alert("更新失敗");
            }
          })}
        >
          完了
        </button>
      ) : (
        <button onClick={handleEdit}>編集</button>
      )}
      <button onClick={handleDelete}>削除</button>
    </div>
  );
};
