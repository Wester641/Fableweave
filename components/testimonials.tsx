import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    role: "Mom of two",
    quote:
      "My daughter asks for a Fableweave story every single night now. She loves hearing her name in the adventure!",
  },
  {
    name: "James T.",
    role: "Father of a 5-year-old",
    quote:
      "The stories are surprisingly well-written and always carry a sweet lesson. It's become our favorite bedtime tradition.",
  },
  {
    name: "Priya K.",
    role: "Preschool teacher",
    quote:
      "I use this in my classroom to get kids excited about reading. They light up when the hero has their name.",
  },
]

export function Testimonials() {
  return (
    <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Loved by Families Everywhere
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
            Here's what parents and educators are saying.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
