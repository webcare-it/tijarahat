import { useGetAllBrands } from "@/api/queries/useAllBrands";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useMemo } from "react";
import { Search, Filter, RefreshCcw } from "lucide-react";
import { Label } from "../ui/label";
import type { BrandType, FilterPropsType } from "@/type";

export const FilterProduct = ({ filters, setFilters }: FilterPropsType) => {
  const { data, isLoading } = useGetAllBrands();
  const brands = data?.data as BrandType[];
  const [brandSearch, setBrandSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredBrands = useMemo(() => {
    if (!brands) return [];
    return brands?.filter((brand: BrandType) =>
      brand?.name?.toLowerCase()?.includes(brandSearch?.toLowerCase())
    );
  }, [brands, brandSearch]);

  const handleBrandChange = (brandId: string) => {
    if (brandId === "all") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { brand: _, ...rest } = filters;
      setFilters({ ...rest, page: 1 });
    } else {
      setFilters({ ...filters, brand: brandId, page: 1 });
    }
    setIsSheetOpen(false);
  };

  const handleSortChange = (sortBy: string) => {
    if (sortBy === "default") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sort: _, ...rest } = filters;
      setFilters({ ...rest, page: 1 });
    } else {
      setFilters({ ...filters, sort: sortBy, page: 1 });
    }
    setIsSheetOpen(false);
  };

  const clearFilters = () => {
    setFilters({ page: 1 });
    setBrandSearch("");
    setIsSheetOpen(false);
  };

  const sortOptions = [
    { value: "default", label: "Sort By" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    {
      value: "price_low_to_high",
      label: "Low to High",
    },
    {
      value: "price_high_to_low",
      label: "High to Low",
    },
  ];

  const BrandFilter = ({ isLabel = true }: { isLabel?: boolean }) => (
    <div className="space-y-3">
      {isLabel && <Label htmlFor="brand-filter">{"Filter by Brand"}</Label>}
      <Select
        value={(filters?.brand as string) || "all"}
        onValueChange={handleBrandChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={"Select Brand"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{"All Brands"}</SelectItem>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              {"Loading brands..."}
            </SelectItem>
          ) : (
            <>
              <div className="py-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="brand-filter"
                    name="brand-filter"
                    placeholder={"Search brands..."}
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="pl-8 h-8"
                  />
                </div>
              </div>
              {filteredBrands?.length > 0 &&
                filteredBrands?.map((brand: BrandType) => (
                  <SelectItem key={brand?.id} value={brand?.id?.toString()}>
                    {brand?.name}
                  </SelectItem>
                ))}
              {filteredBrands?.length === 0 && brandSearch && (
                <SelectItem
                  value="no-results"
                  disabled
                  className="text-muted-foreground">
                  {"No brands found"}
                </SelectItem>
              )}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );

  const SortFilter = ({ isLabel = true }: { isLabel?: boolean }) => (
    <div className="space-y-3">
      {isLabel && <Label htmlFor="sort-filter">{"Sort By"}</Label>}
      <Select
        value={(filters?.sort as string) || "default"}
        onValueChange={handleSortChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={"Sort By"} />
        </SelectTrigger>
        <SelectContent>
          {sortOptions?.map((option: { value: string; label: string }) => (
            <SelectItem key={option?.value} value={option?.value}>
              {option?.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <>
      <div className="md:hidden pr-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="size-4 text-muted-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>{"Filter Products"}</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col justify-between h-full mx-4">
              <div className="space-y-4">
                <BrandFilter />
                <SortFilter />
              </div>

              <div className="mb-4">
                <Button
                  variant="destructive"
                  onClick={clearFilters}
                  className="w-full gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  {"Clear All Filters"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex flex-col gap-2 min-w-[200px]">
          <BrandFilter isLabel={false} />
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <SortFilter isLabel={false} />
        </div>
        <div>
          <Button
            variant="destructive"
            onClick={clearFilters}
            className="w-full gap-2">
            <RefreshCcw className="h-4 w-4" />
            {"Reset"}
          </Button>
        </div>
      </div>
    </>
  );
};
