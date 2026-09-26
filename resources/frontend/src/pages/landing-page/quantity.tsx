import { Button } from "@/components/ui/button";
import {
  useCampaignDecrementCart,
  useCampaignIncrementCart,
} from "@/controllers/campaignController";
import type { StateSyncType } from "@/type";
import { Minus, Plus } from "lucide-react";

interface Props {
  item: StateSyncType;
}
export const QuantityCampaign = ({ item }: Props) => {
  const { isLoading: inLoading, fnIncrementCart } =
    useCampaignIncrementCart(item);
  const { isLoading: deLoading, fnDecrementCart } =
    useCampaignDecrementCart(item);

  const handleIncrement = () => {
    fnIncrementCart();
  };

  const handleDecrement = () => {
    fnDecrementCart();
  };
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDecrement()}
        disabled={item?.quantity <= 1 || deLoading}
        className="h-8 w-8 ">
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-6 text-center font-medium text-foreground">
        {item?.quantity}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleIncrement()}
        disabled={inLoading}
        className="h-8 w-8 ">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
