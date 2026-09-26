import { useInitialLength } from "@/hooks/useMobile";

export const CardLayout = ({ children }: { children: React.ReactNode }) => {
    const columns = useInitialLength();

    return (
        <section
            className="
              grid
              gap-1 md:gap-3 xl:gap-4
              px-1 md:px-0
          "
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {children}
        </section>
    );
};
