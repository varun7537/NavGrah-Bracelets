"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "../../styles/Custombraceletjourney.module.css";
import { formatINR } from "../../lib/Currency";
import { usePrefersReducedMotion } from "../../lib/Useprefersreducedmotion";
import PaymentButton from "../Customized/PaymentButton";
import {
  AstrologerRecommendation,
  AstrologyDetails,
  CustomBraceletProduct,
  EMPTY_ASTROLOGY_DETAILS,
  FinalPaymentResult,
  Gender,
  StoneOption,
} from "../../data/Custombracelet";

export interface CustomBraceletJourneyProps {
  product: CustomBraceletProduct;
  stoneOptions: StoneOption[];
  /** Defaults to ₹150 per the standard consultation flow. */
  tokenAmount?: number;
  /** Hand the customer's kundli / details / stone picks (and, if they
   * uploaded one, their existing kundli file) to the astrologer backend and
   * resolve with the recommendation once ready. */
  onSubmitAstrologyDetails: (
    details: AstrologyDetails,
    kundliFile: File | null
  ) => Promise<AstrologerRecommendation>;
  /** Called once the final payment has gone through, to actually place the
   * order in your system and get back an order id. */
  onOrderConfirm: (payload: {
    tokenPaymentId: string;
    finalPaymentId: string;
    recommendation: AstrologerRecommendation;
    details: AstrologyDetails;
  }) => Promise<FinalPaymentResult>;
  className?: string;
}

type StepKey = "payment" | "details" | "consultation" | "recommendation" | "confirmed";

const STEP_ORDER: Exclude<StepKey, "confirmed">[] = ["payment", "details", "consultation", "recommendation"];

const DEFAULT_TOKEN_AMOUNT = 150;
const MAX_KUNDLI_FILE_MB = 10;

type FormErrors = Partial<Record<keyof AstrologyDetails, string>> & { kundliFile?: string };

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.replace(/\s|-/g, ""));
}

