"use client";

import { Gauge, ArrowLeft } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === "/";

  return (
    <div>
      <div className="mb-8 flex flex-col items-center space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Gauge className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Dragy Web</h1>
          <ThemeSwitcher />
        </div>
        <p className="max-w-[600px] text-center text-muted-foreground">
          Compare the fastest cars based on real-world performance data
        </p>
      </div>
      {!isHomePage && (
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboard
        </Button>
      )}
    </div>
  );
}
