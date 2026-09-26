import { User, Phone, MapPin, MessageSquare } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

export type InfoType = {
  name: string;
  phone: string;
  address: string;
  notes: string;
};
interface Props {
  info: InfoType;
  setInfo: (info: InfoType) => void;
}
export const CheckoutForm = ({ info, setInfo }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="name">Name *</Label>
        <InputGroup className="h-9 md:h-10">
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            id="name"
            name="name"
            required
            placeholder={"Enter your full name"}
            value={info.name}
            onChange={handleChange}
          />
        </InputGroup>
      </div>
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="contact">Phone *</Label>
        <InputGroup className="h-9 md:h-10">
          <InputGroupAddon>
            <Phone />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            id="phone"
            name="phone"
            required
            placeholder={"Enter your phone number"}
            value={info.phone}
            onChange={handleChange}
          />
        </InputGroup>
      </div>
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="address">Full Address *</Label>
        <InputGroup className="h-9 md:h-10">
          <InputGroupAddon>
            <MapPin />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            id="address"
            name="address"
            required
            placeholder={"Enter your full address"}
            value={info.address}
            onChange={handleChange}
          />
        </InputGroup>
      </div>
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <InputGroup className="h-9 md:h-10">
          <InputGroupAddon>
            <MessageSquare />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            id="notes"
            name="notes"
            placeholder={"Enter any additional notes or comments"}
            value={info.notes}
            onChange={handleChange}
          />
        </InputGroup>
      </div>
    </div>
  );
};
