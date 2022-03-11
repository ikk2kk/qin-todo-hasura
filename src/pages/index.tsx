import type { DragEndEvent, DragOverEvent, DragStartEvent, Over } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { closestCorners } from "@dnd-kit/core";
import { KeyboardSensor, MouseSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Layout } from "src/components/layout";
import { SomedayTodo } from "src/components/SomedayTodo";
import { TodayContainer } from "src/components/TodayContainer";
// import { TodayTodo } from "src/components/TodayTodo";
import { TomorrowTodo } from "src/components/TomorrowTodo";

type Items = {
  today: string[];
  tomorrow: string[];
  someday: string[];
};

type Categories = "today" | "tomorrow" | "someday";

const Home: NextPage = () => {
  const [items, setItems] = useState<Items>({
    today: ["1", "2", "3"],
    tomorrow: ["4", "5", "6"],
    someday: ["7", "8", "9"],
  });

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

  const findContainer = (id: string) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => {
      const tkey: keyof Items = key as Categories;
      return items[tkey].includes(id);
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

    setItems((prev) => {
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
        // if (draggingRect) {
        //   isBelowLastItem =
        //     over &&
        //     overIndex === overItems.length - 1 &&
        //     draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;
        // }

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
          items[activeContainer as Categories][activeIndex],
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

    const activeIndex = items[activeContainer as Categories].indexOf(active.id);
    const overIndex = items[overContainer as Categories].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => {
        return {
          ...items,
          [overContainer]: arrayMove(items[overContainer as Categories], activeIndex, overIndex),
        };
      });
    }

    setActiveId(null);
  };

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
          <TodayContainer id="today" items={items.today} setItems={setItems} />
          {/* <TodayTodo /> */}
          <TomorrowTodo />
          <SomedayTodo />
        </DndContext>
      </div>
    </Layout>
  );
};

export default Home;
