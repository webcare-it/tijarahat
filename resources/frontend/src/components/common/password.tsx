import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupButton,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  placeholder?: string;
  forgotPassword?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  label?: null | string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaInvalid?: boolean;
}

export const Password = ({
  className,
  placeholder,
  forgotPassword = false,
  required = true,
  id = "password",
  name = "password",
  disabled = false,
  label = null,
  value,
  onChange,
  ariaInvalid,
}: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const labelText = !label ? "Password" : label;

  return (
    <Field>
      <div className="flex items-center">
        <FieldLabel htmlFor={id}>
          {labelText} {required ? "*" : ""}
        </FieldLabel>
        {forgotPassword && (
          <Link
            to="/forgot-password"
            className="ml-auto text-sm underline-offset-4 hover:underline">
            Forgot your password?
          </Link>
        )}
      </div>
      <InputGroup className={cn("h-10", className)}>
        <InputGroupInput
          id={id}
          name={name}
          placeholder={placeholder || "Enter your password"}
          disabled={disabled}
          className={cn("pl-3 h-full", className)}
          type={showPassword ? "text" : "password"}
          required={required}
          value={value}
          onChange={onChange}
          aria-invalid={ariaInvalid}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            className="rounded-full hover:bg-none"
            onClick={() => setShowPassword(!showPassword)}
            size="icon-xs">
            {showPassword ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
};
