"use client";

import React, { useState } from "react";

export interface PaymentButtonProps {
  amount: number;
  handle: string;
  /** Distinguishes the ₹150 token charge from the final balance charge —
   * pass this through to your backend so it records the right kind of
   * payment against the order. */
  purpose?: "token" | "final";
  /** Button text. Defaults to a sensible label based on `purpose`. */
  label?: string;
  /** "dark" for use on the dark hero panel, "light" for use inside a white
   * card. Defaults to "dark" to match the original hero usage. */
  variant?: "dark" | "light";
  disabled?: boolean;
  /** Called with a payment reference once the charge succeeds. */
  onSuccess?: (paymentId: string) => void;
  /** Called with a human-readable message if the charge fails or is
   * cancelled. */
  onFailure?: (message: string) => void;
}

export default function PaymentButton({
  amount,
  handle,
  purpose = "token",
  label,
  variant = "dark",
  disabled = false,
  onSuccess,
  onFailure,
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);
    try {
      // TODO: replace this block with your real gateway integration, e.g.
      //
      //   const order = await fetch("/api/payments/create-order", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ amount, handle, purpose }),
      //   }).then((r) => r.json());
      //
      //   const rzp = new (window as any).Razorpay({
      //     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      //     amount: order.amount,
      //     order_id: order.id,
      //     handler: (response: any) => onSuccess?.(response.razorpay_payment_id),
      //     modal: { ondismiss: () => onFailure?.("Payment cancelled.") },
      //   });
      //   rzp.open();
      //
      // Simulated success below so the rest of the flow is testable end to end.
      await new Promise((resolve) => setTimeout(resolve, 900));
      onSuccess?.(`${purpose.toUpperCase()}-${handle}-${Date.now()}`);
    } catch (err) {
      onFailure?.(err instanceof Error ? err.message : "The payment didn’t go through. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const defaultLabel = purpose === "token" ? `Pay ₹${amount} & continue` : `Pay ₹${amount} & confirm order`;

  const baseClasses =
    "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8";

  const variantClasses =
    variant === "dark"
      ? "bg-[#d7ae67] text-[#211b17] hover:bg-[#e6c07d]"
      : "bg-[#211b17] text-white hover:bg-[#332822]";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={`${baseClasses} ${variantClasses}`}
    >
      {isProcessing ? "Processing…" : label ?? defaultLabel}
    </button>
  );
}