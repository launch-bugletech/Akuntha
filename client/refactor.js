import fs from 'fs';
import path from 'path';

const SRC = "d:/Work/Bugle Technologies/Akuntha/Akunthaform/client/src";
const ROOT = "d:/Work/Bugle Technologies/Akuntha/Akunthaform/client";

// 1. Icons.jsx
let iconsContent = fs.readFileSync(path.join(SRC, 'components/Icons.jsx'), 'utf-8');
iconsContent = "import React from 'react';\n" + iconsContent;
iconsContent = iconsContent.replace(/const Icon /g, "export const Icon ");
iconsContent = iconsContent.replace(/const Icon(\w+) =/g, "export const Icon$1 =");
iconsContent = iconsContent.replace(/Object\.assign\(window,[\s\S]*?\);/, "");
fs.writeFileSync(path.join(SRC, 'components/Icons.jsx'), iconsContent);

// 2. AssessmentForm.jsx
let formContent = fs.readFileSync(path.join(SRC, 'components/AssessmentForm.jsx'), 'utf-8');
formContent = formContent.replace(/const \{ useState, useMemo \} = React;/, "import React, { useState, useMemo } from 'react';\nimport { IconFactory, IconWarehouse, IconSnowflake, IconBuilding, IconHospital, IconHotel, IconSchool, IconRetail, IconOther, IconArrowLeft, IconArrowRight, IconPlus, IconCheck } from './Icons.jsx';");
formContent = formContent.replace(/window\.AssessmentForm = AssessmentForm;/, "export default AssessmentForm;");
fs.writeFileSync(path.join(SRC, 'components/AssessmentForm.jsx'), formContent);

