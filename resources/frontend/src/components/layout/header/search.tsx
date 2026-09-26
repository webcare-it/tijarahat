import {
    useState,
    useEffect,
    useRef,
    useCallback,
    forwardRef,
    memo,
} from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MoveUpRight } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAllUtility } from "@/api/queries/useAllUtility";

interface ActionType {
    id: string;
    query: string;
    count: number;
    type: string;
    type_string: string;
}

interface SearchResultType {
    actions: ActionType[];
}

const ActionSearchBarComponent = forwardRef<HTMLInputElement | null>(
    (_, ref) => {
        const navigate = useNavigate();
        const [searchParams] = useSearchParams();
        const searchQuery = searchParams.get("query") || "";
        const [query, setQuery] = useState(searchQuery);
        const [result, setResult] = useState<SearchResultType | null>(null);
        const [isFocused, setIsFocused] = useState(false);
        const debouncedQuery = useDebounce(query, 200);
        const containerRef = useRef<HTMLDivElement>(null);

        const { data, isLoading } = useAllUtility();

        const getSearchSuggestion = useCallback(() => {
            const searchSuggestion =
                (data?.data?.suggestions as ActionType[]) || [];
            return searchSuggestion;
        }, [data]);

        useEffect(() => {
            if (!isFocused) {
                setResult(null);
                return;
            }

            if (isLoading && !data) return;

            const searchQueries = getSearchSuggestion();

            if (!debouncedQuery) {
                setResult({ actions: searchQueries });
                return;
            }

            const normalizedQuery = debouncedQuery.toLowerCase().trim();
            const filteredActions = searchQueries?.filter(
                (action: ActionType) => {
                    const searchableText = action.query.toLowerCase();
                    return searchableText.includes(normalizedQuery);
                },
            );

            setResult({ actions: filteredActions });
        }, [debouncedQuery, isFocused, isLoading, getSearchSuggestion, data]);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node)
                ) {
                    setIsFocused(false);
                }
            };

            if (isFocused) {
                document.addEventListener("mousedown", handleClickOutside);
            }

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [isFocused]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
        };

        const container = {
            hidden: { opacity: 0, height: 0 },
            show: {
                opacity: 1,
                height: "auto",
                transition: {
                    height: {
                        duration: 0.4,
                    },
                    staggerChildren: 0.1,
                },
            },
            exit: {
                opacity: 0,
                height: 0,
                transition: {
                    height: {
                        duration: 0.3,
                    },
                    opacity: {
                        duration: 0.2,
                    },
                },
            },
        };

        const item = {
            hidden: { opacity: 0, y: 20 },
            show: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.3,
                },
            },
            exit: {
                opacity: 0,
                y: -10,
                transition: {
                    duration: 0.2,
                },
            },
        };

        const handleFocus = () => {
            setIsFocused(true);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleSearch({
                    id: "",
                    query: query,
                    count: 0,
                    type: "",
                    type_string: "",
                });
            }
            if (e.key === "Escape") {
                setIsFocused(false);
                setQuery("");
            }
        };

        const handleSearch = useCallback(
            (action: ActionType) => {
                if (!action?.query) return;
                navigate(
                    `/search?query=${action?.query}${
                        action?.type?.trim() ? `&type=${action?.type}` : ""
                    }`,
                );
            },
            [navigate],
        );

        return (
            <div
                className="w-full max-w-xl mx-auto relative"
                ref={containerRef}
            >
                <div className="relative">
                    <Input
                        ref={ref || undefined}
                        type="text"
                        placeholder={"Search for Products..."}
                        value={query}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={() =>
                            setTimeout(() => setIsFocused(false), 200)
                        }
                        onKeyDown={handleKeyDown}
                        className="pl-3 pr-9 py-2 h-10 text-base rounded-md focus-visible:ring-offset-0 w-full bg-background"
                    />

                    <div
                        className={cn(
                            "absolute bg-primary right-0 top-1/2 -translate-y-1/2 h-full rounded-r-sm w-14",
                            isFocused && "border border-primary",
                        )}
                    >
                        <button
                            key="search"
                            onClick={() =>
                                handleSearch({
                                    id: "",
                                    query: query,
                                    count: 0,
                                    type: "",
                                    type_string: "",
                                })
                            }
                            className="w-full h-full flex items-center justify-center cursor-pointer border border-primary rounded-r-md"
                        >
                            <Search className="w-5 h-5 text-primary-foreground" />
                        </button>
                    </div>

                    <AnimatePresence initial={false}>
                        {isFocused && result && (
                            <motion.div
                                style={{ zIndex: 1000 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden"
                                variants={container}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                            >
                                <motion.ul>
                                    {result?.actions?.length > 0 &&
                                        result?.actions?.map(
                                            (action: ActionType) => (
                                                <motion.li
                                                    key={action?.id}
                                                    className="px-3 py-2 flex items-center justify-between hover:bg-accent cursor-pointer"
                                                    variants={item}
                                                    layout
                                                    onClick={() =>
                                                        handleSearch(action)
                                                    }
                                                >
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {action?.query}
                                                    </span>

                                                    <MoveUpRight className="w-4 h-4 font-bold text-muted-foreground" />
                                                </motion.li>
                                            ),
                                        )}
                                </motion.ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    },
);

ActionSearchBarComponent.displayName = "ActionSearchBar";

export const ActionSearchBar = memo(ActionSearchBarComponent);
