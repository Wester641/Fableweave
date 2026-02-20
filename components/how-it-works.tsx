import Image from "next/image"

const steps = [
  {
    number: "01",
    title: "Tell Us About Your Child",
    description:
      "Enter their name, choose an age range, and describe a theme or character they'd love.",
  },
  {
    number: "02",
    title: "Our AI Weaves the Story",
    description:
      "In seconds, our storytelling engine creates a unique, richly detailed fairy tale.",
  },
  {
    number: "03",
    title: "Read & Enjoy Together",
    description:
      "Curl up and share the magic. Save, print, or read it aloud at bedtime.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-4 py-16 md:px-6 md:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Image */}
        <div className="relative mx-auto max-w-sm md:max-w-none">
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-accent/10" />
          <Image
            src="/images/storybook-pages.jpg"
            alt="A beautifully illustrated children's storybook on a cozy wooden table"
            width={520}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
            Three simple steps to a story your child will treasure.
          </p>

          <div className="mt-10 flex flex-col gap-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm font-bold text-primary-foreground">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
