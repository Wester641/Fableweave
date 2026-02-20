import { Book } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-10 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Book className="size-5 text-primary" />
          <span className="font-serif text-lg font-bold text-foreground">
            Fableweave
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#create"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Create a Story
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </a>
        </nav>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Fableweave. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
