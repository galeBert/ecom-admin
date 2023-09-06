import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;

  const addressComponent = [
    address?.city,
    address?.line1,
    address?.line2,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponent
    .filter((adrs) => adrs !== null)
    .join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      data: {
        isPaid: true,
        address: addressString,
        phone: session.customer_details?.phone ?? "",
      },
      where: {
        id: session?.metadata?.orderId,
      },
      include: {
        orderItems: true,
      },
    });

    const productIds = order.orderItems.map((order) => order.productId);

    await prismadb.product.updateMany({
      data: { isArchived: true },
      where: { id: { in: [...productIds] } },
    });
  }
  return new NextResponse(null, { status: 200 });
}