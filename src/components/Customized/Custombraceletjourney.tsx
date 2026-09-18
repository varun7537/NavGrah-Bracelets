// src/components/Customized/Custombraceletjourney.tsx
"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "../../styles/Custombraceletjourney.module.css";
import { formatINR } from "../../lib/Currency";
import { usePrefersReducedMotion } from "../../lib/Useprefersreducedmotion";
import PaymentButton from "./PaymentButton";
import {
  ACCEPTED_KUNDLI_TYPES,
  AstrologerRecommendation,
  AstrologyDetails,
  CustomBraceletProduct,
  EMPTY_ASTROLOGY_DETAILS,
  FOCUS_AREAS,
  FinalPaymentResult,
  FocusArea,
  Gender,
  MAX_KUNDLI_FILE_MB,
  MAX_STONE_SELECTION,
  StoneOption,
  WRIST_SIZES,
  WristSize,
} from "../../data/Custombracelet";

export interface CustomBraceletJourneyProps {
  product: CustomBraceletProduct;
  stoneOptions: StoneOption[];
  /** Sends the kundli / details / stone picks to the astrologer and resolves
   * with the recommendation. The consultation itself is free. */
  onSubmitAstrologyDetails: (
    details: AstrologyDetails,
    kundliFile: File | null
  ) => Promise<AstrologerRecommendation>;
  /** Places the order once the single payment has gone through. */
  onOrderConfirm: (payload: {
    paymentId: string;
    recommendation: AstrologerRecommendation;
    details: AstrologyDetails;
  }) => Promise<FinalPaymentResult>;
  className?: string;
}

type StepKey = "details" | "consultation" | "recommendation" | "confirmed";

const STEP_ORDER: Exclude<StepKey, "confirmed">[] = ["details", "consultation", "recommendation"];
const STEP_LABELS: Record<Exclude<StepKey, "confirmed">, string> = {
  details: "Your details",
  consultation: "Astrologer review",
  recommendation: "Review & pay",
};

const DRAFT_KEY = "custom-bracelet-draft-v2";
const NOTES_LIMIT = 400;

type FormErrors = Partial<Record<keyof AstrologyDetails | "kundliFile", string>>;

/** Order matters: the first error in this list is the one we scroll to. */
const ERROR_ORDER: (keyof FormErrors)[] = [
  "fullName",
  "gender",
  "phone",
  "email",
  "dob",
  "timeOfBirth",
  "placeOfBirth",
  "kundliFile",
  "stonePreferences",
  "wristSize",
  "consent",
];

const fieldId = (key: string) => `cbj-${key}`;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function isValidPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.replace(/\D/g, ""));
}

function validateDetails(details: AstrologyDetails, kundliFile: File | null): FormErrors {
  const errors: FormErrors = {};

  if (!details.fullName.trim()) {
    errors.fullName = "Enter the name to use for the reading.";
  } else if (details.fullName.trim().length < 2) {
    errors.fullName = "Enter the full name, not initials.";
  }

  if (!details.gender) errors.gender = "Select one.";

  if (!details.phone.trim()) {
    errors.phone = "Enter a mobile number so the astrologer can reach you.";
  } else if (!isValidPhone(details.phone)) {
    errors.phone = "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
  }

  if (details.email.trim() && !isValidEmail(details.email)) {
    errors.email = "Enter a valid email, or leave it blank.";
  }

  if (details.kundliMode === "manual") {
    if (!details.dob) {
      errors.dob = "Enter a date of birth.";
    } else {
      const dob = new Date(`${details.dob}T00:00:00`);
      if (Number.isNaN(dob.getTime())) {
        errors.dob = "Enter a valid date.";
      } else if (dob.getTime() > Date.now()) {
        errors.dob = "Date of birth can’t be in the future.";
      } else if (dob.getFullYear() < 1900) {
        errors.dob = "Enter a year after 1900.";
      }
    }
    if (!details.timeUnknown && !details.timeOfBirth) {
      errors.timeOfBirth = "Enter a time, or tick “I don’t know my exact time”.";
    }
    if (!details.placeOfBirth.trim()) {
      errors.placeOfBirth = "Enter city, state and country.";
    }
  } else if (!kundliFile) {
    errors.kundliFile = "Upload your kundli, or switch to entering details.";
  }

  if (!details.noStonePreference && details.stonePreferences.length === 0) {
    errors.stonePreferences = "Pick at least one stone, or let the astrologer choose.";
  }

  if (!details.wristSize) {
    errors.wristSize = "Pick a wrist size so the bracelet fits.";
  }

  if (!details.consent) {
    errors.consent = "Tick this so we can share your details with the astrologer.";
  }

  return errors;
}

