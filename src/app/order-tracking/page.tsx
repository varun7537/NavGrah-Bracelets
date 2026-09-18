// src/app/order-tracking/page.tsx  →  route: /order-tracking

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { PolicyPage, Section, Bullets, Callout } from "../../components/Legal/PolicyPage";
import OrderTrackingForm from "../../components/Legal/OrderTrackingForm";
import { POLICY, STORE } from "../../data/Storeinfo";

export const metadata: Metadata = {
  title: "Order tracking",
  description: "Enter your order id to see where your bracelet has reached.",
};

const sections = [
  { id: "track", title: "Track your order" },
  { id: "stages", title: "What each stage means" },
  { id: "not-moving", title: "Tracking hasn’t moved" },
  { id: "help", title: "Still stuck" },
];

export default function OrderTrackingPage() {
  return (
    <PolicyPage
      title="Order tracking"
      intro="Your order id is in the confirmation message we sent on WhatsApp and email. It starts with ORD."
      sections={sections}
      currentHref="/order-tracking"
    >
      <Section id="track" title="Track your order">
        <OrderTrackingForm />
      </Section>

      <Section id="stages" title="What each stage means">
        <Bullets
          items={[
            <>
              <strong>Astrologer finalising</strong> — your chart is being read and the stones confirmed.
              Nothing is made until this is done.
            </>,
            <>
              <strong>Being made</strong> — stones are sourced and the bracelet is strung by hand. This is
              the {POLICY.dispatchWorkingDays} working day stretch.
            </>,
            <>
              <strong>Quality check</strong> — checked, cleansed, and packed with the certificate.
            </>,
            <>
              <strong>Dispatched</strong> — with the courier, and an AWB number appears here.
            </>,
            <>
              <strong>Out for delivery</strong> — arriving today. Keep your phone reachable.
            </>,
          ]}
        />
      </Section>

      <Section id="not-moving" title="Tracking hasn’t moved">
        <p>
          Courier scans can lag by a day, especially over weekends and around festivals. Give it 48 hours
          before worrying.
        </p>
        <Bullets
          items={[
            "No update for three working days after dispatch: message us and we’ll raise it with the courier.",
            "Marked delivered but not in your hands: tell us within 48 hours, check with neighbours and your building desk first.",
            "Delivery attempted while you were out: the courier tries three times, then returns it to us.",
            <>
              Expected date has passed: see the timelines on the{" "}
              <Link href="/shipping-delivery">shipping page</Link> to check where your order should be.
            </>,
          ]}
        />
      </Section>

      <Section id="help" title="Still stuck">
        <Callout title="Message us with your order id">
          <p className="text-sm leading-6 text-[#6d6259]">
            WhatsApp {STORE.phoneDisplay} or email <a href={`mailto:${STORE.ordersEmail}`}>{STORE.ordersEmail}</a>.
            We’re on {STORE.supportHours}.
          </p>
        </Callout>
        <p>
          If a parcel is confirmed lost, we remake and resend it at no cost, or refund you in full — your
          choice. That’s covered under <Link href="/returns-refunds">returns & refunds</Link>.
        </p>
      </Section>
    </PolicyPage>
  );
}   