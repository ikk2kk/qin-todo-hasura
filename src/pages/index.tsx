import { useMutation, useQuery } from "@apollo/client";
import type { DragEndEvent, DragOverEvent, DragStartEvent, Over } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { closestCorners } from "@dnd-kit/core";
import { KeyboardSensor, MouseSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { NextPage } from "next";
import Head from "next/head";
import { CREATE_TODOS, GET_TODOS_ALL } from "queries/queries";
import { useEffect, useState } from "react";
import { IdTodoDicVar } from "src/cache";
import { Layout } from "src/components/layout";
import { SomedayTodo } from "src/components/SomedayTodo";
import { TodayContainer } from "src/components/TodayContainer";
// import { TodayTodo } from "src/components/TodayTodo";
import { TomorrowTodo } from "src/components/TomorrowTodo";
import type { GetTodosQuery, Todos } from "types/generated/graphql";

// type Items = {
//   today: string[];
//   tomorrow: string[];
//   someday: string[];
// };

type IdListByCategory = {
  [key in Categories]: string[];
};

// type TodoListByCategory = {
//   [key in Categories]: Todos[];
// };

type TodoListObject = {
  today: Todos[];
  tomorrow: Todos[];
  someday: Todos[];
};

type Categories = "today" | "tomorrow" | "someday";

const Home: NextPage = () => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { data, error, loading } = useQuery<GetTodosQuery>(GET_TODOS_ALL, {
    fetchPolicy: "cache-first",
  });

  const [idListByCategory, setIdListByCategory] = useState<IdListByCategory>({
    today: [],
    tomorrow: [],
    someday: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [idTodoDic, setIdTodoDic] = useState<{ [key: string]: Todos }>({});

  useEffect(() => {
    if (!loading) {
      // idListByCategory
      Object.keys(idListByCategory).forEach((category) => {
        const temp = data?.todos.filter((todo) => {
          return todo["target_date"] === category;
        });

        if (temp) {
          const temp2: string[] = temp?.map((todo) => {
            return todo["id"];
          });

          setIdListByCategory((prev) => {
            return { ...prev, [category]: temp2 };
          });
        }
      });

      // idTodoDic
      if (data) {
        const tempIdTodoDic: { [key: string]: Todos } = {};
        data.todos.forEach((todo) => {
          return (tempIdTodoDic[todo.id] = todo);
        });
        IdTodoDicVar(tempIdTodoDic);
        setIdTodoDic(tempIdTodoDic);
      }
    }
  }, [data, loading]);

  // const [items, setItems] = useState<Items>({
  //   today: ["1", "2", "3"],
  //   tomorrow: ["4", "5", "6"],
  //   someday: ["7", "8", "9"],
  // });

  const [todoListObj, setTodoListObj] = useState<TodoListObject>({
    today: [],
    tomorrow: [],
    someday: [],
  });
  const [createTodos] = useMutation(CREATE_TODOS, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    refetchQueries: [{ query: GET_TODOS_ALL }],
  });
  // const [createTodos] = useMutation(CREATE_TODOS);
  const [isIndexChanged, setIsIndexChanged] = useState(false);

  const [_, setActiveId] = useState<string | null>();
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // console.log(todoListObj);

  const handleTodos = async (sorted_items: Pick<Todos, "id" | "title" | "target_date" | "done" | "order_index">[]) => {
    // Batch Write
    try {
      await createTodos({
        variables: {
          objects: sorted_items,
        },
      });
    } catch (error) {
      console.error(error);
      alert("Fail Upsert");
    }
  };
  useEffect(() => {
    if (isIndexChanged) {
      const dic: { [key: string]: Todos } = {};
      todoListObj["today"].forEach((e) => {
        return (dic[e.id] = e);
      });
      const sorted_items: Pick<Todos, "id" | "title" | "target_date" | "done" | "order_index">[] = idListByCategory[
        "today"
      ].map((e, index) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return {
          id: dic[e].id,
          title: dic[e].title,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          target_date: dic[e].target_date,
          done: dic[e].done,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          order_index: index,
        };
      });
      // Batch Write
      handleTodos(sorted_items);

      setIsIndexChanged(false);
    }
  }, [idListByCategory, isIndexChanged]);

  const findContainer = (id: string) => {
    if (id in idListByCategory) {
      return id;
    }

    return Object.keys(idListByCategory).find((key) => {
      const tkey: keyof IdListByCategory = key as Categories;
      return idListByCategory[tkey].includes(id);
    });
  };
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // const { active, over, draggingRect } = event;
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over as Over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setIdListByCategory((prev) => {
      const activeItems = prev[activeContainer as Categories];
      const overItems = prev[overContainer as Categories];

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = 0;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer as Categories].filter((item) => {
            return item !== active.id;
          }),
        ],
        [overContainer]: [
          ...prev[overContainer as Categories].slice(0, newIndex),
          idListByCategory[activeContainer as Categories][activeIndex],
          ...prev[overContainer as Categories].slice(newIndex, prev[overContainer as Categories].length),
        ],
      };
    });
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over as Over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      return;
    }

    const activeIndex = idListByCategory[activeContainer as Categories].indexOf(active.id);
    const overIndex = idListByCategory[overContainer as Categories].indexOf(overId);

    if (activeIndex !== overIndex) {
      setIdListByCategory((items) => {
        return {
          ...items,
          [overContainer]: arrayMove(items[overContainer as Categories], activeIndex, overIndex),
        };
      });
      setIsIndexChanged(true);
    }
    setActiveId(null);
  };
  if (error) {
    return (
      <div className="">
        <p>Error: {error.message}</p>
      </div>
    );
  }
  // console.log(items);
  return (
    <Layout>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-between items-center py-[144px] px-[81px] space-y-4 w-full min-h-full bg-white sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <TodayContainer
            id="today"
            items={idListByCategory.today}
            setItems={setIdListByCategory}
            setTodoListObj={setTodoListObj}
          />
          {/* <TodayTodo /> */}
          <TomorrowTodo />
          <SomedayTodo />
        </DndContext>
      </div>
    </Layout>
  );
};

export default Home;
