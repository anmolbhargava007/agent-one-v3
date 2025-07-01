import { useState } from "react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ExternalLink, Search, X, Filter } from "lucide-react";
import { marketPlaceItems } from "@/data/mockData";
import { MarketplaceItem } from "@/types";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [sortBy, setSortBy] = useState(""); // NEW STATE

  const filteredItems = marketPlaceItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    const matchesPricing =
      pricingFilter === "all" || item.pricing === pricingFilter;

    return matchesSearch && matchesCategory && matchesPricing;
  });

  // Sort after filtering
  let sortedItems = [...filteredItems];
  if (sortBy === "featured") {
    sortedItems = sortedItems.filter((item) => item.featured);
  } else if (sortBy === "popular") {
    sortedItems.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
  } else if (sortBy === "newest") {
    sortedItems.sort(
      (a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
    );
  }

  const categories = ["all", ...new Set(marketPlaceItems.map((i) => i.category))];
  const pricingOptions = ["all", ...new Set(marketPlaceItems.map((i) => i.pricing))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and discover business applications
          </p>
        </div>
        {/* <Button>
          <ExternalLink className="mr-2 h-4 w-4" /> Submit Solution
        </Button> */}
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex gap-1.5 items-center">
              <Filter className="h-3.5 w-3.5" />
              <span>Category:</span>
              <select
                className="bg-transparent border-none focus:outline-none text-primary"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All" : category}
                  </option>
                ))}
              </select>
            </Button>

            <Button variant="outline" size="sm" className="flex gap-1.5 items-center">
              <Filter className="h-3.5 w-3.5" />
              <span>Pricing:</span>
              <select
                className="bg-transparent border-none focus:outline-none text-primary"
                value={pricingFilter}
                onChange={(e) => setPricingFilter(e.target.value)}
              >
                {pricingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All" : option}
                  </option>
                ))}
              </select>
            </Button>

            {(categoryFilter !== "all" || pricingFilter !== "all" || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryFilter("all");
                  setPricingFilter("all");
                  setSearchQuery("");
                }}
              >
                <X className="h-4 w-4 mr-1" /> Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* <Tabs value={sortBy} onValueChange={setSortBy}>
          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="newest">Newest</TabsTrigger>
          </TabsList>
        </Tabs> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => <MarketplaceItemCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No items found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Try changing your filters or search term.
            </p>
            <Button onClick={() => {
              setCategoryFilter("all");
              setPricingFilter("all");
              setSearchQuery("");
            }}>
              <X className="mr-2 h-4 w-4" /> Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
interface MarketplaceItemCardProps {
  item: MarketplaceItem;
}

const MarketplaceItemCard = ({ item }: MarketplaceItemCardProps) => {
  return (
    <Card className="overflow-hidden">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-40 object-cover border-b"
        />
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{item.name}</CardTitle>
          <Badge variant={item.pricing === "Free" ? "outline" : "default"}>
            {item.pricing}
          </Badge>
        </div>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{item.category}</p>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4 pb-4 border-t">
        <span className="text-sm font-medium">{item.provider}</span>

        <Button asChild variant="default">
          <Link to={item.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" /> Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Marketplace;