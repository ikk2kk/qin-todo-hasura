import { makeVar } from "@apollo/client";
import type { Todos } from "types/generated/graphql";

type TodayTodoDicById = {
  [key: string]: Todos;
};

type TodoDic = {
  today: Todos[];
  tomorrow: Todos[];
  someday: Todos[];
};

export const TodoDicVar = makeVar<TodoDic>({ today: [], tomorrow: [], someday: [] });
export const TodayTodoDicById = makeVar<TodayTodoDicById>({});
