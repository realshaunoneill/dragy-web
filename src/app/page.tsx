"use client";

import { useState, useEffect } from "react";
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

const DynamicLeaderboardContent = dynamic(
  () => import("@/src/components/leaderboard-content"),
  { ssr: false }
);

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRY_CODES[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMetric, setCurrentMetric] = useState<Metric>("zeroToHundred");

  // Get selected country from local storage
  useEffect(() => {
    const storedCountryId = localStorage.getItem("selectedCountry");
    if (storedCountryId) {
      setSelectedCountry(
        COUNTRY_CODES.find(
          (country) => country.id.toString() === storedCountryId
        ) || COUNTRY_CODES[0]
      );
    }
  }, []);

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(
      COUNTRY_CODES.find((country) => country.id.toString() === countryId) ||
        COUNTRY_CODES[0]
    );
    localStorage.setItem("selectedCountry", countryId);
  };

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
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
            />
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cars..."
                className="pl-8 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue="zeroToHundred"
          onValueChange={(value) => setCurrentMetric(value as Metric)}
          className="w-full"
        >
          <div className="border-b px-6">
            <TabsList className="flex h-12 w-full justify-start rounded-none border-b-0 bg-transparent p-0">
              {Object.entries(METRICS).map(([key, metric]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  {metric.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(METRICS).map(([key]) => (
            <TabsContent key={key} value={key} className="p-0">
              <DynamicLeaderboardContent
                selectedCountry={selectedCountry}
                currentMetric={key as Metric}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
