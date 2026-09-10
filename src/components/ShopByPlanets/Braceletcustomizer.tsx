import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../../styles/Braceletcustomizer.module.css';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  href: string;
  availability?: string;
}

export interface EngravingCustomization {
  type: 'engraving';
  value: string;
}

export interface CartPayload {
  productId: string;
  quantity: 1;
  unitPrice: number;
  customization: EngravingCustomization | null;
  customizationFee: number;
}

export interface BraceletCustomizerProps {
  product: Product;
  customizationFee?: number;
  maxEngravingLength?: number;
  onAddToCart: (payload: CartPayload) => void;
  onViewDetails?: (product: Product) => void;
  className?: string;
}

export const SAMPLE_PRODUCT: Product = {
  id: 'REPLACE_WITH_REAL_SKU',
  name: 'REPLACE_WITH_REAL_PRODUCT_NAME',
  price: 0,
  imageUrl: '/REPLACE/WITH/REAL/IMAGE.jpg',
  imageAlt: 'REPLACE_WITH_REAL_ALT_TEXT',
  href: '/REPLACE/WITH/REAL/PRODUCT/LINK',
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return reduced;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function sanitizeEngraving(raw: string, maxLength: number): string {
  return raw.replace(/[^a-zA-Z0-9 &'.-]/g, '').slice(0, maxLength);
}

export default function BraceletCustomizer({
  product,
  customizationFee = 150,
  maxEngravingLength = 12,
  onAddToCart,
  onViewDetails,
  className = '',
}: BraceletCustomizerProps) {
  const [isCustomized, setIsCustomized] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [hasTouchedInput, setHasTouchedInput] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleId = useId();
  const inputId = useId();
  const helpId = useId();
  const priceId = useId();

  const trimmedEngraving = engravingText.trim();
  const needsEngravingText = isCustomized && trimmedEngraving.length === 0;

  const totalPrice = useMemo(
    () => product.price + (isCustomized ? customizationFee : 0),
    [product.price, isCustomized, customizationFee]
  );

  const handleToggle = useCallback(() => {
    setIsCustomized((prev) => {
      const next = !prev;
      if (next) {
        window.requestAnimationFrame(() => inputRef.current?.focus());
      }
      return next;
    });
  }, []);

  const handleEngravingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasTouchedInput(true);
      setEngravingText(sanitizeEngraving(e.target.value, maxEngravingLength));
    },
    [maxEngravingLength]
  );

  const handleAddToCart = useCallback(() => {
    if (needsEngravingText) {
      inputRef.current?.focus();
      return;
    }
    onAddToCart({
      productId: product.id,
      quantity: 1,
      unitPrice: totalPrice,
      customization: isCustomized
        ? { type: 'engraving', value: trimmedEngraving }
        : null,
      customizationFee: isCustomized ? customizationFee : 0,
    });
  }, [
    needsEngravingText,
    onAddToCart,
    product.id,
    totalPrice,
    isCustomized,
    trimmedEngraving,
    customizationFee,
  ]);

  const charsRemaining = maxEngravingLength - engravingText.length;

  return (
    <section
      className={`${styles.root} bg-[var(--paper)] ${className}`}
      aria-labelledby={`${toggleId}-heading`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.15fr_1fr] md:gap-14 md:py-16 lg:px-8">
        <div className="relative">
          <div className="relative border border-[var(--line)] bg-[var(--paper-2)] p-3 sm:p-4">
            <span className={styles.hallmark} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <circle cx="12" cy="7" r="4.2" stroke="currentColor" strokeWidth="1.1" />
                <circle cx="6" cy="15" r="4.2" stroke="currentColor" strokeWidth="1.1" />
                <circle cx="18" cy="15" r="4.2" stroke="currentColor" strokeWidth="1.1" />
              </svg>
            </span>

            <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/6]">
              <img
                src={product.imageUrl}
                alt={product.imageAlt}
                className="h-full w-full object-cover"
              />

              <div
                className={`${styles.plate} ${
                  isCustomized ? styles.plateOn : ''
                } ${reducedMotion ? styles.noMotion : ''}`}
                aria-hidden="true"
              >
                <span className={styles.plateInner}>
                  <span className={styles.plateText}>
                    {trimmedEngraving || '· · ·'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {product.availability && (
            <p className="mt-3 text-sm" style={{ color: 'var(--ink-dim)' }}>
              {product.availability}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <h2
            id={`${toggleId}-heading`}
            className="font-display text-3xl italic leading-tight sm:text-4xl"
            style={{ color: 'var(--ink)' }}
          >
            {product.name}
          </h2>

          <p className="mt-2 text-lg" style={{ color: 'var(--ink-dim)' }}>
            {formatINR(product.price)}
          </p>

          <div className="mt-8 h-px w-full" style={{ backgroundColor: 'var(--line)' }} />

          {/* Customization toggle */}
          <div className="mt-8 flex items-start justify-between gap-6">
            <div>
              <label
                id={`${toggleId}-label`}
                htmlFor={toggleId}
                className="block cursor-pointer font-display text-lg"
                style={{ color: 'var(--ink)' }}
              >
                Engrave the clasp
              </label>
              <p className="mt-1 max-w-xs text-sm" style={{ color: 'var(--ink-dim)' }}>
                A single line, hand-stamped on the inside of the clasp. Adds{' '}
                {formatINR(customizationFee)}.
              </p>
            </div>

            <button
              type="button"
              id={toggleId}
              role="switch"
              aria-checked={isCustomized}
              aria-labelledby={`${toggleId}-label`}
              onClick={handleToggle}
              className={`${styles.switch} ${
                isCustomized ? styles.switchOn : ''
              } shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
              style={{ outlineColor: 'var(--brass)' } as React.CSSProperties}
            >
              <span className={styles.switchThumb} />
              <span className="sr-only">
                {isCustomized ? 'Personalization on' : 'Personalization off'}
              </span>
            </button>
          </div>

          {/* Engraving input — height-animated reveal, no layout jump */}
          <div
            className={`${styles.revealRow} ${
              isCustomized ? styles.revealRowOpen : ''
            } ${reducedMotion ? styles.noMotion : ''}`}
          >
            <div className={styles.revealInner}>
              <div className="border p-4" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper-2)' }}>
                <label
                  htmlFor={inputId}
                  className="block text-sm font-medium"
                  style={{ color: 'var(--ink)' }}
                >
                  What should it say?
                </label>
                <input
                  ref={inputRef}
                  id={inputId}
                  type="text"
                  value={engravingText}
                  onChange={handleEngravingChange}
                  maxLength={maxEngravingLength}
                  placeholder="e.g. A.K."
                  aria-describedby={helpId}
                  aria-invalid={needsEngravingText && hasTouchedInput}
                  className={`${styles.input} mt-2 w-full px-3 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                  style={{ outlineColor: 'var(--brass)' } as React.CSSProperties}
                />
                <p
                  id={helpId}
                  className="mt-2 text-xs tabular-nums"
                  style={{ color: 'var(--ink-dim)' }}
                  aria-live="polite"
                >
                  {needsEngravingText && hasTouchedInput
                    ? 'Enter a few characters to continue.'
                    : `${charsRemaining} characters left`}
                </p>
              </div>
            </div>
          </div>

          {/* Price breakdown — a spec sheet, not a card */}
          <dl
            className="mt-8 space-y-2 border-t pt-6"
            style={{ borderColor: 'var(--line)' }}
            aria-live="polite"
            id={priceId}
          >
            <div className="flex items-center justify-between text-sm" style={{ color: 'var(--ink-dim)' }}>
              <dt>Bracelet</dt>
              <dd className="tabular-nums">{formatINR(product.price)}</dd>
            </div>
            <div
              className={`${styles.revealRow} ${
                isCustomized ? styles.revealRowOpen : ''
              } ${reducedMotion ? styles.noMotion : ''}`}
            >
              <div className={styles.revealInner}>
                <div className="flex items-center justify-between text-sm" style={{ color: 'var(--ink-dim)' }}>
                  <dt>Engraving</dt>
                  <dd className="tabular-nums">+{formatINR(customizationFee)}</dd>
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-between border-t pt-2 text-base font-medium"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <dt>Total</dt>
              <dd className="font-display tabular-nums">{formatINR(totalPrice)}</dd>
            </div>
          </dl>

          {/* CTA */}
          <div
            className="mt-8 sticky bottom-0 pb-4 pt-4 sm:static sm:pb-0 sm:pt-0"
            style={{ backgroundColor: 'var(--paper)' }}
          >
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={needsEngravingText}
              className={`${styles.cta} w-full px-6 py-4 text-center font-medium transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed`}
              style={{ outlineColor: 'var(--brass)' } as React.CSSProperties}
            >
              Add to bag — {formatINR(totalPrice)}
            </button>

            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(product)}
                className="mt-3 w-full text-center text-sm underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  color: 'var(--ink-dim)',
                  textDecorationColor: 'var(--line)',
                  outlineColor: 'var(--brass)',
                } as React.CSSProperties}
              >
                View full details
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}