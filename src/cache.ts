import { makeVar } from "@apollo/client";
import type { Todos } from "types/generated/graphql";

type IdTodoDic = {
  [key: string]: Todos;
};

type TodoDic = {
  today: Todos[];
  tomorrow: Todos[];
  someday: Todos[];
};

export const TodoDicVar = makeVar<TodoDic>({ today: [], tomorrow: [], someday: [] });
export const IdTodoDicVar = makeVar<IdTodoDic>({});
