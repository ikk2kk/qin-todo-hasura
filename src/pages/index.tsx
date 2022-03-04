// import type { Reference } from "@apollo/client";
// import { useMutation, useQuery } from "@apollo/client";
// import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
// import { GET_TODOS } from "queries/queries";
// import { DELETE_TODO, GET_TODOS, UPDATE_TODO } from "queries/queries";
// import type { VFC } from "react";
import { useState } from "react";
// import { useForm } from "react-hook-form";
import { Layout } from "src/components/layout";
// import type { GetTodosQuery, Todos } from "types/generated/graphql";
import { TodayTodo } from "src/components/TodayTodo";
import { TodoItem } from "src/components/TodoItem";
import { TodoTitle } from "src/components/TodoTitle";
// import type { GetTodosQuery } from "types/generated/graphql";

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-between items-center py-[144px] px-[81px] space-y-4 w-full min-h-full bg-white sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
        <TodayTodo />
        <Todo2 />
        <Todo3 />
      </div>
    </Layout>
  );
};

export default Home;

export const Todo = () => {
  const [todoItemList, setTodoItemList] = useState([
    { id: "today0", text: "Next.jsのセットアップ" },
    { id: "today1", text: "ESLintのインストール" },
  ]);
  const addTodoItem = (todoText: string) => {
    // alert("AddTodoItem");
    setTodoItemList((prev) => {
      const id = "today" + todoItemList.length;
      return [...prev, { id: id, text: todoText }];
    });
  };
  return (
    <div className="flex-1 p-4 bg-red-100">
      <TodoTitle title="今日する" className="mb-6 text-red-400 " />

      <div className="space-y-3">
        {todoItemList.map((todoItem) => {
          return (
            <TodoItem
              key={todoItem.id}
              addTodoItem={addTodoItem}
              text={todoItem.text}
              name={todoItem.id}
              variant="red"
            />
          );
        })}
        <TodoItem addTodoItem={addTodoItem} text="" name="today_new" />
      </div>
    </div>
  );
};

export const Todo2 = () => {
  const [todoItemList, setTodoItemList] = useState([
    { id: "tomorrow0", text: "松本さんにメール" },
    { id: "tomorrow1", text: "来週の飲み会の場所を決める" },
  ]);
  const addTodoItem = (todoText: string) => {
    setTodoItemList((prev) => {
      const id = "tomorrow" + todoItemList.length;
      return [...prev, { id: id, text: todoText }];
    });
  };
  return (
    <div className="flex-1 p-4 bg-orange-100">
      <TodoTitle title="明日する" className="mb-6 text-orange-400 " />

      <div className="space-y-3">
        {todoItemList.map((todoItem) => {
          return (
            <TodoItem
              key={todoItem.id}
              addTodoItem={addTodoItem}
              text={todoItem.text}
              name={todoItem.id}
              variant="orange"
            />
          );
        })}
        <TodoItem addTodoItem={addTodoItem} text="" name="tomorrow_new" variant="orange" />
      </div>
    </div>
  );
};

export const Todo3 = () => {
  const [todoItemList, setTodoItemList] = useState([{ id: "sometime0", text: "Prettierのインストール" }]);
  const addTodoItem = (todoText: string) => {
    setTodoItemList((prev) => {
      const id = "sometime" + todoItemList.length;
      return [...prev, { id: id, text: todoText }];
    });
  };
  return (
    <div className="flex-1 p-4 bg-yellow-100">
      <TodoTitle title="今度する" className="mb-6 text-yellow-400 " />

      <div className="space-y-3">
        {todoItemList.map((todoItem) => {
          return (
            <TodoItem
              key={todoItem.id}
              addTodoItem={addTodoItem}
              text={todoItem.text}
              name={todoItem.id}
              variant="yellow"
            />
          );
        })}
        <TodoItem addTodoItem={addTodoItem} text="" name="sometime_new" variant="yellow" />
      </div>
    </div>
  );
};
