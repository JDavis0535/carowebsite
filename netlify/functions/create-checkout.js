// Creates a Stripe Checkout session from the cart.
// Prices come from pricing.json (server-side) — client-sent prices are ignored,
// so the total can't be tampered with.
import Stripe from "stripe";
import pricing from "./pricing.json";

// --- Shipping: change or set to 0 for free shipping ---
const SHIPPING_CENTS = 600; // $6.00 flat
const SHIP_COUNTRIES = ["US", "CA", "GB", "AU"];

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json(500, { error: "Checkout isn't set up yet — no Stripe key configured." });

  let items;
  try {
    items = JSON.parse(event.body || "{}").items;
  } catch {
    return json(400, { error: "Invalid request." });
  }
  if (!Array.isArray(items) || items.length === 0) return json(400, { error: "Your cart is empty." });

  const origin = `https://${event.headers.host}`;
  const stripe = new Stripe(key);

  const line_items = [];
  for (const it of items) {
    const product = pricing[it?.id];
    if (!product) continue;
    const qty = Math.max(1, Math.min(20, parseInt(it.qty, 10) || 1));
    const size = typeof it.size === "string" ? it.size.slice(0, 60) : "";
    const image = product.image?.startsWith("http")
      ? product.image
      : product.image
        ? origin + product.image
        : undefined;

    line_items.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: size ? `${product.name} — ${size}` : product.name,
          images: image ? [image] : undefined,
        },
      },
    });
  }
  if (line_items.length === 0) return json(400, { error: "No valid items in cart." });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store`,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: SHIP_COUNTRIES },
      shipping_options: SHIPPING_CENTS > 0
        ? [{
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: SHIPPING_CENTS, currency: "usd" },
              display_name: "Standard shipping",
            },
          }]
        : undefined,
    });
    return json(200, { url: session.url });
  } catch (err) {
    return json(500, { error: "Could not start checkout. Please try again." });
  }
};