export default function CustomBraceletJourney({
  product,
  stoneOptions,
  onSubmitAstrologyDetails,
  onOrderConfirm,
  className = "",
}: CustomBraceletJourneyProps) {
  const reducedMotion = usePrefersReducedMotion();
  const headingId = useId();
  const uid = useId();
  const fileInputId = `${uid}-kundli`;

  const [step, setStep] = useState<StepKey>("details");
  const [details, setDetails] = useState<AstrologyDetails>(EMPTY_ASTROLOGY_DETAILS);
  const [kundliFile, setKundliFile] = useState<File | null>(null);
  const [kundliPreviewUrl, setKundliPreviewUrl] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const [isWaitingForAstrologer, setIsWaitingForAstrologer] = useState(false);
  const [consultationError, setConsultationError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<AstrologerRecommendation | null>(null);

  const [finalError, setFinalError] = useState<string | null>(null);
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const isFirstRender = useRef(true);
  const [autoFocusStep, setAutoFocusStep] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setAutoFocusStep(true);
  }, [step]);

  /* ------------------------------ draft ------------------------------ */
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<AstrologyDetails>;
      setDetails((prev) => ({ ...prev, ...saved, consent: false, kundliFileName: null }));
      setDraftRestored(true);
    } catch {
      /* storage blocked or corrupt draft — start fresh */
    }
  }, []);

  useEffect(() => {
    if (step !== "details") return;
    const id = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(details));
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [details, step]);

  useEffect(() => {
    return () => {
      if (kundliPreviewUrl) URL.revokeObjectURL(kundliPreviewUrl);
    };
  }, [kundliPreviewUrl]);

  const currentStepIndex = step === "confirmed" ? STEP_ORDER.length : STEP_ORDER.indexOf(step);

  const statusFor = useCallback(
    (key: Exclude<StepKey, "confirmed">): StepStatus => {
      const index = STEP_ORDER.indexOf(key);
      if (step === key) return "current";
      return currentStepIndex > index ? "done" : "upcoming";
    },
    [step, currentStepIndex]
  );

  const errorList = useMemo(
    () => ERROR_ORDER.filter((key) => formErrors[key]).map((key) => ({ key, message: formErrors[key]! })),
    [formErrors]
  );

  /* ---------------------------- handlers ---------------------------- */
  const updateDetail = useCallback(
    <K extends keyof AstrologyDetails>(key: K, value: AstrologyDetails[K]) => {
      setDetails((prev) => ({ ...prev, [key]: value }));
      setFormErrors((prev) => {
        if (!prev[key as keyof FormErrors]) return prev;
        const next = { ...prev };
        delete next[key as keyof FormErrors];
        return next;
      });
    },
    []
  );

  const toggleStone = useCallback(
    (stoneId: string) => {
      setDetails((prev) => {
        const has = prev.stonePreferences.includes(stoneId);
        if (!has && prev.stonePreferences.length >= MAX_STONE_SELECTION) return prev;
        return {
          ...prev,
          stonePreferences: has
            ? prev.stonePreferences.filter((id) => id !== stoneId)
            : [...prev.stonePreferences, stoneId],
        };
      });
      setFormErrors((prev) => {
        if (!prev.stonePreferences) return prev;
        const next = { ...prev };
        delete next.stonePreferences;
        return next;
      });
    },
    []
  );

  const acceptFile = useCallback(
    (file: File | null) => {
      if (!file) return;

      if (!ACCEPTED_KUNDLI_TYPES.includes(file.type)) {
        setFormErrors((prev) => ({ ...prev, kundliFile: "Upload a PDF, JPG, PNG or WebP file." }));
        return;
      }
      if (file.size > MAX_KUNDLI_FILE_MB * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, kundliFile: `Keep the file under ${MAX_KUNDLI_FILE_MB} MB.` }));
        return;
      }

      if (kundliPreviewUrl) URL.revokeObjectURL(kundliPreviewUrl);
      setKundliFile(file);
      setKundliPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
      updateDetail("kundliFileName", file.name);
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.kundliFile;
        return next;
      });
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
          err instanceof Error ? err.message : "The astrologer couldn’t be reached. Try again in a moment."
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

      const firstKey = ERROR_ORDER.find((key) => errors[key]);
      if (firstKey) {
        // Focus the real control so screen readers and mobile keyboards land
        // on the field that needs fixing, not on the page heading.
        window.requestAnimationFrame(() => {
          const target = document.getElementById(fieldId(firstKey as string));
          if (target) {
            target.focus({ preventScroll: true });
            target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
          } else {
            errorSummaryRef.current?.focus();
          }
        });
        return;
      }

      try {
        window.sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      void runConsultation(details, kundliFile);
    },
    [details, kundliFile, reducedMotion, runConsultation]
  );

  const handlePaymentSuccess = useCallback(
    async (paymentId: string) => {
      if (!recommendation) return;
      setIsFinalizingOrder(true);
      setFinalError(null);
      try {
        const result = await onOrderConfirm({ paymentId, recommendation, details });
        if (result.success) {
          setOrderId(result.orderId ?? null);
          setStep("confirmed");
        } else {
          setFinalError(result.errorMessage ?? "The order couldn’t be placed. Your payment is safe — contact us with your payment id.");
        }
      } catch (err) {
        setFinalError(
          err instanceof Error
            ? err.message
            : "The order couldn’t be placed. Your payment is safe — contact us with your payment id."
        );
      } finally {
        setIsFinalizingOrder(false);
      }
    },
    [recommendation, details, onOrderConfirm]
  );

  const selectedStones = useMemo(
    () => stoneOptions.filter((s) => details.stonePreferences.includes(s.id)),
    [stoneOptions, details.stonePreferences]
  );

  const maxDob = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className={className} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        Customize your bracelet
      </h2>

      <StepRail current={currentStepIndex} />

      <p aria-live="polite" className="sr-only">
        {step === "confirmed" ? "Order confirmed" : `Step ${currentStepIndex + 1} of 3: ${STEP_LABELS[step as Exclude<StepKey, "confirmed">]}`}
      </p>

      <div className="mt-6 space-y-4">
        {/* Step 1 — Details */}
        <StepCard
          number={1}
          title="Share your birth details and stone preferences"
          description="Type in your details, or upload a kundli you already have. This takes about two minutes."
          status={statusFor("details")}
          summary={currentStepIndex > 0 ? `Sent for ${details.fullName || "you"}` : undefined}
          onEdit={currentStepIndex > 0 && step !== "confirmed" ? () => setStep("details") : undefined}
          autoFocusOnActivate={autoFocusStep}
          reducedMotion={reducedMotion}
        >
          <form onSubmit={handleDetailsSubmit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="order-2 space-y-6 lg:order-1">
              {draftRestored && (
                <p className="rounded-xl bg-[#f5eee5] px-4 py-3 text-xs text-[#6d6259]">
                  We kept what you had typed earlier. Change anything that looks wrong.
                </p>
              )}

              {errorList.length > 0 && (
                <div
                  ref={errorSummaryRef}
                  tabIndex={-1}
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 outline-none"
                >
                  <p className="text-sm font-medium text-red-800">
                    {errorList.length === 1 ? "One field needs attention" : `${errorList.length} fields need attention`}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-red-700">
                    {errorList.map(({ key, message }) => (
                      <li key={key}>
                        <a
                          href={`#${fieldId(key as string)}`}
                          className="underline underline-offset-2"
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(fieldId(key as string));
                            el?.focus({ preventScroll: true });
                            el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
                          }}
                        >
                          {message}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* --- About you --- */}
              <section className="space-y-5">
                <SectionHeading>About you</SectionHeading>

                <Field label="Full name" htmlFor={fieldId("fullName")} error={formErrors.fullName} required>
                  <input
                    id={fieldId("fullName")}
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    className={inputClass(!!formErrors.fullName)}
                    aria-invalid={!!formErrors.fullName}
                    aria-describedby={formErrors.fullName ? `${fieldId("fullName")}-error` : undefined}
                    value={details.fullName}
                    onChange={(e) => updateDetail("fullName", e.target.value)}
                  />
                </Field>

                <fieldset>
                  <legend className={labelClass}>
                    Gender <RequiredMark />
                  </legend>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:inline-flex sm:gap-2">
                    {(["female", "male", "other"] as Gender[]).map((g, i) => {
                      const checked = details.gender === g;
                      return (
                        <label
                          key={g}
                          className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-[#a47735]/40 ${
                            checked ? "border-[#a47735] bg-[#faf3e7] font-medium text-[#241c16]" : "border-[#e7dfd5] text-[#6d6259]"
                          }`}
                        >
                          <input
                            id={i === 0 ? fieldId("gender") : undefined}
                            type="radio"
                            name="gender"
                            value={g}
                            className="sr-only"
                            checked={checked}
                            onChange={() => updateDetail("gender", g)}
                          />
                          {g === "female" ? "Female" : g === "male" ? "Male" : "Other"}
                        </label>
                      );
                    })}
                  </div>
                  {formErrors.gender && <p className={errorClass}>{formErrors.gender}</p>}
                </fieldset>

                <Field
                  label="Mobile number"
                  htmlFor={fieldId("phone")}
                  error={formErrors.phone}
                  hint="The astrologer calls on this number."
                  required
                >
                  <div
                    className={`flex items-stretch overflow-hidden rounded-lg border bg-white transition focus-within:ring-2 focus-within:ring-[#a47735]/20 ${
                      formErrors.phone ? "border-red-400" : "border-[#e7dfd5] focus-within:border-[#a47735]"
                    }`}
                  >
                    <span className="flex items-center border-r border-[#e7dfd5] bg-[#faf8f4] px-3 text-sm text-[#6d6259]">
                      +91
                    </span>
                    <input
                      id={fieldId("phone")}
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      placeholder="98765 43210"
                      className="w-full bg-transparent px-3 py-2.5 text-sm text-[#241c16] outline-none"
                      aria-invalid={!!formErrors.phone}
                      value={details.phone}
                      onChange={(e) => updateDetail("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    />
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-sm text-[#6d6259]">
                    <input
                      type="checkbox"
                      className={checkboxClass}
                      checked={details.whatsappSameAsPhone}
                      onChange={(e) => updateDetail("whatsappSameAsPhone", e.target.checked)}
                    />
                    This number is on WhatsApp
                  </label>
                </Field>

                <Field
                  label="Email"
                  htmlFor={fieldId("email")}
                  error={formErrors.email}
                  hint="Optional. We send the written reading here."
                >
                  <input
                    id={fieldId("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={inputClass(!!formErrors.email)}
                    aria-invalid={!!formErrors.email}
                    value={details.email}
                    onChange={(e) => updateDetail("email", e.target.value)}
                  />
                </Field>
              </section>

              {/* --- Kundli --- */}
              <section className="space-y-4 border-t border-[#efe7dc] pt-6">
                <SectionHeading>Your kundli</SectionHeading>

                <div
                  role="tablist"
                  aria-label="How to share your kundli"
                  className="inline-flex rounded-full border border-[#e7dfd5] bg-[#faf8f4] p-1 text-sm"
                >
                  {(["manual", "upload"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      role="tab"
                      aria-selected={details.kundliMode === mode}
                      onClick={() => updateDetail("kundliMode", mode)}
                      className={`rounded-full px-4 py-1.5 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47735] ${
                        details.kundliMode === mode ? "bg-[#211b17] text-white" : "text-[#6d6259]"
                      }`}
                    >
                      {mode === "manual" ? "Enter birth details" : "Upload kundli"}
                    </button>
                  ))}
                </div>

                {details.kundliMode === "manual" ? (
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Date of birth" htmlFor={fieldId("dob")} error={formErrors.dob} required>
                        <input
                          id={fieldId("dob")}
                          name="dob"
                          type="date"
                          autoComplete="bday"
                          min="1900-01-01"
                          max={maxDob}
                          className={inputClass(!!formErrors.dob)}
                          aria-invalid={!!formErrors.dob}
                          value={details.dob}
                          onChange={(e) => updateDetail("dob", e.target.value)}
                        />
                      </Field>

                      <Field
                        label="Time of birth"
                        htmlFor={fieldId("timeOfBirth")}
                        error={formErrors.timeOfBirth}
                        hint="As close as you can — it changes the reading."
                        required={!details.timeUnknown}
                      >
                        <input
                          id={fieldId("timeOfBirth")}
                          name="timeOfBirth"
                          type="time"
                          className={`${inputClass(!!formErrors.timeOfBirth)} disabled:bg-[#faf8f4] disabled:text-[#9a8f84]`}
                          aria-invalid={!!formErrors.timeOfBirth}
                          value={details.timeOfBirth}
                          disabled={details.timeUnknown}
                          onChange={(e) => updateDetail("timeOfBirth", e.target.value)}
                        />
                        <label className="mt-2 flex items-center gap-2 text-sm text-[#6d6259]">
                          <input
                            type="checkbox"
                            className={checkboxClass}
                            checked={details.timeUnknown}
                            onChange={(e) => {
                              updateDetail("timeUnknown", e.target.checked);
                              if (e.target.checked) updateDetail("timeOfBirth", "");
                            }}
                          />
                          I don’t know my exact time
                        </label>
                      </Field>
                    </div>

                    <Field
                      label="Place of birth"
                      htmlFor={fieldId("placeOfBirth")}
                      error={formErrors.placeOfBirth}
                      hint="City, state and country — the hospital town, not where you live now."
                      required
                    >
                      <input
                        id={fieldId("placeOfBirth")}
                        name="placeOfBirth"
                        type="text"
                        placeholder="Jaipur, Rajasthan, India"
                        className={inputClass(!!formErrors.placeOfBirth)}
                        aria-invalid={!!formErrors.placeOfBirth}
                        value={details.placeOfBirth}
                        onChange={(e) => updateDetail("placeOfBirth", e.target.value)}
                      />
                    </Field>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor={fileInputId}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        acceptFile(e.dataTransfer.files?.[0] ?? null);
                      }}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed px-4 py-8 text-center transition focus-within:ring-2 focus-within:ring-[#a47735] ${
                        isDragging ? "border-[#a47735] bg-[#faf3e7]" : "border-[#c9bba3] bg-[#faf8f4]"
                      } ${formErrors.kundliFile ? "border-red-400" : ""}`}
                    >
                      <span className="text-sm font-medium text-[#241c16]">
                        {kundliFile ? "Replace file" : "Tap to upload, or drop a file here"}
                      </span>
                      <span className="text-xs text-[#6d6259]">
                        PDF, JPG, PNG or WebP, up to {MAX_KUNDLI_FILE_MB} MB
                      </span>
                      <input
                        id={fileInputId}
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="sr-only"
                        aria-invalid={!!formErrors.kundliFile}
                        onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
                      />
                      {/* Anchor for the error summary to focus. */}
                      <span id={fieldId("kundliFile")} tabIndex={-1} className="sr-only" />
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
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-[#241c16]">{kundliFile.name}</span>
                          <span className="block text-xs text-[#6d6259]">
                            {(kundliFile.size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={clearFile}
                          className="rounded-full px-2 py-1 text-xs font-medium text-[#8c6327] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47735]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {formErrors.kundliFile && <p className={errorClass}>{formErrors.kundliFile}</p>}
                  </div>
                )}
              </section>

              {/* --- The bracelet --- */}
              <section className="space-y-5 border-t border-[#efe7dc] pt-6">
                <SectionHeading>The bracelet</SectionHeading>

                <fieldset>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <legend className={labelClass}>
                      Stone preferences <RequiredMark />
                    </legend>
                    <span className="text-xs text-[#6d6259]">
                      {details.noStonePreference
                        ? "Astrologer chooses"
                        : `${details.stonePreferences.length} of ${MAX_STONE_SELECTION} picked`}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {stoneOptions.map((stone, i) => {
                      const checked = details.stonePreferences.includes(stone.id);
                      const atLimit =
                        !checked && details.stonePreferences.length >= MAX_STONE_SELECTION;
                      const disabled = details.noStonePreference || atLimit;
                      return (
                        <label
                          key={stone.id}
                          className={`flex flex-col gap-1 rounded-xl border px-3 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-[#a47735]/40 ${
                            checked ? "border-[#a47735] bg-[#faf3e7]" : "border-[#e7dfd5] bg-white"
                          } ${disabled ? "opacity-45" : "cursor-pointer hover:border-[#c9bba3]"}`}
                        >
                          <input
                            id={i === 0 ? fieldId("stonePreferences") : undefined}
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleStone(stone.id)}
                          />
                          <span className="flex items-center gap-2 font-medium text-[#241c16]">
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
                      className={checkboxClass}
                      checked={details.noStonePreference}
                      onChange={(e) => {
                        updateDetail("noStonePreference", e.target.checked);
                        if (e.target.checked) updateDetail("stonePreferences", []);
                      }}
                    />
                    Let the astrologer choose for me
                  </label>
                  {formErrors.stonePreferences && <p className={errorClass}>{formErrors.stonePreferences}</p>}
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Wrist size" htmlFor={fieldId("wristSize")} error={formErrors.wristSize} required>
                    <select
                      id={fieldId("wristSize")}
                      name="wristSize"
                      className={inputClass(!!formErrors.wristSize)}
                      aria-invalid={!!formErrors.wristSize}
                      value={details.wristSize}
                      onChange={(e) => updateDetail("wristSize", e.target.value as WristSize)}
                    >
                      <option value="">Select a size</option>
                      {WRIST_SIZES.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="What should the reading focus on?"
                    htmlFor={fieldId("focusArea")}
                  >
                    <select
                      id={fieldId("focusArea")}
                      name="focusArea"
                      className={inputClass(false)}
                      value={details.focusArea}
                      onChange={(e) => updateDetail("focusArea", e.target.value as FocusArea)}
                    >
                      {FOCUS_AREAS.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Anything else the astrologer should know?" htmlFor={fieldId("notes")}>
                  <textarea
                    id={fieldId("notes")}
                    name="notes"
                    className={`${inputClass(false)} resize-y`}
                    rows={3}
                    maxLength={NOTES_LIMIT}
                    value={details.notes}
                    onChange={(e) => updateDetail("notes", e.target.value)}
                  />
                  <span className="mt-1 block text-right text-xs text-[#6d6259]">
                    {details.notes.length} / {NOTES_LIMIT}
                  </span>
                </Field>
              </section>

              {/* --- Consent + submit --- */}
              <div className="border-t border-[#efe7dc] pt-6">
                <label className="flex items-start gap-3 text-sm text-[#6d6259]">
                  <input
                    id={fieldId("consent")}
                    type="checkbox"
                    className={`${checkboxClass} mt-0.5`}
                    aria-invalid={!!formErrors.consent}
                    checked={details.consent}
                    onChange={(e) => updateDetail("consent", e.target.checked)}
                  />
                  <span>
                    Share my birth details with the astrologer for this reading. We don’t use them for
                    anything else.
                  </span>
                </label>
                {formErrors.consent && <p className={errorClass}>{formErrors.consent}</p>}

                <div className="sticky bottom-0 -mx-6 mt-5 border-t border-[#efe7dc] bg-white/95 px-6 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#211b17] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#332822] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47735] focus-visible:ring-offset-2 sm:w-auto sm:px-8"
                  >
                    Send to the astrologer
                  </button>
                  <p className="mt-2 text-xs text-[#6d6259]">
                    The reading is free. You pay only after you’ve seen the recommendation.
                  </p>
                </div>
              </div>
            </div>

            <BraceletPreview
              name={details.fullName}
              selected={selectedStones}
              noPreference={details.noStonePreference}
            />
          </form>
        </StepCard>

        {/* Step 2 — Astrologer review */}
        <StepCard
          number={2}
          title="Astrologer review"
          description="They read your chart and put together a bracelet recommendation."
          status={statusFor("consultation")}
          summary={currentStepIndex > 1 ? "Recommendation ready" : undefined}
          autoFocusOnActivate={autoFocusStep}
          reducedMotion={reducedMotion}
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
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6d6259]">
                  Your chart is with the astrologer. This usually takes a few minutes and appears right
                  here — you can keep this page open.
                </p>
                <div className={`${styles.progressTrack} ${reducedMotion ? styles.noMotion : ""} mx-auto mt-5 max-w-xs`} />
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
                    Send again
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="rounded-full border border-[#e7dfd5] px-6 py-3 text-sm font-semibold text-[#241c16]"
                  >
                    Edit my details
                  </button>
                </div>
              </div>
            )}
          </div>
        </StepCard>

        {/* Step 3 — Recommendation + payment */}
        <StepCard
          number={3}
          title="Your recommendation and payment"
          description="Read what the astrologer suggests, then pay to confirm your bracelet."
          status={statusFor("recommendation")}
          summary={step === "confirmed" ? "Paid and confirmed" : undefined}
          autoFocusOnActivate={autoFocusStep}
          reducedMotion={reducedMotion}
        >
          {recommendation ? (
            <div>
              {recommendation.astrologerName && (
                <p className="text-xs text-[#6d6259]">Read by {recommendation.astrologerName}</p>
              )}
              <p className="mt-1 text-sm leading-6 text-[#241c16]">{recommendation.summary}</p>

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
                {recommendation.beadCount ? (
                  <span className="inline-flex items-center rounded-full border border-[#e7dfd5] bg-[#faf8f4] px-3 py-1 text-xs text-[#241c16]">
                    {recommendation.beadCount} beads
                  </span>
                ) : null}
              </div>

              {recommendation.wearInstructions && (
                <p className="mt-4 rounded-xl bg-[#faf8f4] px-4 py-3 text-sm leading-6 text-[#6d6259]">
                  {recommendation.wearInstructions}
                </p>
              )}

              <dl className="mt-6 space-y-2 border-t border-[#e7dfd5] pt-5">
                <div className="flex items-center justify-between text-sm text-[#6d6259]">
                  <dt>Astrologer consultation</dt>
                  <dd>Free</dd>
                </div>
                <div className="flex items-center justify-between border-t border-[#e7dfd5] pt-2 text-base font-semibold text-[#241c16]">
                  <dt>{product.name}</dt>
                  <dd className="tabular-nums">{formatINR(recommendation.finalAmount)}</dd>
                </div>
                {recommendation.deliveryEstimate && (
                  <div className="flex items-center justify-between pt-1 text-xs text-[#6d6259]">
                    <dt>Delivery</dt>
                    <dd>{recommendation.deliveryEstimate}</dd>
                  </div>
                )}
              </dl>

              {finalError && (
                <p role="alert" className="mt-3 text-sm text-red-700">
                  {finalError}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <PaymentButton
                  amount={recommendation.finalAmount}
                  handle={product.id}
                  purpose="final"
                  variant="light"
                  disabled={isFinalizingOrder}
                  label={`Pay ${formatINR(recommendation.finalAmount)} and confirm`}
                  customer={{ name: details.fullName, email: details.email, phone: details.phone }}
                  onSuccess={(paymentId) => void handlePaymentSuccess(paymentId)}
                  onFailure={(message) => setFinalError(message)}
                />
                <button
                  type="button"
                  disabled={isFinalizingOrder}
                  onClick={() => setStep("details")}
                  className="rounded-full border border-[#e7dfd5] px-6 py-3.5 text-sm font-semibold text-[#241c16] transition hover:bg-[#faf8f4] disabled:opacity-50"
                >
                  Ask for changes
                </button>
              </div>

              {isFinalizingOrder && (
                <p aria-live="polite" className="mt-3 text-xs text-[#6d6259]">
                  Placing your order — don’t close this page.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#6d6259]">Your recommendation will appear here once it’s ready.</p>
          )}
        </StepCard>

        {step === "confirmed" && (
          <div className="rounded-2xl border border-[#e7dfd5] bg-white p-8 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-[#241c16]">Your bracelet is being made</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6d6259]">
              {orderId ? `Order ${orderId} is confirmed.` : "Your order is confirmed."} We’ll send the
              full reading and shipping updates to{" "}
              {details.email ? details.email : `+91 ${details.phone}`}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Small pieces
 * ------------------------------------------------------------------ */

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#241c16] outline-none transition focus:ring-2 focus:ring-[#a47735]/20 ${
    hasError ? "border-red-400 focus:border-red-500" : "border-[#e7dfd5] focus:border-[#a47735]"
  }`;

const labelClass = "block text-sm font-medium text-[#241c16]";
const errorClass = "mt-1.5 text-xs text-red-700";
const checkboxClass = "h-4 w-4 shrink-0 accent-[#a47735]";

function RequiredMark() {
  return (
    <span className="text-[#a47735]" aria-hidden="true">
      *
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="text-sm font-semibold text-[#a47735]">{children}</h4>;
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label} {required && <RequiredMark />}
      </label>
      {hint && <p className="mt-1 text-xs text-[#6d6259]">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${htmlFor}-error`} className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

type StepStatus = "done" | "current" | "upcoming";

function StepRail({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {STEP_ORDER.map((key, i) => {
        const done = current > i;
        const active = current === i;
        return (
          <li key={key} className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span
              aria-hidden="true"
              className={`h-1 rounded-full transition ${
                done ? "bg-[#a47735]" : active ? "bg-[#211b17]" : "bg-[#e7dfd5]"
              }`}
            />
            <span
              className={`truncate text-xs ${active ? "font-medium text-[#241c16]" : "text-[#6d6259]"}`}
            >
              {STEP_LABELS[key]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StepCard({
  number,
  title,
  description,
  status,
  summary,
  onEdit,
  autoFocusOnActivate,
  reducedMotion,
  children,
}: {
  number: number;
  title: string;
  description: string;
  status: StepStatus;
  summary?: string;
  onEdit?: () => void;
  autoFocusOnActivate: boolean;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "current" || !autoFocusOnActivate) return;
    const node = bodyRef.current;
    if (!node) return;

    const frame = window.requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      // Focus the panel itself, not the first input, so mobile keyboards
      // don't spring open the moment a step changes.
      node.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [status, autoFocusOnActivate, reducedMotion]);

  return (
    <section
      aria-current={status === "current" ? "step" : undefined}
      className={`rounded-2xl border bg-white shadow-sm transition ${
        status === "current" ? "border-[#a47735]" : "border-[#e7dfd5]"
      } ${status === "upcoming" ? "opacity-60" : ""}`}
    >
      <div className="flex gap-4 p-5 sm:gap-5 sm:p-6">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-10 sm:w-10 ${
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
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-base font-semibold text-[#2b211a] sm:text-lg">{title}</h3>
            {status === "done" && onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="text-sm font-medium text-[#8c6327] underline underline-offset-2"
              >
                Edit
              </button>
            )}
          </div>
          <p className="mt-1 text-sm leading-6 text-[#6d6259]">{summary ?? description}</p>

          {status === "current" && (
            <div
              ref={bodyRef}
              tabIndex={-1}
              className="mt-5 scroll-mt-24 outline-none focus-visible:outline-none"
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BraceletPreview({
  name,
  selected,
  noPreference,
}: {
  name: string;
  selected: StoneOption[];
  noPreference: boolean;
}) {
  const beads = selected.length > 0 ? selected : null;

  return (
    <aside className="order-1 h-fit rounded-2xl border border-[#e7dfd5] bg-[#faf8f4] p-5 lg:order-2 lg:sticky lg:top-6">
      <p className="text-xs font-medium text-[#a47735]">Live preview</p>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {beads
          ? beads.map((stone) => (
              <span
                key={stone.id}
                title={stone.label}
                aria-hidden="true"
                className="h-6 w-6 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: stone.swatch }}
              />
            ))
          : Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="h-6 w-6 rounded-full border-2 border-white bg-[#e7dfd5] shadow"
              />
            ))}
      </div>

      <p className="mt-4 text-center text-sm italic text-[#241c16]">{name.trim() || "Your name here"}</p>

      <p className="mt-2 text-center text-xs leading-5 text-[#6d6259]">
        {noPreference
          ? "The astrologer will choose your stones"
          : beads
          ? beads.map((s) => s.label).join(", ")
          : "Pick stones to see them here"}
      </p>
    </aside>
  );
}