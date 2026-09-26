import { useSignInMutation, useSignUpMutation } from "@/api/mutations/useAuth";
import { useState } from "react";
import { usePhoneValidation } from "@/hooks/usePhoneValidation";
import toast from "react-hot-toast";

export const useSignIn = () => {
    const [error, setError] = useState<string>("");
    const { mutate, isPending } = useSignInMutation();
    const { validateBangladeshiPhone } = usePhoneValidation();

    const fnSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const phone = data.get("email") as string;
        const phoneValidation = validateBangladeshiPhone(phone);
        if (!phoneValidation.isValid) {
            setError(phoneValidation.error || "Invalid phone number");
            return;
        }
        setError("");
        data.set("email", phoneValidation.formattedNumber || phone);

        mutate(data);
    };

    return { fnSignIn, isPending, error };
};

export const useSignUp = () => {
    const [error, setError] = useState<string>("");
    const { mutate, isPending } = useSignUpMutation();
    const { mutate: signInFn, isPending: isSignInPending } =
        useSignInMutation();
    const { validateBangladeshiPhone } = usePhoneValidation();

    const fnSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const name = data.get("name") as string;
        const password = data.get("password") as string;
        const phone = data.get("email_or_phone") as string;

        if (!name) {
            setError("Name is required");
            return;
        }

        if (!password) {
            setError("Password is required");
            return;
        }

        const phoneValidation = validateBangladeshiPhone(phone);
        if (!phoneValidation.isValid) {
            setError(phoneValidation.error || "Invalid phone number");
            return;
        }
        setError("");
        data.set("email_or_phone", phoneValidation.formattedNumber || phone);
        data.set("name", name);
        data.set("password", password);

        mutate(data, {
            onSuccess: (res) => {
                if (res?.result === true) {
                    const singnInData = new FormData();
                    singnInData.set(
                        "email",
                        phoneValidation.formattedNumber || phone,
                    );
                    singnInData.set("password", password);
                    signInFn(singnInData);
                } else {
                    toast.error(res?.message || "Something went wrong");
                }
            },
        });
    };

    const loading = isPending || isSignInPending;
    return { fnSignUp, isPending: loading, error };
};
