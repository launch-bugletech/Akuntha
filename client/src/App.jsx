import { useEffect } from "react";
import {
  TweakButton,
  TweakColor,
  TweakRadio,
  TweakSection,
  TweakSlider,
  TweakText,
  TweaksPanel,
  useTweaks,
} from "./tweaks_panel.jsx";
import {
  BenefitsSection,
  EligibilitySection,
  FaqSection,
  FinalCTA,
  Footer,
  Hero,
  IndustriesSection,
  MidCTA,
  Nav,
  ProblemSection,
  ProcessSection,
  RescoExplainer,
  WhySection,
} from "./components/Sections.jsx";

// Change this single value to false to hide the customization menu.
const ENABLE_CUSTOMIZATION_MENU = false;

const TWEAK_DEFAULTS = {
  accent: "#E97451",
  theme: "light",
  heroH1: "Your Factory Can Go Solar Without Paying for the *Solar Plant*",
  headingFont: "work-sans",
  bodyFont: "roboto",
  fontSize: 16,
  sectionDensity: "balanced",
  containerWidth: 1200,
  cornerRadius: 10,
};

const ACCENT_OPTIONS = ["#4C8DFF", "#3EB489", "#F5B547", "#E97451"];

const SECTION_SPACING = {
  compact: "clamp(48px, 6vw, 88px)",
  balanced: "clamp(64px, 8vw, 128px)",
  airy: "clamp(80px, 10vw, 152px)",
};

function applyAppearance(tweaks) {
  const root = document.documentElement;
  root.setAttribute("data-theme", tweaks.theme);
  root.style.setProperty("--accent", tweaks.accent);
  root.style.setProperty("--accent-hi", `${tweaks.accent}CC`);
  root.style.setProperty("--accent-soft", `${tweaks.accent}24`);
  root.style.setProperty("--accent-ink", "#0A1220");
  root.style.setProperty(
    "--serif",
    tweaks.headingFont === "work-sans"
      ? '"Work Sans", sans-serif'
      : '"Source Serif 4", "Newsreader", "Iowan Old Style", Georgia, serif',
  );
  root.style.setProperty(
    "--sans",
    tweaks.bodyFont === "roboto"
      ? 'Roboto, sans-serif'
      : '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  );
  root.style.setProperty("--base-font-size", `${tweaks.fontSize}px`);
  root.style.setProperty("--section-y", SECTION_SPACING[tweaks.sectionDensity]);
  root.style.setProperty("--container", `${tweaks.containerWidth}px`);
  root.style.setProperty("--radius", `${tweaks.cornerRadius}px`);
  root.style.setProperty("--radius-lg", `${tweaks.cornerRadius + 6}px`);
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS, "akuntha-page-tweaks-v5");

  useEffect(() => {
    applyAppearance(tweaks);
  }, [tweaks]);

  return (
    <>
      <Nav />
      <main>
        <Hero h1={tweaks.heroH1} />
        {/* <ProblemSection />*/}
        <RescoExplainer />
        <BenefitsSection />
        <EligibilitySection />
        <ProcessSection />
        <WhySection />
        <IndustriesSection />
        <MidCTA />
        <FaqSection />
        <FinalCTA />
      </main>
      <Footer />

      {ENABLE_CUSTOMIZATION_MENU && (
      <TweaksPanel title="Customize page" defaultOpen>
        <TweakSection label="Brand">
          <TweakColor
            label="Accent color"
            value={tweaks.accent}
            options={ACCENT_OPTIONS}
            onChange={(value) => setTweak("accent", value)}
          />
          <TweakRadio
            label="Theme"
            value={tweaks.theme}
            options={[
              { value: "dark", label: "Navy" },
              { value: "charcoal", label: "Charcoal" },
              { value: "light", label: "Light" },
            ]}
            onChange={(value) => setTweak("theme", value)}
          />
        </TweakSection>

        <TweakSection label="Hero copy">
          <TweakText
            label="Headline"
            value={tweaks.heroH1}
            placeholder="Use *asterisks* for italic text"
            onChange={(value) => setTweak("heroH1", value)}
          />
        </TweakSection>

        <TweakSection label="Typography">
          <TweakRadio
            label="Heading font"
            value={tweaks.headingFont}
            options={[
              { value: "existing", label: "Existing" },
              { value: "work-sans", label: "Work Sans" },
            ]}
            onChange={(value) => setTweak("headingFont", value)}
          />
          <TweakRadio
            label="Text font"
            value={tweaks.bodyFont}
            options={[
              { value: "existing", label: "Existing" },
              { value: "roboto", label: "Roboto" },
            ]}
            onChange={(value) => setTweak("bodyFont", value)}
          />
          <TweakSlider
            label="Base font size"
            value={tweaks.fontSize}
            min={14}
            max={19}
            step={1}
            unit="px"
            onChange={(value) => setTweak("fontSize", value)}
          />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio
            label="Section spacing"
            value={tweaks.sectionDensity}
            options={[
              { value: "compact", label: "Compact" },
              { value: "balanced", label: "Normal" },
              { value: "airy", label: "Airy" },
            ]}
            onChange={(value) => setTweak("sectionDensity", value)}
          />
          <TweakSlider
            label="Content width"
            value={tweaks.containerWidth}
            min={1040}
            max={1920}
            step={40}
            unit="px"
            onChange={(value) => setTweak("containerWidth", value)}
          />
          <TweakSlider
            label="Corner radius"
            value={tweaks.cornerRadius}
            min={0}
            max={24}
            step={2}
            unit="px"
            onChange={(value) => setTweak("cornerRadius", value)}
          />
        </TweakSection>

        <TweakButton
          label="Reset to defaults"
          secondary
          onClick={() => setTweak({ ...TWEAK_DEFAULTS })}
        />
      </TweaksPanel>
      )}
    </>
  );
}

export default App;
