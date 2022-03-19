import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  error?: string;
  variant?: "orange" | "yellow" | "red";
  linethrough: number;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  return (
    <div className="block w-full h-full">
      <label htmlFor={props.name} className="h-full">
        <div className="relative h-full">
          <TextareaAutosize
            ref={ref}
            id={props.name}
            minRows={1}
            value={props.value}
            className={clsx(
              `pr-1 w-full focus:placeholder:text-transparent bg-transparent rounded-sm border-none focus:outline-none caret-orange-500 resize-none ${
                props.prefix ? "pl-10" : ""
              }`,
              { "text-gray-400 line-through ": props.linethrough === 1 },
              { "caret-orange-500": props.variant === "orange" },
              { "caret-yellow-400": props.variant === "yellow" },
              { "caret-red-500": props.variant === "red" }
            )}
            autoComplete="off"
            placeholder={props.placeholder}
            name={props.name}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
            onChange={props.onChange}
            onBlur={props.onBlur}
          />
        </div>
      </label>
      {props.error ? <p className="mt-0.5 ml-4  text-red-500">{props.error}</p> : null}
    </div>
  );
});
Textarea.displayName = "Textarea";
