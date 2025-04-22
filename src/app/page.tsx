"use client";

import { useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Search, Trophy } from "lucide-react";
import { CountrySwitcher } from "@/src/components/country-switcher";
import { Country, COUNTRY_CODES } from "../constants/countries";
import dynamic from "next/dynamic";
import { Metric, METRICS } from "../constants/metrics";
import { useQueryStates, parseAsString } from "nuqs";

const DynamicLeaderboardContent = dynamic(
  () => import("@/src/components/leaderboard-content"),
  { ssr: false }
);

export default function Home() {
  // Define URL query state parameters
  const [{ country, search, metric }, setQueryStates] = useQueryStates({
    country: parseAsString,
    search: parseAsString,
    metric: parseAsString
  });

  // Initialize default values if not present in URL
  useEffect(() => {
    const updates: Partial<{ country: string, search: string, metric: string }> = {};
    
    // Set default country from localStorage or use first country
    if (!country) {
      const storedCountryId = localStorage.getItem("selectedCountry");
      updates.country = storedCountryId || COUNTRY_CODES[0].id.toString();
    }
    
    // Set default metric if not in URL
    if (!metric || !Object.keys(METRICS).includes(metric)) {
      updates.metric = "zeroToHundred";
    }
    
    // Apply updates if we have any
    if (Object.keys(updates).length > 0) {
      setQueryStates(updates);
    }
  }, [country, metric, setQueryStates]);

  const handleCountryChange = (countryId: string) => {
    setQueryStates({ country: countryId });
    localStorage.setItem("selectedCountry", countryId);
  };

  const handleSearch = (value: string) => {
    setQueryStates({ search: value });
  };

  const handleMetricChange = (value: string) => {
    if (Object.keys(METRICS).includes(value)) {
      setQueryStates({ metric: value });
    }
  };

  // Find the current country object
  const currentCountry = COUNTRY_CODES.find(
    (c) => c.id.toString() === country
  ) || COUNTRY_CODES[0];
  
  // Ensure metric is valid
  const currentMetric = (Object.keys(METRICS).includes(metric || "") ? metric : "zeroToHundred") as Metric;

  return (
    <Card className="overflow-hidden border-none bg-background/60 shadow-lg backdrop-blur-sm">
      <CardHeader className="border-b bg-muted/30 px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle>Performance Leaderboard</CardTitle>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <CountrySwitcher
              selectedCountry={currentCountry}
              onCountryChange={handleCountryChange}
            />
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cars..."
                className="pl-8 w-full sm:w-[200px]"
                value={search || ""}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          value={currentMetric}
          onValueChange={handleMetricChange}
          className="w-full"
        >
          <div className="border-b px-6">
            <TabsList className="flex h-12 w-full justify-start rounded-none border-b-0 bg-transparent p-0">
              {Object.entries(METRICS).map(([key, metricInfo]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  {metricInfo.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(METRICS).map(([key]) => (
            <TabsContent key={key} value={key} className="p-0">
              <DynamicLeaderboardContent
                selectedCountry={currentCountry}
                currentMetric={key as Metric}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
