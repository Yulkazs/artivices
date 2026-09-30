"use client";

import { useEffect, useState } from "react";

/**
 * Artivices loading screen.
 *
 * - Covers the page from first paint (it is server-rendered), then fades out
 *   once the window `load` event AND web fonts are done.
 * - Stays for at least MIN_MS so the animation never just flashes, and gives up
 *   waiting after MAX_MS so a slow asset can never trap the visitor.
 * - Lives in the root layout, so it mounts once per visit. Client-side page
 *   navigations do not trigger it again.
 */

const MIN_MS = 1000; // shortest time the loader stays on screen
const MAX_MS = 4000; // safety net: always leave after this long
const FADE_MS = 600; // must match the CSS transition below
const SEEN_KEY = "artivices-loader-seen"; // sessionStorage flag: loader already shown

const INK = "#0a0804";

// ---- logo geometry (from Logo.svg) -----------------------------------------
const CORNERS: string[] = [
  "M393.381 319.986C400.661 316.491 407.247 314.875 413.212 315.25C419.194 315.627 424.491 318.003 429.176 322.376C438.491 331.072 441.475 341.688 440.486 350.855C439.576 359.289 434.427 367.575 427.972 373.692C421.534 379.793 413.632 383.889 407.079 383.707C400.837 383.534 397.039 383.481 393.697 383.035C390.677 382.631 388.034 381.909 384.289 380.521C385.307 384.468 385.952 387.577 386.242 391.026C386.565 394.869 386.446 399.105 385.945 405.368C385.422 411.903 380.502 419.32 373.746 425.067C366.972 430.828 358.181 435.058 349.698 435.058C340.478 435.058 330.243 430.952 322.597 420.758C318.751 415.631 316.958 410.11 317.225 404.122C317.492 398.151 319.804 391.776 324.06 384.913L325.177 383.11L325.441 385.214C326.305 392.104 328.994 397.555 332.622 400.968C336.237 404.369 340.79 405.762 345.515 404.58C350.424 403.353 353.941 401.461 356.104 397.788C358.285 394.085 359.176 388.434 358.458 379.477C355.989 372.93 353.343 368.886 349.881 365.895C346.382 362.873 341.995 360.874 335.925 358.507L335.452 358.322L335.448 357.813C335.373 346.838 335.466 340.774 333.46 329.439L333.277 328.411L334.31 328.567C344.123 330.053 350.313 330.409 359.542 330.522L363.703 330.558L364.3 330.562L364.43 331.146C365.882 337.699 367.829 342.124 370.786 345.62C373.689 349.051 377.618 351.648 383.179 354.457L383.824 354.569C392.511 356.058 398.346 355.546 402.418 353.575C406.457 351.619 408.892 348.16 410.633 343.426C412.315 338.855 411.417 334.179 408.423 330.22C405.42 326.248 400.289 322.989 393.532 321.391L391.468 320.903L393.381 319.986Z",
  "M116.484 319.985C109.203 316.49 102.617 314.875 96.6527 315.25C90.6701 315.626 85.3731 318.002 80.6878 322.376C71.3733 331.071 68.3891 341.687 69.3783 350.854C70.2884 359.289 75.4376 367.575 81.8919 373.691C88.33 379.792 96.2322 383.888 102.785 383.707C109.027 383.534 112.825 383.48 116.167 383.034C119.188 382.631 121.831 381.908 125.576 380.52C124.557 384.467 123.912 387.576 123.622 391.025C123.3 394.868 123.419 399.105 123.919 405.367C124.442 411.902 129.362 419.32 136.118 425.066C142.892 430.827 151.683 435.057 160.166 435.058C169.387 435.058 179.621 430.951 187.267 420.758C191.113 415.63 192.906 410.109 192.639 404.121C192.372 398.151 190.06 391.776 185.804 384.912L184.687 383.109L184.423 385.214C183.56 392.103 180.87 397.555 177.243 400.968C173.628 404.368 169.074 405.761 164.349 404.58C159.44 403.353 155.924 401.46 153.76 397.787C151.58 394.084 150.688 388.433 151.407 379.476C153.875 372.93 156.521 368.886 159.984 365.894C163.482 362.873 167.869 360.874 173.939 358.507L174.412 358.321L174.416 357.812C174.491 346.838 174.398 340.773 176.405 329.438L176.587 328.41L175.554 328.566C165.742 330.052 159.552 330.408 150.323 330.521L146.161 330.558L145.564 330.561L145.434 331.145C143.983 337.698 142.036 342.123 139.078 345.619C136.175 349.051 132.247 351.647 126.685 354.457L126.04 354.568C117.353 356.057 111.518 355.545 107.447 353.574C103.408 351.618 100.972 348.16 99.2308 343.426C97.5496 338.855 98.4473 334.178 101.441 330.22C104.445 326.247 109.575 322.988 116.332 321.391L118.396 320.902L116.484 319.985Z",
  "M393.38 192.27C400.66 195.765 407.246 197.381 413.211 197.005C419.193 196.629 424.49 194.253 429.175 189.879C438.49 181.184 441.474 170.568 440.485 161.401C439.575 152.967 434.426 144.681 427.971 138.564C421.533 132.463 413.631 128.367 407.078 128.548C400.836 128.721 397.038 128.775 393.696 129.221C390.676 129.624 388.033 130.347 384.288 131.735C385.306 127.788 385.951 124.679 386.241 121.23C386.564 117.387 386.445 113.151 385.944 106.888C385.421 100.353 380.501 92.9355 373.745 87.189C366.971 81.4282 358.18 77.1979 349.697 77.1978C340.477 77.1978 330.242 81.304 322.596 91.4976C318.75 96.6251 316.957 102.146 317.224 108.134C317.491 114.105 319.803 120.48 324.059 127.343L325.176 129.146L325.44 127.042C326.304 120.152 328.993 114.7 332.621 111.288C336.236 107.887 340.789 106.494 345.514 107.675C350.423 108.903 353.94 110.795 356.103 114.468C358.284 118.171 359.175 123.822 358.457 132.779C355.988 139.326 353.342 143.37 349.88 146.361C346.381 149.383 341.994 151.381 335.924 153.749L335.451 153.934L335.447 154.443C335.372 165.418 335.465 171.482 333.459 182.817L333.276 183.845L334.309 183.689C344.122 182.203 350.312 181.847 359.541 181.734L363.702 181.698L364.299 181.694L364.429 181.11C365.881 174.557 367.828 170.132 370.785 166.636C373.688 163.205 377.617 160.608 383.178 157.798L383.823 157.687C392.51 156.198 398.345 156.71 402.417 158.681C406.456 160.637 408.891 164.096 410.632 168.83C412.314 173.401 411.416 178.077 408.423 182.036C405.419 186.008 400.288 189.267 393.531 190.865L391.467 191.353L393.38 192.27Z",
  "M116.485 192.27C109.204 195.765 102.617 197.38 96.6527 197.004C90.6702 196.628 85.374 194.252 80.6888 189.878C71.3744 181.183 68.3892 170.568 69.3783 161.401C70.2883 152.967 75.4375 144.68 81.8919 138.563C88.3301 132.462 96.2331 128.367 102.786 128.548C109.028 128.721 112.825 128.775 116.167 129.221C119.188 129.624 121.831 130.347 125.577 131.735C124.558 127.788 123.913 124.679 123.623 121.23C123.301 117.387 123.42 113.151 123.92 106.888C124.443 100.353 129.363 92.9355 136.119 87.189C142.893 81.428 151.684 77.1978 160.167 77.1978C169.388 77.1979 179.622 81.304 187.268 91.4976C191.114 96.6249 192.907 102.146 192.64 108.134C192.373 114.104 190.061 120.48 185.805 127.343L184.688 129.146L184.424 127.042C183.561 120.152 180.871 114.7 177.244 111.288C173.629 107.887 169.075 106.494 164.35 107.675C159.441 108.903 155.925 110.795 153.761 114.468C151.581 118.171 150.689 123.822 151.408 132.779C153.876 139.325 156.522 143.37 159.985 146.361C163.483 149.382 167.87 151.381 173.94 153.749L174.413 153.934L174.417 154.443C174.492 165.417 174.399 171.482 176.406 182.817L176.588 183.845L175.555 183.689C165.743 182.203 159.553 181.847 150.324 181.734L146.162 181.698L145.565 181.694L145.435 181.11C143.984 174.557 142.036 170.132 139.079 166.636C136.176 163.204 132.247 160.608 126.685 157.798L126.04 157.686C117.353 156.197 111.518 156.71 107.447 158.681C103.408 160.637 100.973 164.095 99.2318 168.829C97.5503 173.4 98.4472 178.077 101.441 182.036C104.445 186.008 109.575 189.267 116.332 190.865L118.397 191.353L116.485 192.27Z",
];

