import { Link, useLocation } from "react-router-dom";

export const AboutUsFooter = () => {
    const location = useLocation();

    const policies = [
        {
            name: "About Us",
            href: "/pages/about-us",
        },
        {
            name: "Contact us",
            href: "/pages/contact-us",
        },
        {
            name: "Privacy Policy",
            href: "/pages/privacy-policy",
        },
        {
            name: "Terms & Condition",
            href: "/pages/terms-condition",
        },
    ];

    return (
        <div>
            <h4 className="font-bold text-lg mb-4">About Us</h4>
            <ul className="space-y-2">
                {policies?.map((item) => (
                    <li key={item?.name}>
                        <Link
                            to={item?.href}
                            className={`hover:text-primary/70 hover:underline capitalize transition-colors text-sm ${
                                location.pathname === item?.href
                                    ? "text-primary"
                                    : ""
                            }`}
                        >
                            {item?.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
