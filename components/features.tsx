import { BookOpen, Sparkles, Heart, Shield } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Personalized Characters",
    description:
      "Your child becomes the hero of every story, with details woven naturally into the narrative.",
  },
  {
    icon: BookOpen,
    title: "Age-Appropriate Content",
    description:
      "Stories are tailored to your child's age, using vocabulary and themes that fit their world.",
  },
  {
    icon: Heart,
    title: "Gentle Life Lessons",
    description:
      "Each tale carries a warm moral, teaching kindness, courage, and curiosity through adventure.",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    description:
      "No data is stored. Stories are generated on the fly and stay between you and your family.",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            Why Families Love Fableweave
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
            Thoughtfully designed for parents and children alike.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
