import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Password } from "@/components/common/password";
import { useSignIn, useSignUp } from "@/controllers/authController";
import { Spinner } from "@/components/ui/spinner";
import { PhoneInput } from "@/components/common/phone-input";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export const SignInForm = () => {
    const { fnSignIn, isPending } = useSignIn();
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    return (
        <form onSubmit={fnSignIn}>
            <input type="hidden" name="user_type" value="customer" />
            <FieldGroup>
                <PhoneInput
                    id="email"
                    name="email"
                    disabled={isPending}
                    label="Phone"
                    placeholder="01XXXXXXXXX"
                    onValidationChange={(isValid) => setIsPhoneValid(isValid)}
                />

                <Password
                    disabled={isPending}
                    placeholder={"Enter your password"}
                    forgotPassword={true}
                />

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="remember_me"
                        name="remember_me"
                        disabled={isPending}
                        className="cursor-pointer"
                    />
                    <FieldLabel
                        htmlFor="remember_me"
                        className="cursor-pointer -mt-1"
                    >
                        Remember me
                    </FieldLabel>
                </div>

                <Field>
                    <Button
                        className={cn(
                            isPending ? "opacity-50 cursor-not-allowed" : "",
                        )}
                        type="submit"
                        size="lg"
                        disabled={isPending || !isPhoneValid}
                    >
                        {isPending ? (
                            <>
                                <Spinner />
                                "Processing..."
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                    <FieldDescription className="text-center">
                        Don't have an account?
                        <Link to="/signup" className="text-primary ml-1   ">
                            Sign up
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
};

export const SignUpForm = () => {
    const { fnSignUp, isPending } = useSignUp();
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    return (
        <form onSubmit={fnSignUp}>
            <input type="hidden" name="register_by" value="phone" />
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Full Name *</FieldLabel>
                    <Input
                        className="h-10 "
                        id="name"
                        name="name"
                        type="text"
                        required
                        disabled={isPending}
                        placeholder={"Enter your full name"}
                    />
                </Field>
                <PhoneInput
                    id="email_or_phone"
                    name="email_or_phone"
                    label="Phone"
                    placeholder="01XXXXXXXXX or +881XXXXXXXXX"
                    onValidationChange={(isValid) => setIsPhoneValid(isValid)}
                />
                <Password
                    disabled={isPending}
                    placeholder={"Enter your password"}
                />
                <Field>
                    <Button
                        className={cn(
                            isPending ? "opacity-50 cursor-not-allowed" : "",
                        )}
                        type="submit"
                        size="lg"
                        disabled={isPending || !isPhoneValid}
                    >
                        {isPending ? (
                            <>
                                <Spinner />
                                Processing...
                            </>
                        ) : (
                            "Sign up"
                        )}
                    </Button>
                    <FieldDescription className="text-center mb-4">
                        Already have an account?
                        <Link to="/signin" className="text-primary ml-1   ">
                            Sign in
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
};
