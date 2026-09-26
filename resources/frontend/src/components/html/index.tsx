import "./policy.css";

export const RenderHtml = ({ html }: { html: string }) => {
    return (
        <div
            className="policy-content"
            dangerouslySetInnerHTML={{
                __html: html || "",
            }}
        />
    );
};
