import { Field, FieldSeparator } from "@/components/ui/field";
import { useSocialSignInMutation } from "@/api/mutations/useAuth";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { useConfig } from "@/hooks/useConfig";
import { getConfig } from "@/helper";
import { useGetConfig } from "@/api/queries/useGetConfig";
import { useState } from "react";

export const SocialSignIn = () => {
  const config = useConfig();
  const { data } = useGetConfig();
  const { mutate } = useSocialSignInMutation();
  const clientId = data?.google_client_id || null;
  const isShow = getConfig(config, "google_login")?.value;
  const [googleError, setGoogleError] = useState(false);

  const handleGoogleSuccess = (res: CredentialResponse) => {
    if (res?.credential) {
      try {
        const base64Url = res.credential?.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const user = JSON.parse(jsonPayload);
        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("avatar", user.picture);
        formData.append("provider", "google");

        mutate(formData);
      } catch {
        toast.error("Failed to process Google authentication");
        mutate({
          credential: res.credential,
        });
      }
    }
  };

  const handleGoogleError = () => {
    setGoogleError(true);
    toast.error("Google login failed. Please check your configuration.");
  };

  if (!clientId || isShow !== "1" || googleError) {
    return null;
  }

  return (
    <>
      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
        Or continue with
      </FieldSeparator>
      <Field className="pb-4 w-full">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          size="large"
          containerProps={{
            style: {
              borderRadius: "10px",
              height: "40px",
              width: "100%",
            },
          }}
          text="signin_with"
          width={"100%"}
          shape="rectangular"
        />
      </Field>
    </>
  );
};