// 3. Sections.jsx
let sectionsContent = fs.readFileSync(path.join(SRC, 'components/Sections.jsx'), 'utf-8');
sectionsContent = sectionsContent.replace(/const \{ useState: useSt \} = React;/, "import React, { useState as useSt } from 'react';\nimport AssessmentForm from './AssessmentForm.jsx';\nimport { IconArrowRight, IconCheck, IconBolt, IconTools, IconChart, IconShield, IconPlus } from './Icons.jsx';");
sectionsContent = sectionsContent.replace(/function Nav\(/, "export function Nav(");
sectionsContent = sectionsContent.replace(/function Hero\(/, "export function Hero(");
sectionsContent = sectionsContent.replace(/function ProblemSection\(/, "export function ProblemSection(");
sectionsContent = sectionsContent.replace(/function RescoExplainer\(/, "export function RescoExplainer(");
sectionsContent = sectionsContent.replace(/function BenefitsSection\(/, "export function BenefitsSection(");
sectionsContent = sectionsContent.replace(/function EligibilitySection\(/, "export function EligibilitySection(");
sectionsContent = sectionsContent.replace(/function ProcessSection\(/, "export function ProcessSection(");
sectionsContent = sectionsContent.replace(/function WhyAkunthaSection\(/, "export function WhyAkunthaSection(");
sectionsContent = sectionsContent.replace(/function IndustriesSection\(/, "export function IndustriesSection(");
sectionsContent = sectionsContent.replace(/function MidCTA\(/, "export function MidCTA(");
sectionsContent = sectionsContent.replace(/function FaqSection\(/, "export function FaqSection(");
sectionsContent = sectionsContent.replace(/function FinalCTA\(/, "export function FinalCTA(");
sectionsContent = sectionsContent.replace(/function Footer\(/, "export function Footer(");
sectionsContent = sectionsContent.replace(/Object\.assign\(window,[\s\S]*?\);/, "");
fs.writeFileSync(path.join(SRC, 'components/Sections.jsx'), sectionsContent);

// 4. tweaks_panel.jsx
let tweaksContent = fs.readFileSync(path.join(SRC, 'tweaks_panel.jsx'), 'utf-8');
tweaksContent = tweaksContent.replace(/function useTweaks/, "export function useTweaks");
tweaksContent = tweaksContent.replace(/function TweaksPanel/, "export function TweaksPanel");
tweaksContent = tweaksContent.replace(/function TweakSection/, "export function TweakSection");
tweaksContent = tweaksContent.replace(/function TweakRow/, "export function TweakRow");
tweaksContent = tweaksContent.replace(/function TweakSlider/, "export function TweakSlider");
tweaksContent = tweaksContent.replace(/function TweakToggle/, "export function TweakToggle");
tweaksContent = tweaksContent.replace(/function TweakRadio/, "export function TweakRadio");
tweaksContent = tweaksContent.replace(/function TweakSelect/, "export function TweakSelect");
tweaksContent = tweaksContent.replace(/function TweakText/, "export function TweakText");
tweaksContent = tweaksContent.replace(/function TweakNumber/, "export function TweakNumber");
tweaksContent = tweaksContent.replace(/function TweakColor/, "export function TweakColor");
tweaksContent = tweaksContent.replace(/function TweakButton/, "export function TweakButton");
tweaksContent = tweaksContent.replace(/Object\.assign\(window,[\s\S]*?\);/g, "");
tweaksContent = tweaksContent.replace(/Object\.assign\(window, \{ TweakSuggestionBar \}\);/g, "");
tweaksContent = "import React from 'react';\n" + tweaksContent;
fs.writeFileSync(path.join(SRC, 'tweaks_panel.jsx'), tweaksContent);

// 5. App.jsx
const appContent = `import React, { useEffect } from 'react';
import { Nav, Hero, ProblemSection, RescoExplainer, BenefitsSection, EligibilitySection, ProcessSection, WhyAkunthaSection, IndustriesSection, MidCTA, FaqSection, FinalCTA, Footer } from './components/Sections.jsx';
import { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakText } from './tweaks_panel.jsx';

const TWEAK_DEFAULTS = {
  "accent": "#E97451",
  "theme": "light",
  "heroH1": "Reduce your business electricity costs without *investing* in a solar plant."
};

const ACCENT_OPTIONS = [
  "#4C8DFF", // electric blue (default)
  "#3EB489", // Akuntha green
  "#F5B547", // solar yellow
  "#E97451", // industrial rust
];

function applyAccent(hex) {
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-hi', hex + 'CC');
  const soft = hex + '24';
  root.style.setProperty('--accent-soft', soft);
  root.style.setProperty('--accent-ink', '#0A1220');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => { applyAccent(tweaks.accent); }, [tweaks.accent]);
  useEffect(() => { applyTheme(tweaks.theme); }, [tweaks.theme]);

  return (
    <>
      <Nav />
      <Hero h1={tweaks.heroH1} />
      <ProblemSection />
      <RescoExplainer />
      <BenefitsSection />
      <EligibilitySection />
      <ProcessSection />
      <WhyAkunthaSection />
      <IndustriesSection />
      <MidCTA />
      <FaqSection />
      <FinalCTA />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand">
          <TweakColor
            label="Accent color"
            value={tweaks.accent}
            onChange={v => setTweak('accent', v)}
            options={ACCENT_OPTIONS}
          />
          <TweakRadio
            label="Theme"
            value={tweaks.theme}
            onChange={v => setTweak('theme', v)}
            options={[
              { value: 'dark',     label: 'Navy' },
              { value: 'charcoal', label: 'Charcoal' },
              { value: 'light',    label: 'Light' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Hero copy">
          <TweakText
            label="Headline"
            value={tweaks.heroH1}
            onChange={v => setTweak('heroH1', v)}
            placeholder="Wrap *text* in asterisks for italic accent."
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

export default App;
`;
fs.writeFileSync(path.join(SRC, 'App.jsx'), appContent);

// 6. main.jsx
const mainContent = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;
fs.writeFileSync(path.join(SRC, 'main.jsx'), mainContent);

// 7. index.html
const indexContent = \`<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Akuntha · Commercial Solar Without Capital Investment</title>
  <meta name="description" content="Reduce your business electricity costs without investing in a solar plant. Akuntha delivers commercial and industrial solar through the RESCO model — engineering, EPC and O&M in one team." />

  <!-- Fonts: editorial serif + technical sans + mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>\`;
fs.writeFileSync(path.join(ROOT, 'index.html'), indexContent);
