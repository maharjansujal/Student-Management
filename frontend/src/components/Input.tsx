import { forwardRef, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
}

export default forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, type = "text", required, ...props },
  ref
) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={ref}
        id={id}
        type={type}
        required={required}
        {...props}
        className="border border-gray-300 w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
});
