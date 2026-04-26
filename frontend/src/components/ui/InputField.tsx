import { cn } from "@/utils/cn";
import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

function InputField({ id, label, hint, error, className, ...props }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="label-base">
        {label}
      </label>
      <input id={id} className={cn("input-base", error && "border-danger-500", className)} {...props} />
      {error ? <p className="input-hint text-danger-500">{error}</p> : hint ? <p className="input-hint">{hint}</p> : null}
    </div>
  );
}

export default InputField;