import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";

interface Props {
  onSignOut: () => void;
  isPending: boolean;
  onHideModal: () => void;
}

export const SignOutModal = ({ onSignOut, isPending, onHideModal }: Props) => {
  return (
    <div className="flex flex-col items-center gap-6 mt-4">
      <div className="relative">
        <motion.div
          className="rounded-full bg-destructive/10 dark:bg-destructive/20 p-4"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}>
          <svg
            className="w-12 h-12 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground dark:text-gray-200">
          Sign Out?
        </h2>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          Are you sure you want to sign out of your account?
        </p>
      </div>

      <div className="flex gap-3 w-full">
        <Button
          variant="outline"
          onClick={onHideModal}
          disabled={isPending}
          className="flex-1">
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={onSignOut}
          disabled={isPending}
          className="flex-1">
          {isPending ? (
            <>
              <Spinner /> Processing...
            </>
          ) : (
            "Confirm"
          )}
        </Button>
      </div>
    </div>
  );
};
