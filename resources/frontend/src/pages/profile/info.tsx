import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateProfileMutation } from "@/api/mutations/useProfIle";
import { Card } from "@/components/ui/card";
import { getUserId } from "@/helper";
import type { UserType } from "@/type";

export const ProfileInfo = ({ user }: { user: UserType }) => {
  const { mutate, isPending } = useUpdateProfileMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const filteredData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (value && value.toString().trim() !== "") {
        filteredData.append(key, value);
      }
    }

    if (filteredData.entries().next().done) {
      return;
    }

    filteredData.append("id", getUserId() as string);
    mutate(filteredData);
  };

  return (
    <Card className="col-span-1 px-4 md:px-6 py-4 md:py-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold mb-6">{"Personal Information"}</h3>
        <div className="space-y-2">
          <Label htmlFor="name">{"Name"}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            className="h-10"
            defaultValue={user?.name || ""}
            placeholder={"Enter your name"}
          />
        </div>
        {user?.phone && (
          <div className="space-y-2">
            <Label htmlFor="phone">{"Phone"}</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              className="h-10 cursor-not-allowed"
              defaultValue={user?.phone || ""}
              readOnly
              placeholder={"Enter your phone"}
            />
          </div>
        )}
        {user?.email && (
          <div className="space-y-2">
            <Label htmlFor="email">{"Email"}</Label>
            <Input
              id="email"
              name="email"
              type="text"
              className="h-10 cursor-not-allowed"
              defaultValue={user?.email || ""}
              readOnly
              placeholder={"Enter your email"}
            />
          </div>
        )}
        <div className="flex justify-end items-end">
          <Button type="submit" disabled={isPending}>
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
