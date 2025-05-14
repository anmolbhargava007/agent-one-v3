
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { ShoppingBag, Bot, Database, Clock, Star, ExternalLink, Search, Download, X, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockMarketplaceItems } from "@/data/mockData";
import { MarketplaceItem } from "@/types";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [pricingFilter, setPricingFilter] = useState<string>("all");
  
  // Filter marketplace items based on filters
  const filteredItems = mockMarketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesPricing = pricingFilter === "all" || item.pricing === pricingFilter;
    
    return matchesSearch && matchesCategory && matchesType && matchesPricing;
  });
  
  // Get unique categories, types, and pricing options for filters
  const categories = ["all", ...Array.from(new Set(mockMarketplaceItems.map(item => item.category)))];
  const types = ["all", ...Array.from(new Set(mockMarketplaceItems.map(item => item.type)))];
  const pricingOptions = ["all", ...Array.from(new Set(mockMarketplaceItems.map(item => item.pricing)))];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and discover solutions, models, and integrations
          </p>
        </div>
        <Button>
          <ExternalLink className="mr-2 h-4 w-4" /> Submit Solution
        </Button>
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
            <Button 
              variant="outline"
              size="sm"
              className="flex gap-1.5 items-center"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Category:</span>
              <select 
                className="bg-transparent border-none focus:outline-none text-primary"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All" : category}
                  </option>
                ))}
              </select>
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="flex gap-1.5 items-center"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Type:</span>
              <select 
                className="bg-transparent border-none focus:outline-none text-primary"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === "all" ? "All" : type}
                  </option>
                ))}
              </select>
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="flex gap-1.5 items-center"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Pricing:</span>
              <select 
                className="bg-transparent border-none focus:outline-none text-primary"
                value={pricingFilter}
                onChange={(e) => setPricingFilter(e.target.value)}
              >
                {pricingOptions.map(option => (
                  <option key={option} value={option}>
                    {option === "all" ? "All" : option}
                  </option>
                ))}
              </select>
            </Button>
            
            {(categoryFilter !== "all" || typeFilter !== "all" || pricingFilter !== "all" || searchQuery) && (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryFilter("all");
                  setTypeFilter("all");
                  setPricingFilter("all");
                  setSearchQuery("");
                }}
              >
                <X className="h-4 w-4 mr-1" /> Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="featured">
          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="newest">Newest</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <MarketplaceItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No items found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              No marketplace items match your current filters. Try adjusting your search criteria.
            </p>
            <Button onClick={() => {
              setCategoryFilter("all");
              setTypeFilter("all");
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
  const handleDownload = () => {
    toast.success(`Started downloading ${item.name}`);
  };
  
  return (
    <Card className="overflow-hidden">
      <div className={cn(
        "h-2",
        item.type === "agent" ? "bg-primary" :
        item.type === "integration" ? "bg-orange-500" :
        item.type === "model" ? "bg-green-500" :
        item.type === "template" ? "bg-blue-500" :
        "bg-purple-500"
      )} />
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
        <div className="mb-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < Math.floor(item.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"} 
              />
            ))}
          </div>
          <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Download size={14} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {item.downloads.toLocaleString()} downloads
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 pb-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            {item.type === "agent" ? (
              <Bot size={14} className="text-primary" />
            ) : item.type === "model" ? (
              <Database size={14} className="text-green-500" />
            ) : (
              <ShoppingBag size={14} className="text-orange-500" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">{item.provider}</span>
            <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
          </div>
        </div>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Marketplace;
