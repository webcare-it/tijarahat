import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Props {
  children: React.ReactNode;
  text: string;
}

export const TooltipWrapper = ({ children, text }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
};
