import { getConfig } from "@/helper";
import { useConfig } from "@/hooks/useConfig";
import { Phone, Mail, MapPin } from "lucide-react";
import { Social } from "./social";

export const ContactFooter = () => {
  const config = useConfig();
  const phone = getConfig(config, "contact_phone")?.value as string;
  const email = getConfig(config, "contact_email")?.value as string;
  const address = getConfig(config, "contact_address")?.value as string;

  return (
    <div>
      <h4 className="text-white font-bold text-lg mb-4">Get in Touch</h4>
      <ul className="space-y-3">
        <li className="flex items-start gap-2 text-sm">
          <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{phone}</span>
        </li>
        <li className="flex items-start gap-2 text-sm">
          <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{email}</span>
        </li>
        <li className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{address}</span>
        </li>
      </ul>

      <div className="mt-4">
        <Social />
      </div>
    </div>
  );
};