function validateDetails(details: AstrologyDetails, kundliFile: File | null): FormErrors {
  const errors: FormErrors = {};

  if (!details.fullName.trim()) {
    errors.fullName = "Enter the name to use for the reading.";
  }
  if (!details.gender) {
    errors.gender = "Select one.";
  }
  if (!details.phone.trim()) {
    errors.phone = "Enter a phone number so the astrologer can reach you.";
  } else if (!isValidPhone(details.phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }
  if (details.email.trim() && !isValidEmail(details.email)) {
    errors.email = "Enter a valid email, or leave it blank.";
  }

  if (details.kundliMode === "manual") {
    if (!details.dob) {
      errors.dob = "Enter a date of birth.";
    } else if (new Date(details.dob).getTime() > Date.now()) {
      errors.dob = "Date of birth can’t be in the future.";
    }
    if (!details.timeUnknown && !details.timeOfBirth) {
      errors.timeOfBirth = "Enter a time, or mark it as unknown.";
    }
    if (!details.placeOfBirth.trim()) {
      errors.placeOfBirth = "Enter a city, state and country.";
    }
  } else {
    if (!kundliFile) {
      errors.kundliFile = "Upload your kundli, or switch to entering details manually.";
    }
  }

  if (!details.noStonePreference && details.stonePreferences.length === 0) {
    errors.stonePreferences = "Pick at least one stone, or choose “Let the astrologer decide.”";
  }

  return errors;
}

export default function CustomBraceletJourney({
  product,
  stoneOptions,
  tokenAmount = DEFAULT_TOKEN_AMOUNT,
  onSubmitAstrologyDetails,
  onOrderConfirm,
  className = "",
}: CustomBraceletJourneyProps) {
  const reducedMotion = usePrefersReducedMotion();
  const headingId = useId();
  const fileInputId = useId();

  const [step, setStep] = useState<StepKey>("payment");

  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenPaymentId, setTokenPaymentId] = useState<string | null>(null);

  const [details, setDetails] = useState<AstrologyDetails>(EMPTY_ASTROLOGY_DETAILS);
  const [kundliFile, setKundliFile] = useState<File | null>(null);
  const [kundliPreviewUrl, setKundliPreviewUrl] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [isWaitingForAstrologer, setIsWaitingForAstrologer] = useState(false);
  const [consultationError, setConsultationError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<AstrologerRecommendation | null>(null);

  const [finalError, setFinalError] = useState<string | null>(null);
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (kundliPreviewUrl) URL.revokeObjectURL(kundliPreviewUrl);
    };
  }, [kundliPreviewUrl]);

  const currentStepIndex = STEP_ORDER.indexOf(step as (typeof STEP_ORDER)[number]);

  const remainingAmount = useMemo(() => {
    if (!recommendation) return 0;
    return Math.max(recommendation.finalAmount - tokenAmount, 0);
  }, [recommendation, tokenAmount]);

  const updateDetail = useCallback(
    <K extends keyof AstrologyDetails>(key: K, value: AstrologyDetails[K]) => {
      setDetails((prev) => ({ ...prev, [key]: value }));
      setFormErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    },
    []
  );

  const toggleStone = useCallback((stoneId: string) => {
    setDetails((prev) => {
      const has = prev.stonePreferences.includes(stoneId);
      return {
        ...prev,
        stonePreferences: has
          ? prev.stonePreferences.filter((id) => id !== stoneId)
          : [...prev.stonePreferences, stoneId],
      };
    });
    setFormErrors((prev) => (prev.stonePreferences ? { ...prev, stonePreferences: undefined } : prev));
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) return;

      if (file.size > MAX_KUNDLI_FILE_MB * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, kundliFile: `Keep the file under ${MAX_KUNDLI_FILE_MB}MB.` }));
        return;
      }

      if (kundliPreviewUrl) URL.revokeObjectURL(kundliPreviewUrl);
      setKundliFile(file);
      setKundliPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
      updateDetail("kundliFileName", file.name);
      setFormErrors((prev) => ({ ...prev, kundliFile: undefined }));
    },
    [kundliPreviewUrl, updateDetail]
  );

  const clearFile = useCallback(() => {
    if (kundliPreviewUrl) URL.revokeObjectURL(kundliPreviewUrl);
    setKundliFile(null);
    setKundliPreviewUrl(null);
    updateDetail("kundliFileName", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [kundliPreviewUrl, updateDetail]);

  const runConsultation = useCallback(
    async (submitted: AstrologyDetails, file: File | null) => {
      setStep("consultation");
      setIsWaitingForAstrologer(true);
      setConsultationError(null);
      try {
        const result = await onSubmitAstrologyDetails(submitted, file);
        setRecommendation(result);
        setStep("recommendation");
      } catch (err) {
        setConsultationError(
          err instanceof Error ? err.message : "The astrologer couldn’t be reached. Please try again."
        );
      } finally {
        setIsWaitingForAstrologer(false);
      }
    },
    [onSubmitAstrologyDetails]
  );

  const handleDetailsSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errors = validateDetails(details, kundliFile);
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) return;
      void runConsultation(details, kundliFile);
    },
    [details, kundliFile, runConsultation]
  );

  const handleFinalPaymentSuccess = useCallback(
    async (finalPaymentId: string) => {
      if (!recommendation || !tokenPaymentId) return;
      setIsFinalizingOrder(true);
      setFinalError(null);
      try {
        const result = await onOrderConfirm({
          tokenPaymentId,
          finalPaymentId,
          recommendation,
          details,
        });
        if (result.success) {
          setOrderId(result.orderId ?? null);
          setStep("confirmed");
        } else {
          setFinalError(result.errorMessage ?? "The order couldn’t be placed. Please try again.");
        }
      } catch (err) {
        setFinalError(err instanceof Error ? err.message : "The order couldn’t be placed. Please try again.");
      } finally {
        setIsFinalizingOrder(false);
      }
    },
    [recommendation, tokenPaymentId, details, onOrderConfirm]
  );

  return (
    <div className={className} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        Customize your bracelet
      </h2>

      <div className="space-y-4">
        {/* Step 1 — Token payment */}
        <StepCard
          number={1}
          title="Pay the ₹150 consultation token"
          description="Reserves time with one of our astrologers and is adjusted against your final bill."
          status={step === "payment" ? "current" : "done"}
          summary={step !== "payment" ? `Token paid${tokenPaymentId ? ` • ${tokenPaymentId}` : ""}` : undefined}
        >
          <p className="text-sm leading-6 text-[#6d6259]">
            You only pay the remaining balance once you’ve seen and approved the astrologer’s
            recommendation.
          </p>
          {tokenError && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {tokenError}
            </p>
          )}
          <div className="mt-5">
            <PaymentButton
              amount={tokenAmount}
              handle={product.id}
              purpose="token"
              variant="light"
              onSuccess={(paymentId) => {
                setTokenPaymentId(paymentId);
                setTokenError(null);
                setStep("details");
              }}
              onFailure={(message) => setTokenError(message)}
            />
          </div>
        </StepCard>

        {/* Step 2 — Kundli, personal details, stone preferences */}
        <StepCard
          number={2}
          title="Share your kundli and stone preferences"
          description="Type in your birth details, or upload a kundli you already have."
          status={step === "details" ? "current" : currentStepIndex > 1 || step === "confirmed" ? "done" : "upcoming"}
          summary={
            currentStepIndex > 1 || step === "confirmed"
              ? `Shared for ${details.fullName || "you"}`
              : undefined
          }
        >
          <form onSubmit={handleDetailsSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_220px]">
            <div className="space-y-5">
              <Field label="Full name" htmlFor="fullName" error={formErrors.fullName}>
                <input
                  id="fullName"
                  type="text"
                  className={inputClass}
                  value={details.fullName}
                  onChange={(e) => updateDetail("fullName", e.target.value)}
                />
              </Field>

              <fieldset>
                <legend className={labelClass}>Gender</legend>
                <div className="mt-2 flex gap-4">
                  {(["female", "male", "other"] as Gender[]).map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm text-[#241c16]">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={details.gender === g}
                        onChange={() => updateDetail("gender", g)}
                      />
                      {g === "female" ? "Female" : g === "male" ? "Male" : "Other"}
                    </label>
                  ))}
                </div>
                {formErrors.gender && <p className={errorClass}>{formErrors.gender}</p>}
              </fieldset>

              <Field label="Phone number" htmlFor="phone" error={formErrors.phone}>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  className={inputClass}
                  value={details.phone}
                  onChange={(e) => updateDetail("phone", e.target.value)}
                />
              </Field>

              <Field label="Email (optional)" htmlFor="email" error={formErrors.email}>
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  value={details.email}
                  onChange={(e) => updateDetail("email", e.target.value)}
                />
              </Field>

              {/* Kundli: manual vs upload */}
              <div>
                <span className={labelClass}>Your kundli</span>
                <div className="mt-2 inline-flex rounded-full border border-[#e7dfd5] bg-[#faf8f4] p-1 text-sm">
                  <button
                    type="button"
                    onClick={() => updateDetail("kundliMode", "manual")}
                    className={`rounded-full px-4 py-1.5 font-medium transition ${
                      details.kundliMode === "manual" ? "bg-[#211b17] text-white" : "text-[#6d6259]"
                    }`}
                  >
                    Enter details
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDetail("kundliMode", "upload")}
                    className={`rounded-full px-4 py-1.5 font-medium transition ${
                      details.kundliMode === "upload" ? "bg-[#211b17] text-white" : "text-[#6d6259]"
                    }`}
                  >
                    Upload kundli
                  </button>
                </div>

                {details.kundliMode === "manual" ? (
                  <div className="mt-4 space-y-5">
                    <Field label="Date of birth" htmlFor="dob" error={formErrors.dob}>
                      <input
                        id="dob"
                        type="date"
                        className={inputClass}
                        value={details.dob}
                        max={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => updateDetail("dob", e.target.value)}
                      />
                    </Field>

                    <Field
                      label="Time of birth"
                      htmlFor="timeOfBirth"
                      error={formErrors.timeOfBirth}
                      hint="As accurate as possible — it affects the reading."
                    >
                      <input
                        id="timeOfBirth"
                        type="time"
                        className={inputClass}
                        value={details.timeOfBirth}
                        disabled={details.timeUnknown}
                        onChange={(e) => updateDetail("timeOfBirth", e.target.value)}
                      />
                      <label className="mt-2 flex items-center gap-2 text-sm text-[#6d6259]">
                        <input
                          type="checkbox"
                          checked={details.timeUnknown}
                          onChange={(e) => updateDetail("timeUnknown", e.target.checked)}
                        />
                        I don’t know my exact time of birth
                      </label>
                    </Field>

                    <Field label="Place of birth" htmlFor="placeOfBirth" error={formErrors.placeOfBirth}>
                      <input
                        id="placeOfBirth"
                        type="text"
                        placeholder="City, state, country"
                        className={inputClass}
                        value={details.placeOfBirth}
                        onChange={(e) => updateDetail("placeOfBirth", e.target.value)}
                      />
                    </Field>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label
                      htmlFor={fileInputId}
                      className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-[#c9bba3] bg-[#faf8f4] px-4 py-8 text-center"
                    >
                      <span className="text-sm font-medium text-[#241c16]">
                        {kundliFile ? "Replace file" : "Click to upload your kundli"}
                      </span>
                      <span className="text-xs text-[#6d6259]">PDF, JPG or PNG, up to {MAX_KUNDLI_FILE_MB}MB</span>
                      <input
                        id={fileInputId}
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>

                    {kundliFile && (
                      <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#e7dfd5] bg-white p-3">
                        {kundliPreviewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={kundliPreviewUrl}
                            alt="Uploaded kundli preview"
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f3ece3] text-xs font-semibold text-[#8c6327]">
                            PDF
                          </span>
                        )}
                        <span className="flex-1 truncate text-sm text-[#241c16]">{kundliFile.name}</span>
                        <button
                          type="button"
                          onClick={clearFile}
                          className="text-xs font-medium text-[#8c6327] underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {formErrors.kundliFile && <p className={errorClass}>{formErrors.kundliFile}</p>}
                  </div>
                )}
              </div>

              <fieldset>
                <legend className={labelClass}>Stone preferences</legend>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {stoneOptions.map((stone) => {
                    const checked = details.stonePreferences.includes(stone.id);
                    return (
                      <label
                        key={stone.id}
                        className={`flex flex-col gap-1 rounded-xl border px-3 py-2 text-sm transition ${
                          checked ? "border-[#a47735] bg-[#faf3e7]" : "border-[#e7dfd5]"
                        } ${details.noStonePreference ? "opacity-50" : "cursor-pointer"}`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          disabled={details.noStonePreference}
                          onChange={() => toggleStone(stone.id)}
                        />
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                            style={{ backgroundColor: stone.swatch }}
                          />
                          {stone.label}
                        </span>
                        {stone.helper && <span className="text-xs text-[#6d6259]">{stone.helper}</span>}
                      </label>
                    );
                  })}
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm text-[#6d6259]">
                  <input
                    type="checkbox"
                    checked={details.noStonePreference}
                    onChange={(e) => updateDetail("noStonePreference", e.target.checked)}
                  />
                  Let the astrologer decide
                </label>
                {formErrors.stonePreferences && <p className={errorClass}>{formErrors.stonePreferences}</p>}
              </fieldset>

              <Field label="Anything else? (optional)" htmlFor="notes">
                <textarea
                  id="notes"
                  className={inputClass}
                  rows={3}
                  value={details.notes}
                  onChange={(e) => updateDetail("notes", e.target.value)}
                />
              </Field>

              <button
                type="submit"
                className="w-full rounded-full bg-[#211b17] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#332822] sm:w-auto sm:px-8"
              >
                Submit to the astrologer
              </button>
            </div>

            <BraceletPreview
              name={details.fullName}
              stoneOptions={stoneOptions}
              selectedStoneIds={details.stonePreferences}
              noPreference={details.noStonePreference}
            />
          </form>
        </StepCard>

        {/* Step 3 — Astrologer review */}
        <StepCard
          number={3}
          title="Astrologer review"
          description="They look over your kundli and prepare a bracelet recommendation."
          status={step === "consultation" ? "current" : currentStepIndex > 2 || step === "confirmed" ? "done" : "upcoming"}
        >
          <div className="text-center">
            {isWaitingForAstrologer && !consultationError && (
              <>
                <div
                  className={`${styles.spinner} ${reducedMotion ? styles.noMotion : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  <span className="sr-only">Waiting for the astrologer’s recommendation</span>
                </div>
                <p className="mt-4 text-sm text-[#6d6259]">
                  They’re reviewing your kundli and preparing a bracelet recommendation. This usually
                  takes a few minutes — you’ll see it here as soon as it’s ready.
                </p>
              </>
            )}

            {consultationError && (
              <div>
                <p role="alert" className="text-sm text-red-700">
                  {consultationError}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => void runConsultation(details, kundliFile)}
                    className="rounded-full bg-[#211b17] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#332822]"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="rounded-full border border-[#e7dfd5] px-6 py-3 text-sm font-semibold text-[#241c16]"
                  >
                    Edit details
                  </button>
                </div>
              </div>
            )}
          </div>
        </StepCard>

        {/* Step 4 — Recommendation & final payment */}
        <StepCard
          number={4}
          title="Your recommendation & final payment"
          description="Review what the astrologer suggests, then pay the balance to confirm."
          status={step === "recommendation" ? "current" : step === "confirmed" ? "done" : "upcoming"}
          summary={step === "confirmed" ? "Order confirmed" : undefined}
        >
          {recommendation && (
            <div>
              <p className="text-sm leading-6 text-[#241c16]">{recommendation.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {recommendation.recommendedStones.map((stoneId) => {
                  const stone = stoneOptions.find((s) => s.id === stoneId);
                  return (
                    <span
                      key={stoneId}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#e7dfd5] bg-[#faf8f4] px-3 py-1 text-xs text-[#241c16]"
                    >
                      {stone && (
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: stone.swatch }}
                        />
                      )}
                      {stone?.label ?? stoneId}
                    </span>
                  );
                })}
                {recommendation.recommendedMetal && (
                  <span className="inline-flex items-center rounded-full border border-[#e7dfd5] bg-[#faf8f4] px-3 py-1 text-xs text-[#241c16]">
                    {recommendation.recommendedMetal}
                  </span>
                )}
              </div>

              <dl className="mt-6 space-y-2 border-t border-[#e7dfd5] pt-5">
                <div className="flex items-center justify-between text-sm text-[#6d6259]">
                  <dt>Final bracelet price</dt>
                  <dd className="tabular-nums">{formatINR(recommendation.finalAmount)}</dd>
                </div>
                <div className="flex items-center justify-between text-sm text-[#6d6259]">
                  <dt>Token already paid</dt>
                  <dd className="tabular-nums">−{formatINR(tokenAmount)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-[#e7dfd5] pt-2 text-base font-semibold text-[#241c16]">
                  <dt>Balance due</dt>
                  <dd className="tabular-nums">{formatINR(remainingAmount)}</dd>
                </div>
              </dl>

              {finalError && (
                <p role="alert" className="mt-3 text-sm text-red-700">
                  {finalError}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <PaymentButton
                  amount={remainingAmount}
                  handle={product.id}
                  purpose="final"
                  variant="light"
                  disabled={isFinalizingOrder}
                  onSuccess={(paymentId) => void handleFinalPaymentSuccess(paymentId)}
                  onFailure={(message) => setFinalError(message)}
                />
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="rounded-full border border-[#e7dfd5] px-6 py-3.5 text-sm font-semibold text-[#241c16]"
                >
                  Ask for changes
                </button>
              </div>
            </div>
          )}
        </StepCard>

        {step === "confirmed" && (
          <div className="rounded-2xl border border-[#e7dfd5] bg-white p-8 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-[#241c16]">Your bracelet is on its way</h3>
            <p className="mt-2 text-sm text-[#6d6259]">
              {orderId ? `Order ${orderId} is confirmed.` : "Your order is confirmed."} We’ll email your
              astrologer’s full reading along with shipping updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#e7dfd5] bg-white px-3 py-2.5 text-sm text-[#241c16] outline-none transition focus:border-[#a47735] focus:ring-2 focus:ring-[#a47735]/20";
const labelClass = "block text-sm font-medium text-[#241c16]";
const errorClass = "mt-1.5 text-xs text-red-700";

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-[#6d6259]">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

type StepStatus = "done" | "current" | "upcoming";

function StepCard({
  number,
  title,
  description,
  status,
  summary,
  children,
}: {
  number: number;
  title: string;
  description: string;
  status: StepStatus;
  summary?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm transition ${
        status === "current" ? "border-[#a47735]" : "border-[#e7dfd5]"
      } ${status === "upcoming" ? "opacity-60" : ""}`}
    >
      <div className="flex gap-4 p-6 sm:gap-5">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            status === "done"
              ? "bg-[#a47735] text-white"
              : status === "current"
              ? "bg-[#211b17] text-white"
              : "bg-[#f3ece3] text-[#8c6327]"
          }`}
          aria-hidden="true"
        >
          {status === "done" ? "✓" : number}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-[#2b211a]">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-[#6d6259]">{summary ?? description}</p>

          {status === "current" && <div className="mt-5">{children}</div>}
        </div>
      </div>
    </div>
  );
}

function BraceletPreview({
  name,
  stoneOptions,
  selectedStoneIds,
  noPreference,
}: {
  name: string;
  stoneOptions: StoneOption[];
  selectedStoneIds: string[];
  noPreference: boolean;
}) {
  const selected = stoneOptions.filter((s) => selectedStoneIds.includes(s.id));

  return (
    <aside className="h-fit rounded-2xl border border-[#e7dfd5] bg-[#faf8f4] p-5 lg:sticky lg:top-6">
      <p className="text-xs font-medium uppercase tracking-wide text-[#a47735]">Live preview</p>

      <div className="mt-4 flex justify-center gap-1.5">
        {selected.length > 0
          ? selected.map((stone) => (
              <span
                key={stone.id}
                title={stone.label}
                aria-hidden="true"
                className="h-6 w-6 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: stone.swatch }}
              />
            ))
          : Array.from({ length: 5 }).map((_, i) => (
              <span key={i} aria-hidden="true" className="h-6 w-6 rounded-full border-2 border-white bg-[#e7dfd5] shadow" />
            ))}
      </div>

      <p className="mt-4 text-center text-sm italic text-[#241c16]">{name.trim() || "Your name here"}</p>

      <p className="mt-2 text-center text-xs text-[#6d6259]">
        {noPreference
          ? "Astrologer will choose your stones"
          : selected.length > 0
          ? selected.map((s) => s.label).join(", ")
          : "Pick stones to preview your bracelet"}
      </p>
    </aside>
  );
}