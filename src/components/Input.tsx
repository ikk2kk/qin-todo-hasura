import clsx from "clsx";
import type { InputHTMLAttributes, VFC } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  variant?: "orange" | "yellow" | "red";
  linethrough: number;
};

export const Input: VFC<InputProps> = (props) => {
  return (
    <div className="block w-full">
      <label htmlFor={props.name}>
        <div className="block ml-4 text-sm font-bold text-gray-500">{props.label}</div>
        <div className="relative">
          <input
            type="text"
            disabled={props.linethrough === 1 ? true : false}
            id={props.name}
            className={clsx(
              `pr-1 w-full focus:placeholder:text-transparent rounded-sm border-none focus:outline-none caret-orange-500 ${
                props.prefix ? "pl-10" : ""
              }`,
              { "text-gray-400 line-through bg-white": props.linethrough === 1 },
              { "caret-orange-500": props.variant === "orange" },
              { "caret-yellow-400": props.variant === "yellow" },
              { "caret-red-500": props.variant === "red" }
            )}
            autoComplete="off"
            {...props}
          />
        </div>
      </label>
      {props.error ? <p className="mt-0.5 ml-4 text-sm text-red-500">{props.error}</p> : null}
    </div>
  );
};
