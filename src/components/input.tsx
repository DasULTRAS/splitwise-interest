"use client";

import React, { useState } from "react";

export function Input({
  id,
  label,
  placeholder = label,
  className,
  disabled,
  value,
  type = "text",
  onChange,
  inputError,
  min,
  max,
  step,
}: {
  id: string;
  label?: string;
  placeholder?: string;
  className?: string | undefined;
  disabled?: boolean;
  value: string | number | readonly string[] | undefined;
  type?: React.HTMLInputTypeAttribute | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  inputError?: string;
  min?: string | number | undefined;
  max?: string | number | undefined;
  step?: string | number | undefined;
}) {
  return (
    <div key={id} className={className}>
      <label className="mb-1 block text-sm font-bold">{label}</label>
      <input
        className="inp_form_default"
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
      />
      {inputError && <p className="text-xs italic text-red-500">{inputError}</p>}
    </div>
  );
}

export function InputPassword({
  id = "password",
  label,
  className,
  value,
  onChange,
  inputError,
}: {
  id?: string;
  key?: string;
  label?: string;
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  inputError?: string;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className={`mb-4 w-full ${className}`} key={id}>
      <label className="mb-1 block text-sm font-bold">{label}</label>
      <div className={`inp_form_default flex items-center justify-between`}>
        <input
          className="flex-grow focus:outline-none"
          id={id}
          autoComplete="off"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={value}
          onChange={onChange}
        />
        <button
          className="btn_default"
          type="button"
          tabIndex={-1}
          onMouseDown={() => setShowPassword(true)}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
          onTouchStart={() => setShowPassword(true)}
          onTouchEnd={() => setShowPassword(false)}
        >
          show
        </button>
      </div>
      {inputError && <p className="text-xs italic text-red-500">{inputError}</p>}
    </div>
  );
}
