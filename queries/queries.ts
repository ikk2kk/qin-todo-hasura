import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query GetTodos($target_date: String!) {
    todos(order_by: { created_at: asc }, where: { target_date: { _eq: $target_date } }) {
      id
      title
      target_date
      done
      created_at
      updated_at
    }
  }
`;
export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $target_date: String!, $done: Boolean!) {
    insert_todos_one(object: { title: $title, target_date: $target_date, done: $done }) {
      id
      title
      target_date
      done
      created_at
      updated_at
    }
  }
`;
export const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_todos_by_pk(id: $id) {
      id
      title
      target_date
      done
      created_at
      updated_at
    }
  }
`;
export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: uuid!, $title: String!, $target_date: String!, $done: Boolean!) {
    update_todos_by_pk(pk_columns: { id: $id }, _set: { title: $title, target_date: $target_date, done: $done }) {
      id
      title
      target_date
      done
      created_at
      updated_at
    }
  }
`;

export const SUBSCRIPTION_GET_TODOS = gql`
  subscription GetTodosSubscription {
    todos(order_by: { created_at: desc }) {
      id
      title
      target_date
      done
      created_at
      updated_at
    }
  }
`;
