import { FieldDescription } from "@/components/ui/field";
import { Link } from "react-router-dom";

export const AuthDescription = () => {
  return (
    <FieldDescription className="px-6 text-center text-white">
      By clicking continue, you agree to our{" "}
      <Link to="/policy/terms-condition">Terms & Condition</Link> &{" "}
      <Link to="/policy/privacy-policy">Privacy Policy</Link>.
    </FieldDescription>
  );
};
