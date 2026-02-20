"use client"

import Image from "next/image"
import { track } from "@vercel/analytics"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-20">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* Text content */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary">
              AI-Powered Storytelling
            </span>
          </div>

          <h1 className="text-balance font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Magical bedtime stories, crafted just for your child
          </h1>

          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:mt-6 md:text-lg">
            Fableweave uses AI to create personalized fairy tales starring your
            little one. Simply tell us their name, age, and a theme they love
            &mdash; and watch the magic unfold.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-start">
            <Button size="lg" asChild>
              <a href="#create" onClick={() => track("cta_clicked", { label: "create_story" })}>Create a Free Story</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#how-it-works" onClick={() => track("cta_clicked", { label: "how_it_works" })}>See How It Works</a>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No account required. Your first story is free.
          </p>
        </div>

        {/* Hero image */}
        <div className="order-1 md:order-2">
          <div className="relative mx-auto max-w-md md:max-w-none">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/5" />
            <Image
              src="/images/hero-fairytale.jpg"
              alt="An open magical storybook glowing with golden light surrounded by enchanted forest creatures"
              width={600}
              height={450}
              className="rounded-2xl shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
