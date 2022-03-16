import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query GetTodos($target_date: String!) {
    todos(order_by: { order_index: asc }, where: { target_date: { _eq: $target_date } }) {
      id
      title
      target_date
      done
      created_at
      updated_at
      order_index
    }
  }
`;
export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $target_date: String!, $done: Boolean!, $order_index: Int!) {
    insert_todos_one(object: { title: $title, target_date: $target_date, done: $done, order_index: $order_index }) {
      id
      title
      target_date
      done
      created_at
      updated_at
      order_index
    }
  }
`;

export const CREATE_TODOS = gql`
  mutation CreateTodos($objects: [todos_insert_input!]!) {
    insert_todos(on_conflict: { constraint: todos_pkey, update_columns: order_index }, objects: $objects) {
      affected_rows
      returning {
        id
        title
        target_date
        done
        created_at
        updated_at
        order_index
      }
    }
  }
`;
export const DUPLICATE_TODO = gql`
  mutation CreateTodo(
    $title: String!
    $target_date: String!
    $done: Boolean!
    $created_at: timestamptz
    $order_index: Int!
  ) {
    insert_todos_one(
      object: {
        title: $title
        target_date: $target_date
        done: $done
        created_at: $created_at
        order_index: $order_index
      }
    ) {
      id
      title
      target_date
      done
      created_at
      updated_at
      order_index
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
      order_index
    }
  }
`;
export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: uuid!, $title: String!, $target_date: String!, $done: Boolean!, $order_index: Int!) {
    update_todos_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, target_date: $target_date, done: $done, order_index: $order_index }
    ) {
      id
      title
      target_date
      done
      created_at
      updated_at
      order_index
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
      order_index
    }
  }
`;