const DIAGONALS: string[] = [
  "M296.698 119.308C261.038 160.643 255.847 189.257 265.698 247.308C329.297 257.555 356.784 250.656 392.698 217.808C342.923 204.674 318.689 210.212 279.198 233.308C305.15 192.026 309.742 167.182 296.698 119.308Z",
  "M214.298 119.308C249.958 160.643 255.149 189.257 245.298 247.308C181.699 257.555 154.212 250.656 118.298 217.808C168.073 204.674 192.307 210.212 231.798 233.308C205.846 192.026 201.254 167.182 214.298 119.308Z",
  "M296.698 393.69C261.038 352.355 255.847 323.741 265.698 265.69C329.297 255.443 356.784 262.342 392.698 295.19C342.923 308.324 318.689 302.787 279.198 279.69C305.15 320.972 309.742 345.816 296.698 393.69Z",
  "M214.298 393.69C249.958 352.355 255.149 323.741 245.298 265.69C181.699 255.443 154.212 262.342 118.298 295.19C168.073 308.324 192.307 302.787 231.798 279.69C205.846 320.972 201.254 345.816 214.298 393.69Z",
];

const CARDINALS: string[] = [
  "M300.197 437.308C274.916 418.289 265.743 403.123 254.697 371.308C242.741 406.475 232.206 420.004 209.197 437.308C233.813 456.16 243.505 470.298 254.697 500.808C265.708 470.173 275.382 456.01 300.197 437.308Z",
  "M300.197 68.3081C274.916 49.2895 265.743 34.1226 254.697 2.30811C242.741 37.4748 232.206 51.0043 209.197 68.3081C233.813 87.1595 243.505 101.298 254.697 131.808C265.708 101.173 275.382 87.0097 300.197 68.3081Z",
  "M65.6973 302.308C84.7159 277.027 99.8828 267.854 131.697 256.808C96.5306 244.852 83.0011 234.317 65.6973 211.308C46.8459 235.924 32.7078 245.616 2.19727 256.808C32.8323 267.819 46.9957 277.493 65.6973 302.308Z",
  "M445.697 302.308C464.716 277.027 479.883 267.854 511.697 256.808C476.531 244.852 463.001 234.317 445.697 211.308C426.846 235.924 412.708 245.616 382.197 256.808C412.832 267.819 426.996 277.493 445.697 302.308Z",
];

