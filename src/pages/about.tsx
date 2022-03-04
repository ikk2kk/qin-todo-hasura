import { useMutation } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { CREATE_TODO, GET_TODOS } from "queries/queries";
import { useForm } from "react-hook-form";
import { Layout } from "src/components/layout";

const About: NextPage = () => {
  const { handleSubmit, register, reset } = useForm<{ title: string }>({
    defaultValues: { title: "" },
  });

  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const handleClick = handleSubmit(async (data) => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      await createTodo({ variables: { title: data.title, target_date: "abc", done: false } });
      alert("Add todo");
      reset();
    } catch (error) {
      console.error(error);
      alert("Fail add todo");
    }
  });
  return (
    <Layout>
      <Head>
        <title>About</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <input type="text" {...register("title", { required: "必須です" })} />
      <button className="p-2" onClick={handleClick}>
        作成
      </button>
    </Layout>
  );
};

export default About;
