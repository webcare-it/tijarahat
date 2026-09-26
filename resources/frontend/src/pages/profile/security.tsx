import { Password } from "@/components/common/password";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateProfileMutation } from "@/api/mutations/useProfIle";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { getUserId } from "@/helper";
import type { UserType } from "@/type";

export const ProfileSecurity = ({ user }: { user: UserType }) => {
  const { mutate, isPending } = useUpdateProfileMutation();

  const handleSecuritySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;
    if (currentPassword === "") {
      toast.error("Current password is required");
      return;
    }
    if (newPassword === "") {
      toast.error("New password is required");
      return;
    }
    if (confirmPassword === "") {
      toast.error("Confirm password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const postData = new FormData();
    postData.append("id", getUserId() as string);
    postData.append("password", newPassword);
    postData.append("old_password", currentPassword);
    mutate(postData);
  };

  const isDisabled = !!user?.provider_id;

  return (
    <Card className="col-span-1 px-4 md:px-6 py-4 md:py-6">
      <form className="space-y-4" onSubmit={handleSecuritySubmit}>
        <h3 className="text-lg font-semibold mb-6">{"Security Information"}</h3>
        <div className="space-y-2">
          <Password
            id="current_password"
            name="current_password"
            disabled={isDisabled}
            required={true}
            label={"Current Password"}
            placeholder={"Enter your current password"}
          />
        </div>
        <div className="space-y-2">
          <Password
            id="new_password"
            name="new_password"
            required={true}
            disabled={isDisabled}
            label={"New Password"}
            placeholder={"Enter your new password"}
          />
        </div>
        <div className="space-y-2">
          <Password
            id="confirm_password"
            name="confirm_password"
            disabled={isDisabled}
            required={true}
            label={"Confirm Password"}
            placeholder={"Enter your confirm password"}
          />
        </div>
        <div className="space-y-2 flex justify-end">
          <Button type="submit" disabled={isPending || isDisabled}>
            {isPending ? (
              <>
                <Spinner />
                {"Processing..."}
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
