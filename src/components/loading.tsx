// components/Loader.tsx
import Image from "next/image";
import styles from "../styles/Loader.module.css";
import Logo from "../../public/images/image-logo.png";

const GRAHAS = [
  { name: "Sun",     gem: "Ruby",            color: "#B23A2E" },
  { name: "Moon",    gem: "Pearl",           color: "#CFC6B3" },
  { name: "Mars",    gem: "Red Coral",       color: "#D97757" },
  { name: "Mercury", gem: "Emerald",         color: "#2F6F52" },
  { name: "Jupiter", gem: "Yellow Sapphire", color: "#D9A544" },
  { name: "Venus",   gem: "Diamond",         color: "#A9BAC7" },
  { name: "Saturn",  gem: "Blue Sapphire",   color: "#3E4E7A" },
  { name: "Rahu",    gem: "Hessonite",       color: "#8B5E3C" },
  { name: "Ketu",    gem: "Cat's Eye",       color: "#6E7A61" },
] as const;

const RING_CENTER = 110;
const RING_RADIUS = 92;
const PETAL_OFFSET = 20;

export default function Loader() {
  return (
    <div className={styles.loaderRoot} role="status" aria-live="polite">
      <div className={styles.mark}>
        <span className={styles.groundShadow} aria-hidden="true" />

        <svg className={styles.orbits} viewBox="0 0 220 220" aria-hidden="true">
          <g className={styles.petals}>
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * 2 * Math.PI;
              const cx = RING_CENTER + PETAL_OFFSET * Math.cos(angle);
              const cy = RING_CENTER + PETAL_OFFSET * Math.sin(angle);
              return <circle key={i} cx={cx} cy={cy} r={34} className={styles.petal} />;
            })}
          </g>

          <circle className={styles.dialTrack} cx={RING_CENTER} cy={RING_CENTER} r={RING_RADIUS} />
          <circle className={styles.innerTrack} cx={RING_CENTER} cy={RING_CENTER} r={66} />
          <g className={styles.ticks}>
            {GRAHAS.map((graha, i) => {
              const angle = (i / GRAHAS.length) * 2 * Math.PI - Math.PI / 2;
              const cos = Math.cos(angle);
              const sin = Math.sin(angle);
              const x1 = RING_CENTER + (RING_RADIUS - 6) * cos;
              const y1 = RING_CENTER + (RING_RADIUS - 6) * sin;
              const x2 = RING_CENTER + (RING_RADIUS + 6) * cos;
              const y2 = RING_CENTER + (RING_RADIUS + 6) * sin;
              return (
                <line key={graha.name} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.tick} />
              );
            })}
          </g>

          <g className={styles.orbitRing}>
            {GRAHAS.map((graha, i) => {
              const angle = (i / GRAHAS.length) * 2 * Math.PI - Math.PI / 2;
              const cx = RING_CENTER + RING_RADIUS * Math.cos(angle);
              const cy = RING_CENTER + RING_RADIUS * Math.sin(angle);
              return (
                <circle
                  key={graha.name}
                  cx={cx}
                  cy={cy}
                  r={4.5}
                  className={styles.gem}
                  style={{
                    fill: graha.color,
                    filter: `drop-shadow(0 0 3px ${graha.color}99)`,
                    animationDelay: `${260 + i * 70}ms`,
                  }}
                >
                  <title>{`${graha.name} — ${graha.gem}`}</title>
                </circle>
              );
            })}
          </g>
        </svg>

        <Image
          src={Logo}
          alt="Navgrah Bracelets"
          width={240}
          height={240}
          priority
          sizes="(max-width: 480px) 160px, 220px"
          className={styles.logoImg}
        />
      </div>

      <p className={styles.caption}>
        Loading
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </p>
      <span className="sr-only">Loading Navgrah Bracelets, please wait</span>
    </div>
  );
}