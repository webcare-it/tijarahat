import { getConfig } from "@/helper";
import { useConfig } from "@/hooks/useConfig";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export const Social = () => {
    const config = useConfig();

    const url = window.location.origin;
    const showSocialLinks =
        getConfig(config, "show_social_links")?.value || url;
    const facebookLink = getConfig(config, "facebook_link")?.value || url;
    const twitterLink = getConfig(config, "twitter_link")?.value || url;
    const instagramLink = getConfig(config, "instagram_link")?.value || url;
    const youtubeLink = getConfig(config, "youtube_link")?.value || url;
    const linkedinLink = getConfig(config, "linkedin_link")?.value || url;

    return showSocialLinks ? (
        <div className="flex items-center gap-4">
            <div className="flex gap-3">
                <Link
                    target="_blank"
                    to={facebookLink as string}
                    className="hover:bg-primary border duration-75 p-2 rounded-full transition-colors"
                >
                    <Facebook className="w-4 h-4" />
                </Link>
                <Link
                    target="_blank"
                    to={twitterLink as string}
                    className="hover:bg-primary border duration-75 p-2 rounded-full transition-colors"
                >
                    <Twitter className="w-4 h-4" />
                </Link>
                <Link
                    target="_blank"
                    to={instagramLink as string}
                    className="hover:bg-primary border duration-75 p-2 rounded-full transition-colors"
                >
                    <Instagram className="w-4 h-4" />
                </Link>
                <Link
                    target="_blank"
                    to={youtubeLink as string}
                    className="hover:bg-primary border duration-75 p-2 rounded-full transition-colors"
                >
                    <Youtube className="w-4 h-4" />
                </Link>
                <Link
                    target="_blank"
                    to={linkedinLink as string}
                    className="hover:bg-primary border duration-75 p-2 rounded-full transition-colors"
                >
                    <Linkedin className="w-4 h-4" />
                </Link>
            </div>
        </div>
    ) : null;
};
