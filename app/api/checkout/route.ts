import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const baseUrl =
  process.env.NEXT_PUBLIC_URL_PRODUCTION ?? process.env.NEXT_PUBLIC_URL;

export async function POST(req: NextRequest) {
  const { storyId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1T3ODtRGrtkZmI1mf5emntvP",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&story_id=${storyId}`,
    cancel_url: `${baseUrl}/`,
  });

  return NextResponse.json({ url: session.url });
}
