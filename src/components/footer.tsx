import Link from "next/link"
import { ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="text-sm text-muted-foreground">
            <p>
              This is not an official Dragy app. All performance data is sourced from{" "}
              <Link
                href="https://dragy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Dragy <ExternalLink className="inline h-3 w-3" />
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground hover:underline">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link href="/terms-and-conditions" className="hover:text-foreground hover:underline">
              Terms & Conditions
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link
              href="https://www.godragy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline"
            >
              Official Dragy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
