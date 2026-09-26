import { getConfig } from "@/helper";
import { useConfig } from "@/hooks/useConfig";

export const SocialMessage = ({
    title = "",
    land = "",
}: {
    title?: string;
    land?: string;
}) => {
    const config = useConfig();
    const whatsappNumber = getConfig(config, "whatsapp_number")
        ?.value as string;
    const detailsChatMessage =
        (getConfig(config, "details_whatsapp_message")?.value as string) ||
        "Hello! I'm interested in this product";

    const messengerLink = getConfig(config, "fb_page_username")
        ?.value as string;

    if (title) {
        return (
            <a
                href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${detailsChatMessage}: ${title}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BA5C] text-white p-2 rounded-md cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 flex-shrink-0"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.485-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 2C6.48 2 2 6.59 2 12.253c0 2.1.63 4.043 1.71 5.645L2 22l4.24-1.11c1.57 1.07 3.41 1.68 5.3 1.68 5.52 0 10-4.59 10-10.253C22 6.59 17.52 2 12 2zm0 18c-1.55 0-3.07-.44-4.38-1.27l-.31-.2-3.24.85.86-3.18-.21-.33C4.1 14.3 3.6 13.2 3.6 12c0-4.64 3.76-8.4 8.4-8.4 4.64 0 8.4 3.76 8.4 8.4 0 4.64-3.76 8.4-8.4 8.4z" />
                </svg>
                For call: {whatsappNumber}
            </a>
        );
    }

    if (land) {
        return (
            <>
                <a
                    href={`https://m.me/${messengerLink}`}
                    title="Message us on Facebook"
                    target="_blank"
                    rel="noreferrer"
                    className="fixed right-4 bottom-28 z-50"
                >
                    <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex size-14 md:size-16 rounded-full bg-blue-600 opacity-75 animate-ping"></span>
                        <span className="absolute inline-flex size-14 md:size-16 rounded-full bg-blue-600 opacity-50 animate-ping delay-[3000ms]"></span>

                        <div className="relative size-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg hover:scale-110 transition">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="size-7 fill-white"
                                aria-hidden="true"
                            >
                                <path d="M12 2C6.48 2 2 6.11 2 11.22c0 3.1 1.56 5.88 4 7.65V22l3.66-2.01c.98.27 2.02.41 3.34.41 5.52 0 10-4.11 10-9.22S17.52 2 12 2zm1.14 12.2l-2.33-2.49L5.6 14.2l5.03-5.35 2.38 2.49 4.2-2.49-5.07 5.35z" />
                            </svg>
                        </div>
                    </div>
                </a>
                <a
                    href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${detailsChatMessage}: ${land}`}
                    target="_blank"
                    className="fixed right-4 bottom-4 z-50"
                >
                    <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex size-14 md:size-16 rounded-full bg-green-500 opacity-75 animate-ping"></span>
                        <span className="absolute inline-flex size-14 md:size-16 rounded-full bg-green-500 opacity-50 animate-ping delay-200"></span>

                        <div className="relative h-14 w-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:scale-110 transition">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                className="w-7 h-7 fill-white"
                            >
                                <path d="M16 .396C7.163.396 0 7.56 0 16.396c0 2.887.755 5.703 2.188 8.182L0 32l7.627-2.142A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16.004C32 7.56 24.837.396 16 .396zm0 29.227c-2.54 0-5.032-.678-7.203-1.964l-.516-.305-4.525 1.272 1.206-4.41-.336-.539A13.92 13.92 0 012.08 16.396c0-7.682 6.244-13.926 13.92-13.926 7.676 0 13.92 6.244 13.92 13.926 0 7.683-6.244 13.927-13.92 13.927zm7.69-10.44c-.42-.21-2.48-1.224-2.863-1.363-.382-.14-.66-.21-.938.21-.28.42-1.08 1.363-1.324 1.645-.243.28-.487.315-.907.105-.42-.21-1.774-.654-3.377-2.087-1.247-1.114-2.088-2.49-2.333-2.91-.243-.42-.026-.647.184-.856.19-.19.42-.487.63-.73.21-.244.28-.42.42-.7.14-.28.07-.525-.035-.735-.105-.21-.938-2.26-1.284-3.09-.337-.807-.68-.7-.938-.714l-.8-.014c-.28 0-.735.105-1.12.525-.383.42-1.47 1.436-1.47 3.5s1.506 4.06 1.716 4.34c.21.28 2.967 4.533 7.195 6.356 1.006.435 1.79.695 2.4.89 1.008.32 1.926.275 2.65.167.808-.12 2.48-1.014 2.83-1.994.35-.98.35-1.82.245-1.995-.105-.175-.385-.28-.805-.49z" />
                            </svg>
                        </div>
                    </div>
                </a>
            </>
        );
    }

    return (
        <>
            <a
                href={`https://m.me/${messengerLink}`}
                title="Message us on Facebook"
                target="_blank"
                rel="noreferrer"
                className="fixed right-2 md:right-4 bottom-28 z-50"
            >
                <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex size-10 md:size-16 rounded-full bg-blue-600 opacity-75 animate-ping"></span>
                    <span className="absolute inline-flex size-10 md:size-14 rounded-full bg-blue-600 opacity-50 animate-ping delay-[3000ms]"></span>

                    <div className="relative size-10 md:size-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg hover:scale-110 transition">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-5 md:size-7 fill-white"
                            aria-hidden="true"
                        >
                            <path d="M12 2C6.48 2 2 6.11 2 11.22c0 3.1 1.56 5.88 4 7.65V22l3.66-2.01c.98.27 2.02.41 3.34.41 5.52 0 10-4.11 10-9.22S17.52 2 12 2zm1.14 12.2l-2.33-2.49L5.6 14.2l5.03-5.35 2.38 2.49 4.2-2.49-5.07 5.35z" />
                        </svg>
                    </div>
                </div>
            </a>
            <a
                href={`https://api.whatsapp.com/send?phone=${whatsappNumber}`}
                target="_blank"
                className="fixed right-2 md:right-4 bottom-14 md:bottom-4 z-50"
            >
                <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex size-10 md:size-14 rounded-full bg-green-500 opacity-75 animate-ping"></span>
                    <span className="absolute inline-flex size-10 md:size-14 rounded-full bg-green-500 opacity-50 animate-ping delay-[3000ms]"></span>

                    <div className="relative size-10 md:size-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:scale-110 transition">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            className="size-5 md:size-7 fill-white"
                        >
                            <path d="M16 .396C7.163.396 0 7.56 0 16.396c0 2.887.755 5.703 2.188 8.182L0 32l7.627-2.142A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16.004C32 7.56 24.837.396 16 .396zm0 29.227c-2.54 0-5.032-.678-7.203-1.964l-.516-.305-4.525 1.272 1.206-4.41-.336-.539A13.92 13.92 0 012.08 16.396c0-7.682 6.244-13.926 13.92-13.926 7.676 0 13.92 6.244 13.92 13.926 0 7.683-6.244 13.927-13.92 13.927zm7.69-10.44c-.42-.21-2.48-1.224-2.863-1.363-.382-.14-.66-.21-.938.21-.28.42-1.08 1.363-1.324 1.645-.243.28-.487.315-.907.105-.42-.21-1.774-.654-3.377-2.087-1.247-1.114-2.088-2.49-2.333-2.91-.243-.42-.026-.647.184-.856.19-.19.42-.487.63-.73.21-.244.28-.42.42-.7.14-.28.07-.525-.035-.735-.105-.21-.938-2.26-1.284-3.09-.337-.807-.68-.7-.938-.714l-.8-.014c-.28 0-.735.105-1.12.525-.383.42-1.47 1.436-1.47 3.5s1.506 4.06 1.716 4.34c.21.28 2.967 4.533 7.195 6.356 1.006.435 1.79.695 2.4.89 1.008.32 1.926.275 2.65.167.808-.12 2.48-1.014 2.83-1.994.35-.98.35-1.82.245-1.995-.105-.175-.385-.28-.805-.49z" />
                        </svg>
                    </div>
                </div>
            </a>
        </>
    );
};