// Groups bloom from the centre outwards: inner petals first, corners last.
const GROUPS: { paths: string[]; delay: number; stroke: boolean }[] = [
  { paths: DIAGONALS, delay: 0.05, stroke: true },
  { paths: CARDINALS, delay: 0.3, stroke: true },
  { paths: CORNERS, delay: 0.55, stroke: false },
];

const CSS = `
.ldr-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(60% 50% at 50% 50%, rgba(201,185,154,0.10), rgba(201,185,154,0) 70%),
    ${INK};
  opacity: 1;
  visibility: visible;
  transition: opacity ${FADE_MS}ms ease, visibility ${FADE_MS}ms ease;
}
.ldr-root.ldr-leaving { opacity: 0; visibility: hidden; }

/* Returning visitors (same session): never show the loader at all */
html.ldr-seen .ldr-root { display: none !important; }

.ldr-logo {
  width: clamp(88px, 9vw, 136px);
  height: auto;
  overflow: visible;
  animation: ldr-breathe 3.2s ease-in-out 1.4s infinite;
  transition: transform ${FADE_MS}ms cubic-bezier(.4,0,.2,1), opacity ${FADE_MS}ms ease;
}
.ldr-leaving .ldr-logo { transform: scale(1.14); opacity: 0; }

/* each shape blooms out from the centre of the mark */
.ldr-p {
  opacity: 0;
  transform-box: view-box;
  transform-origin: 257px 251px;
  animation: ldr-in 1s cubic-bezier(.2,.7,.2,1) forwards;
}
@keyframes ldr-in {
  from { opacity: 0; transform: scale(.35) rotate(-14deg); }
  to   { opacity: .3;  transform: scale(1) rotate(0deg); }
}

/* the shimmer: a soft band of light sweeping across, clipped to the logo */
.ldr-sheen {
  animation: ldr-sweep 2.4s cubic-bezier(.45,.05,.3,1) 1.15s infinite;
}
@keyframes ldr-sweep {
  0%   { transform: translateX(0); }
  62%  { transform: translateX(900px); }
  100% { transform: translateX(900px); }
}

@keyframes ldr-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.035); }
}

@media (prefers-reduced-motion: reduce) {
  .ldr-logo, .ldr-sheen { animation: none; }
  .ldr-p { animation: none; opacity: .75; }
  .ldr-sheen { display: none; }
}
`;

export default function Loader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "gone">("loading");

  // Already seen this session? Skip the loader entirely.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) setPhase("gone");
    } catch {
      /* storage blocked: just show the loader */
    }
  }, []);

  // Wait for the page (load event + fonts), respecting MIN_MS / MAX_MS.
  useEffect(() => {
    const start = performance.now();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    let finished = false;

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      timers.push(setTimeout(() => !cancelled && setPhase("leaving"), wait));
    };

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true })
          );
    const fonts = document.fonts?.ready ?? Promise.resolve();

    Promise.all([loaded, fonts]).then(finish);
    timers.push(setTimeout(finish, MAX_MS));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // After the fade, remove the loader from the DOM completely.
  useEffect(() => {
    if (phase !== "leaving") return;
    const t = setTimeout(() => setPhase("gone"), FADE_MS + 100);
    return () => clearTimeout(t);
  }, [phase]);

  // No scrolling underneath while the loader is up.
  useEffect(() => {
    if (phase === "loading") {
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prev;
      };
    }
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      className={`ldr-root${phase === "leaving" ? " ldr-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <style>{CSS}</style>

      <svg
        className="ldr-logo"
        viewBox="0 0 514 503"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* the logo itself, used to clip the shimmer */}
          <mask id="ldr-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="514" height="503">
            {GROUPS.map((g, gi) =>
              g.paths.map((d, i) => (
                <path
                  key={`m-${gi}-${i}`}
                  d={d}
                  fill="#fff"
                  stroke={g.stroke ? "#fff" : undefined}
                  strokeWidth={g.stroke ? 1.5 : undefined}
                  strokeLinecap={g.stroke ? "round" : undefined}
                />
              ))
            )}
          </mask>

          <linearGradient id="ldr-sheen-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff3d6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fffaf0" stopOpacity="1" />
            <stop offset="1" stopColor="#fff3d6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. the dim logo, blooming in shape by shape */}
        {GROUPS.map((g, gi) =>
          g.paths.map((d, i) => (
            <path
              key={`p-${gi}-${i}`}
              className="ldr-p"
              d={d}
              fill="#D9D9D9"
              stroke={g.stroke ? "#D9D9D9" : undefined}
              strokeWidth={g.stroke ? 1.5 : undefined}
              strokeLinecap={g.stroke ? "round" : undefined}
              style={{ animationDelay: `${g.delay + i * 0.09}s` }}
            />
          ))
        )}

        {/* 2. the shimmer, visible only where the logo is */}
        <g mask="url(#ldr-mask)">
          <g transform="rotate(20 257 251)">
            <rect
              className="ldr-sheen"
              x="-300"
              y="-260"
              width="220"
              height="1000"
              fill="url(#ldr-sheen-grad)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}