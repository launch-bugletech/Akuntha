import { Fragment, useState as useSt } from 'react';
import AssessmentForm from './AssessmentForm.jsx';
import { IconArrowRight, IconCheck, IconBolt, IconTools, IconChart, IconShield, IconPlus, IconWallet, IconFactory, IconGrid, IconSun } from './Icons.jsx';
import heroRooftop from '../assests/img/hero-rooftop.jpg';
import industryColdStorage from '../assests/img/industry-coldstorage.jpg';
import industryHospital from '../assests/img/industry-hospital.jpg';
import industryManufacturing from '../assests/img/industry-manufacturing.jpg';
import industryWarehouse from '../assests/img/industry-warehouse.jpg';
import industryHotels from '../assests/img/hotels-hospitality.png';
import industryCampus from '../assests/img/educational-campus.png';
import industryOffice from '../assests/img/commercial-office-building.png';
import industryShop from '../assests/img/retail&shopping-complex.png';

// All content sections (except hero and form) - Nav, Problem, RESCO, Benefits,
// Eligibility, Process, Why Akuntha, Industries, Mid CTA, FAQ, Final CTA, Footer

export function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="brand" href="#" aria-label="Akuntha home">
          <img
            className="brand-logo"
            src="https://akuntha.com/wp-content/uploads/2023/02/akuntha-logo.webp"
            alt="Akuntha"
          />
        </a>
        <div className="nav-actions">
          <a className="btn btn-ghost" href="#assessment" style={{ padding: '10px 18px', fontSize: 13 }}>
            Free Assessment
          </a>
        </div>
      </div>
    </nav>
  );
}

export function Hero({ h1 }) {
  const parts = h1.split(/\*(.+?)\*/g); // *italic* -> em
  return (
    <header className="hero">
      <div className="hero-media">
        <img src={heroRooftop} alt="Solar panels installed on a commercial rooftop" />
      </div>
      <div className="container hero-inner">
        <div className="hero-left">
          <div className="hero-eyebrow-row">
            <span className="dot" aria-hidden="true"></span>
            <span className="eyebrow">Commercial solar without capital investment</span>
          </div>
          <h1 className="h-display hero-h1">
            {parts.map((p, i) => i % 2 === 1
              ? <em key={i}>{p}</em>
              : <Fragment key={i}>{p}</Fragment>
            )}
          </h1>
          <p className="lede hero-sub">
            Reduce electricity costs without blocking capital in solar equipment.
            Share your latest electricity bill and site details. We’ll review whether your factory is suitable for investor-backed solar, financed solar, or direct solar ownership.
          </p>

          <div className="hero-cta-row">
            <a href="#assessment" className="btn btn-primary btn-lg">
              Check My Site Feasibility

              <IconArrowRight size={16} className="arr" />
            </a>
            <a href="#how-it-works" className="link-arrow">
            Learn How RESCO Works <IconArrowRight size={14} />
            </a>
          </div>

          <ul className="trust-list">
            <li><span className="trust-icon"><IconWallet size={16} /></span> Zero upfront solar investment</li>
            <li><span className="trust-icon"><IconFactory size={16} /></span> Designed for C&amp;I facilities</li>
            <li><span className="trust-icon"><IconTools size={16} /></span> Engineering, EPC and O&amp;M in-house</li>
            <li><span className="trust-icon"><IconGrid size={16} /></span> Rooftop and ground-mount capable</li>
          </ul>

          <div className="hero-clarify">
            <strong>Final feasibility depends on</strong> electricity consumption, rooftop or land
            availability, DISCOM rules, finance approval, investor interest, and commercial terms.
          </div>

        </div>

        <aside className="hero-right">
          <AssessmentForm />
        </aside>
      </div>
    </header>
  );
}

export function ProblemSection() {
  return (
    <section className="section" id="problem">
      <div className="container">
        <div className="section-head problem-section-head">
          <div>
            <div className="eyebrow eyebrow-accent mb-4">The cost of grid dependence</div>
            <h2 className="h1 problem-title">Your Factory Can Go Solar Without Paying for the Solar Plant</h2>
          </div>
          <p className="lede">
            Tariffs escalate, operational expenses climb, and margins compress against uncertain
            future power costs. Meanwhile, most industrial facilities sit on unused rooftops and
            open land that could produce electricity onsite.
          </p>
        </div>

        <div className="problem-grid">
          <div className="data-card">
            <div>
              <div className="label">Daytime demand</div>
              <div className="big">High <span className="accent">/</span> peak</div>
            </div>
            <p className="desc">
              Most C&amp;I operations run heaviest loads exactly when solar generates the most creating a natural fit for onsite generation.
            </p>
          </div>
          <div className="data-card">
            <div>
              <div className="label">Monthly outlay</div>
              <div className="big">Significant</div>
            </div>
            <p className="desc">
              Electricity is often a top-three operational expense for manufacturing, cold
              storage and continuous-process facilities.
            </p>
          </div>
          <div className="data-card">
            <div>
              <div className="label">Unused capacity</div>
              <div className="big">Rooftop <span className="accent">+</span> land</div>
            </div>
            <p className="desc">
              Underutilised roof area or open plots often represent measurable, untapped
              generation potential for the site.
            </p>
          </div>
        </div>

        <div className="problem-note">
          A <strong>RESCO project</strong> may convert unused space into a source of lower-cost
          onsite electricity without requiring the business to purchase the solar plant upfront.
        </div>
      </div>
    </section>
  );
}

export function RescoExplainer() {
  const steps = [
    { n: '01', t: 'RESCO partner invests' },
    { n: '02', t: 'Solar plant is installed at your facility' },
    { n: '03', t: 'You buy solar power at an agreed lower tariff' },
    { n: '04', t: 'The plant is operated and maintained' },
  ];
  return (
    <section className="section" id="how-it-works" style={{ background: 'var(--bg-elev)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow eyebrow-accent mb-4">How the model works</div>
            <h2 className="h1">The RESCO solar model, explained in four moves.</h2>
          </div>
          <p className="lede">
            RESCO stands for <em className="serif-italic">Renewable Energy Service Company</em>.
            It re-frames the commercial arrangement so the developer carries the capital
            burden, and your business simply purchases the electricity produced onsite.
          </p>
        </div>

        
        <div className="resco-flow">
          {steps.map((s, i) => (
            <div className="flow-step" key={s.n} style={{ '--step-index': i }}>
              <span className="num">{s.n}</span>
              <div className="title">{s.t}</div>
              {i < steps.length - 1 && <IconArrowRight className="arr" size={16} />}
            </div>
          ))}
        </div>
{/* the annimation flow  */}
        {/* <div className="diagram-wrap" aria-label="Electricity flow from the grid and RESCO solar array to your facility">
          <div className="diagram-heading">
            <div>
              <strong>Dual-source energy flow</strong>
              <span>Solar power is prioritised while the grid remains available as backup.</span>
            </div>
            <span className="diagram-live"><span></span>Live flow</span>
          </div>

          <svg className="diagram-desktop" viewBox="0 0 900 230" xmlns="http://www.w3.org/2000/svg" role="img">
            <g transform="translate(40,30)">
              <rect x="0" y="0" width="120" height="66" rx="8" fill="var(--card)" stroke="#7D82C2" strokeWidth="1.2" />
              <path d="M20 46 L30 20 L38 34 L46 14 L54 46" fill="none" stroke="#7D82C2" strokeWidth="1.4" />
              <text x="60" y="86" textAnchor="middle" className="diag-node-label">GRID SUBSTATION</text>
              <text x="60" y="99" textAnchor="middle" className="diag-node-sub">backup supply</text>
            </g>

            <g transform="translate(40,136)">
              <rect x="0" y="0" width="120" height="50" rx="8" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.2" />
              <path d="M10 10 L50 10 L50 40 L10 40 Z M30 10 V40 M10 25 H50" stroke="var(--accent)" strokeWidth="1" fill="none" />
              <path d="M64 40 L64 15 L100 15" stroke="var(--accent)" strokeWidth="1.2" fill="none" />
              <text x="60" y="68" textAnchor="middle" className="diag-node-label">RESCO SOLAR ARRAY</text>
              <text x="60" y="81" textAnchor="middle" className="diag-node-sub">on your facility</text>
            </g>

            <g transform="translate(690,65)">
              <rect x="0" y="0" width="150" height="100" rx="10" fill="var(--card)" className="facility-outline" strokeWidth="1.6" />
              <text x="75" y="27" textAnchor="middle" className="diag-node-label">YOUR FACILITY</text>
              <text x="75" y="43" textAnchor="middle" className="diag-node-sub">connected load centre</text>
              <path d="M18 100 V72 H42 V100 M61 100 V72 H84 V100 M103 100 V72 H126 V100" className="facility-outline" strokeWidth="1.2" fill="none" />
            </g>

            <path d="M160 63 C 420 63, 480 90, 690 100" fill="none" stroke="#7D82C2" strokeWidth="2" strokeDasharray="6 7">
              <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="1.6s" repeatCount="indefinite" />
            </path>
            <path d="M160 176 C 420 176, 480 130, 690 118" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeDasharray="6 7">
              <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="1.2s" repeatCount="indefinite" />
            </path>
          </svg>

          <div className="diagram-mobile" aria-hidden="true">
            <div className="mobile-source mobile-grid-source">
              <span className="mobile-node-icon"><IconGrid size={20} /></span>
              <strong>Grid station</strong>
              <small>Backup supply</small>
            </div>
            <div className="mobile-source mobile-solar-source">
              <span className="mobile-node-icon"><IconSun size={20} /></span>
              <strong>RESCO solar</strong>
              <small>Primary supply</small>
            </div>
            <svg className="mobile-flow-connectors" viewBox="0 0 320 76" preserveAspectRatio="none">
              <defs>
                <marker id="mobile-flow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
                </marker>
              </defs>
              <path className="mobile-grid-path" d="M78 0 C78 38 140 23 160 57" />
              <path className="mobile-solar-path" d="M242 0 C242 38 180 23 160 57" />
              <path className="mobile-merge-path" d="M160 55 L160 72" markerEnd="url(#mobile-flow-arrow)" />
            </svg>
            <div className="mobile-facility">
              <span className="mobile-node-icon"><IconFactory size={22} /></span>
              <div><strong>Your facility</strong><small>Connected load centre</small></div>
            </div>
          </div>

          <div className="flow-legend">
            <span><span className="legend-swatch solar"></span>Solar electricity (RESCO agreement)</span>
            <span><span className="legend-swatch grid"></span>Grid electricity (backup supply)</span>
          </div>
        </div> */}

        <div className="compare-grid">
          <div className="compare-card">
            <div className="label">Traditional solar purchase</div>
            <h3>You invest in and own the plant.</h3>
            <ul>
              <li><span className="marker">A.</span> Your business funds the solar system using its own capital or financing.</li>
              <li><span className="marker">B.</span> The solar plant becomes a business-owned asset.</li>
              <li><span className="marker">C.</span> A significant upfront investment may be required before installation.</li>
              <li><span className="marker">D.</span> Operations, maintenance, and performance management remain the owner’s responsibility unless separately contracted.</li>
              <li><span className="marker">E.</span> Financial returns are realised gradually over the project payback period.</li>
            </ul>
          </div>
          <div className="compare-card highlight">
            <span className="recommended-badge">Recommended</span>
            <div className="label">The RESCO model</div>
            <h3>You use the electricity, without buying the plant upfront.</h3>
            <ul>
              <li><span className="marker">A.</span> The RESCO developer arranges the project investment.</li>
              <li><span className="marker">B.</span> The solar plant is developed under a project-specific commercial agreement.</li>
              <li><span className="marker">C.</span> Your business purchases the solar electricity generated onsite.</li>
              <li><span className="marker">D.</span> Operations &amp; maintenanceare managed throughout the agreed project term.</li>
              <li><span className="marker">E.</span> The business can begin accessing potential electricity cost savings after the plant becomes operational.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const BENEFITS = [
  {
    n: '01', t: 'Zero Upfront Solar Investment',
    d: 'Preserve capital for production, expansion, staffing, equipment or other business priorities. No solar plant purchase required.',
  },
  {
    n: '02', t: 'Lower Electricity Costs',
    d: 'Use onsite solar to reduce the portion of electricity purchased from the grid. Actual savings depend on site and commercial terms.',
  },
  {
    n: '03', t: 'Professional O&M',
    d: 'Monitoring, preventive maintenance and performance support are managed throughout the agreed project term by Akuntha.',
  },
  {
    n: '04', t: 'Engineering Led Execution',
    d: 'Site assessment, system design, electrical integration, commissioning and technical coordination are handled by one project team.',
  },
  {
    n: '05', t: 'Long-Term Energy Planning',
    d: 'Adopt a more structured approach to electricity cost management and progress on renewable energy commitments.',
  },
  {
    n: '06', t: 'Predictable, Contractual Terms',
    d: 'Commercial arrangements are documented up front so the business understands its energy costs across the project term.',
  },
];

export function BenefitsSection() {
  return (
    <section className="section" id="benefits">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow eyebrow-accent mb-4">Why businesses choose RESCO</div>
            <h2 className="h1">Six ways a RESCO project can support your operation.</h2>
          </div>
          <p className="lede">
            The RESCO structure separates the ownership of the asset from the consumption of the
            energy giving businesses a way to access solar power without redirecting capital
            from operations.
          </p>
        </div>

        <div className="benefits-grid">
          {BENEFITS.map(b => (
            <article className="benefit" key={b.n}>
              <span className="num">{b.n}</span>
              <div>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const ELIGIBILITY_ITEMS = [
  'Your monthly electricity bill is substantial',
  'Most electricity is consumed during daytime hours',
  'Suitable rooftop or open land may be available',
  'You expect to operate from the facility long term',
  'You prefer to preserve capital instead of purchasing the solar system',
  'Your facility can support a long-term commercial energy agreement',
];

export function EligibilitySection() {
  return (
    <section className="section" id="eligibility" style={{ background: 'var(--bg-elev)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow eyebrow-accent mb-4">Self-qualify in 30 seconds</div>
            <h2 className="h1">Could your facility qualify for a RESCO project?</h2>
          </div>
          <p className="lede">
            If most of the statements below apply to your operation, a RESCO project may
            be worth evaluating. Final eligibility is confirmed after a technical and commercial
            assessment.
          </p>
        </div>

        <div className="eligibility-wrap">
          {ELIGIBILITY_ITEMS.map(item => (
            <div className="eligibility-item" key={item}>
              <div className="check-box">
                <IconCheck size={14} stroke={2.5} />
              </div>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="eligibility-caveat">
          <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Please note.</strong> RESCO
          suitability depends on energy consumption, site ownership or permission, structural
          feasibility, applicable regulations, credit evaluation and commercial terms. This
          checklist is a starting point, not a guarantee of approval.
        </div>

        <div style={{ marginTop: 32 }}>
          <a href="#assessment" className="btn btn-primary btn-lg">
            Check My Facility <IconArrowRight size={16} className="arr" />
          </a>
        </div>
      </div>
    </section>
  );
}

const PROCESS = [
  {
    n: '01',
    t: 'Submit Bill and Site Details',
    d: 'Upload your electricity bill, site location, roof photos, rooftop details, and ownership or lease information.'
  },
  {
    n: '02',
    t: 'We Analyze and Call You',
    d: 'Our team reviews your consumption, sanctioned load, tariff, roof status, shadow risk, location, and legal clarity. If needed, we call you for more details.'
  },
  {
    n: '03',
    t: 'Site Visit, If Qualified',
    d: 'If your case looks suitable, our team visits the factory to check the rooftop, structural condition, access, safety, and electrical setup.'
  },
  {
    n: '04',
    t: 'RESCO Fitment Review',
    d: 'A preliminary assessment is prepared to check whether your site may fit RESCO, financed solar, or direct ownership.'
  },
  {
    n: '05',
    t: 'Shared With Stakeholders',
    d: 'Suitable cases may be shared with MAHAPREIT, project stakeholders, or RESCO investors for further review.'
  },
  {
    n: '06',
    t: 'Final Investor Decision',
    d: 'The final go-ahead depends on RESCO investor interest, technical feasibility, commercial terms, documentation, DISCOM conditions, and agreement approval.'
  }
];

export function ProcessSection() {
  return (
    <section className="section" id="process">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow eyebrow-accent mb-4">The process</div>
            <h2 className="h1">How Your Factory Gets Reviewed</h2>
          </div>
          <p className="lede">
            Every RESCO engagement follows a consistent path so decision makers understand
            what happens next, what's required from the business, and how long each stage
            typically takes.
          </p>
        </div>

        <ol className="timeline" style={{ listStyle: 'none', padding: '0 0 0 40px', margin: 0 }}>
          {PROCESS.map(p => (
            <li className="timeline-item" key={p.n}>
              <span className="timeline-node"></span>
              <span className="timeline-num">- {p.n}</span>
              <h3 className="timeline-title">{p.t}</h3>
              <p className="desc">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const WHY = [
  { Icon: IconBolt, t: 'Electrical Infrastructure Experience',
    d: 'Experience across power distribution, transformers, substations, protection systems, synchronization, and facility-level electrical integration.' },
  { Icon: IconTools, t: 'EPC and O&M Delivery',
    d: 'Technical surveys, system design, procurement coordination, installation, testing, and commissioning managed as part of the approved project plan.' },
  { Icon: IconChart, t: 'Commercial & Industrial Focus',
    d: 'Project planning adapted to the electricity demand, operating schedule, safety requirements, available space, and existing infrastructure of each facility.' },
  { Icon: IconShield, t: 'Coordinated Project Delivery',
    d: 'Engineering, commercial, approval, execution, and operational responsibilities are coordinated across the relevant project partners.' },
];

export function WhySection() {
  return (
    <section className="section" id="why" style={{ background: 'var(--bg-elev)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow eyebrow-accent mb-4">PROJECT DELIVERY CAPABILITY</div>
            <h2 className="h1">Engineering capability behind every RESCO project.</h2>
          </div>
          <p className="lede">RESCO projects combine commercial investment with technical engineering and execution. The relevant project partners coordinate site assessment, Solar EPC, electrical integration, commissioning, and long term operational support.</p>
        </div>

        <div className="why-grid">
          {WHY.map(w => (
            <article className="why-card" key={w.t}>
              <div className="icon"><w.Icon size={20} /></div>
              <div>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </div>
            </article>
          ))}
        </div>

        {/* <div className="proof-strip">
          <div className="proof-cell">
            <div className="big">15<span className="unit">+</span></div>
            <div className="label">Years of experience</div>
          </div>
          <div className="proof-cell">
            <div className="big">XX<span className="unit"> MW</span></div>
            <div className="label">Installed / managed</div>
          </div>
          <div className="proof-cell">
            <div className="big">XX<span className="unit">+</span></div>
            <div className="label">Industrial projects</div>
          </div>
          <div className="proof-cell">
            <div className="big">XX</div>
            <div className="label">Service regions</div>
          </div>
        </div> */}
      </div>
    </section>
  );
}

const INDUSTRIES = [
  { n: '01', t: 'Manufacturing & Industrial Plants', d: 'High daytime loads and continuous production align well with onsite generation.', img: industryManufacturing },
  { n: '02', t: 'Warehouses & Logistics', d: 'Large flat rooftops often make ideal generation surfaces with minimal shading.', img: industryWarehouse },
  { n: '03', t: 'Cold Storage Facilities', d: 'Consistent daytime refrigeration loads can make onsite solar worth evaluating.', img: industryColdStorage },
  { n: '04', t: 'Hospitals & Healthcare', d: 'Round-the-clock demand with a steady daytime baseline for the solar profile.', img: industryHospital },
  { n: '05', t: 'Hotels & Hospitality', d: 'Kitchens, HVAC and laundry create high daytime demand across the property.', img: industryHotels },
  { n: '06', t: 'Educational Campuses', d: 'Large roof and land areas often available across academic buildings and dorms.', img: industryCampus },
  { n: '07', t: 'Commercial Buildings', d: 'Office and mixed-use properties with significant HVAC and lighting loads.', img: industryOffice },
  { n: '08', t: 'Retail & Shopping Complexes', d: 'Extended daytime hours and cooling loads make retail a natural RESCO fit.', img: industryShop },
];

export function IndustriesSection() {
  return (
    <section className="section" id="industries">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow eyebrow-accent mb-4">Industries served</div>
            <h2 className="h1">Built for facilities that actually run on daytime power.</h2>
          </div>
          <p className="lede">
            RESCO is best suited to businesses where a meaningful share of electricity is used
            during daylight hours and where suitable rooftop or open land may be available.
          </p>
        </div>

        <div className="industries-grid">
          {INDUSTRIES.map(ind => (
            <article className={`industry-card ${ind.img ? '' : 'placeholder'}`} key={ind.n}>
              {ind.img && (
                <div className="img-wrap">
                  <img src={ind.img} alt="" loading="lazy" />
                </div>
              )}
              <div className="content">
                <span className="num">{ind.n}</span>
                <div>
                  <h3>{ind.t}</h3>
                  <p>{ind.d}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MidCTA() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="midcta">
          <div>
            <div className="eyebrow eyebrow-accent mb-4">Project assessment</div>
            <h2 className="h1">Find out whether RESCO solar fits your facility.</h2>
            <p>
              Share your monthly electricity usage and basic site details. Akuntha's engineering team will review the opportunity and discuss the appropriate next step usually within two business days.
            </p>
          </div>
          <div className="actions">
            <a href="#assessment" className="btn btn-primary btn-lg">
              Start My Free Assessment <IconArrowRight size={16} className="arr" />
            </a>
            <span className="small">No payment required · Technical &amp; commercial evaluation applies</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: 'What is this solar review for?',
    a: 'This review helps check whether your factory, MSME unit, warehouse, or commercial facility may be suitable for solar power through different project models such as RESCO, finance-supported solar, or direct solar ownership.\n\nThe review starts with your electricity bill, site location, roof details, and ownership / lease information.',
  },
  {
    q: 'What does “go solar without buying the plant” mean?',
    a: 'In some project models, a RESCO investor or solar project partner may invest in the solar plant, install it at your facility, and operate it under a commercial agreement.\n\nYour business then receives solar electricity at an agreed tariff, usually with the objective of reducing exposure to higher DISCOM electricity rates.\n\nFinal terms depend on investor approval, site feasibility, tariff structure, billing commitments, and agreement conditions.',
  },
  {
    q: 'What is RESCO?',
    a: 'RESCO stands for Renewable Energy Service Company.\n\nIn simple terms, it is a model where the solar plant may be funded, installed, operated, and maintained by a project developer or investor. The factory or business purchases solar electricity under agreed commercial terms instead of buying the solar plant upfront.',
  },
  {
    q: 'Is RESCO available for every factory?',
    a: 'No. RESCO is not suitable for every factory.\n\nThe final decision depends on electricity consumption, sanctioned load, tariff category, roof area availability, shadow conditions, structure strength, site access, legal clarity, business stability, investor interest, DISCOM rules, and commercial viability.',
  },
  {
    q: 'What details do I need to submit?',
    a: 'To start the review, you should share:\n\n• Latest electricity bill\n• Factory / company name\n• Site location\n• Monthly electricity consumption or bill amount\n• Sanctioned load / contract demand, if available\n• Roof photos\n• Approximate rooftop area\n• Ownership / lease status\n• Contact person details\n\nThe more accurate your details, the better the first-level review will be.',
  },
  {
    q: 'Why do you need roof photos and site details?',
    a: 'Roof photos and site details help us understand whether solar installation is practically possible.\n\nWe check factors such as available area, shadow, roof type, structure condition, access, safety, and possible installation layout.',
  },
  {
    q: 'Why do you ask for ownership or lease information?',
    a: 'RESCO investors and project partners need clarity on who controls the site and whether the solar plant can legally remain installed for the agreement period.\n\nIf the property is leased or rented, roof rights, landlord permission, lease duration, and site-use permission may become important.',
  },
  {
    q: 'Will your team visit our factory?',
    a: 'A site visit may be arranged only if your factory appears suitable after the first level review.\n\nDuring the visit, the team may check rooftop or area availability, shadow conditions, structure, electrical infrastructure, access, safety, and practical feasibility.',
  },
  {
    q: 'What happens after the site visit?',
    a: 'After the review and site assessment, a preliminary fitment note may be prepared.\n\nIf the case looks suitable, it may be shared with relevant stakeholders, MAHAPREIT-linked process participants, RESCO investors, finance partners, or project partners for further technical-commercial review.',
  },
  {
    q: 'Does submitting my details guarantee RESCO approval?',
    a: 'No. Submission of your details does not guarantee RESCO approval, investor selection, finance approval, project execution, or savings.\n\nThe final decision rests with the RESCO investor / project partner and depends on technical feasibility, commercial viability, investor interest, DISCOM conditions, documentation, legal clarity, and final agreement terms.',
  },
  {
    q: 'Who decides whether my factory gets selected?',
    a: 'The final decision is made by the concerned RESCO investor, project partner, lender, or relevant stakeholder after reviewing the technical, commercial, legal, and financial feasibility of the site.\n\nOur role is to collect details, conduct initial review, assess fitment, and facilitate further consideration where suitable.',
  },
  {
    q: 'What if my factory is not suitable for RESCO?',
    a: 'If your factory is not suitable for RESCO, other options may still be explored.\n\nThese may include:\n\n• Finance-supported solar ownership\n• Direct EPC / solar plant purchase\n• Smaller rooftop solar project\n• Group or cluster-level solar opportunity\n• Future investor-backed project consideration\n\nThe right route depends on your electricity bill, site condition, capital preference, credit profile, and commercial feasibility.',
  },
  {
    q: 'Can you help arrange finance for solar?',
    a: 'Yes, finance-supported solar options may be explored where suitable.\n\nPossible routes may include bank finance, NBFC finance, vendor-supported finance, structured project finance, or other commercial funding options.\n\nFinance approval depends on lender policy, business profile, credit evaluation, documentation, collateral requirement, project size, and repayment capacity.',
  },
  {
    q: 'Will solar definitely reduce my electricity cost?',
    a: 'Solar may help reduce electricity cost, but savings are not guaranteed until technical and commercial evaluation is completed.\n\nSavings depend on your current DISCOM tariff, electricity usage pattern, solar generation, project size, agreement tariff, billing terms, minimum commitments, finance cost, and final project structure.',
  },
  {
    q: 'How is monthly billing done in RESCO?',
    a: 'In a RESCO model, billing is usually based on the commercial terms agreed between the business and the RESCO investor / project partner.\n\nThe agreement may include solar tariff, billing cycle, minimum commitments, deemed generation, payment terms, escalation, agreement period, and other commercial conditions.\n\nThese terms are finalized before project execution.',
  },
  {
    q: 'Will the solar tariff be lower than my DISCOM rate?',
    a: 'The objective is generally to offer solar power at a commercially attractive rate compared to the applicable DISCOM tariff.\n\nHowever, the final tariff depends on project size, site feasibility, generation estimate, investor expectations, agreement period, risk factors, DISCOM rules, and commercial negotiation.',
  },
  {
    q: 'Who will own the solar plant?',
    a: 'In a RESCO model, the solar plant is generally owned or controlled by the RESCO investor / project developer as per the agreement structure.\n\nIn finance-supported or direct purchase models, the business may own the solar plant.\n\nOwnership depends on the final model selected.',
  },
  {
    q: 'Who handles operation and maintenance?',
    a: 'In a RESCO model, operation and maintenance are generally handled by the project developer / RESCO partner as per the agreement.\n\nIn ownership models, operation and maintenance may be handled by the business, EPC company, or a separate O&M service provider.',
  },
  {
    q: 'Is this a government application?',
    a: 'No. This is a solar feasibility review and project facilitation inquiry.\n\nAny government-backed tender process, MAHAPREIT-linked process, RESCO investor review, DISCOM approval, finance approval, or project execution will follow its own rules, documentation, and approval process.',
  },
  {
    q: 'What types of businesses should apply?',
    a: 'This review is suitable for:\n\n• MSME units\n• Factories\n• Warehouses\n• Cold storage units\n• Engineering units\n• Textile units\n• Plastic units\n• Packaging units\n• Food processing units\n• Pharma units\n• Ceramic units\n• Commercial buildings\n• Hospitals and institutions\n• Industrial estate units with high electricity consumption\n\nBusinesses with high daytime power usage and available rooftop or area are usually better candidates.',
  },
  {
    q: 'What is the first step?',
    a: 'The first step is simple.\n\nSubmit your latest electricity bill, site location, roof photos, rooftop details, and ownership or lease information.\n\nOur team will review the details and contact you if more information is needed.',
  },
];

function FaqItem({ q, a, defaultOpen }) {
  const [open, setOpen] = useSt(defaultOpen || false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <IconPlus className="faq-toggle" size={22} />
      </button>
      <div className="faq-answer">
        <div className="faq-answer-inner">{a}</div>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow eyebrow-accent mb-4">Frequently asked</div>
            <h2 className="h1">FAQs for Factory / MSME Solar</h2>
          </div>
          <p className="lede">
            The most common questions we hear from operations, finance and facilities teams
            evaluating a RESCO project for the first time.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container">
        <div className="eyebrow eyebrow-accent">Next step</div>
        <h2 className="h-display">Let's evaluate your solar opportunity.</h2>
        <p className="lede" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          Complete the free assessment and our team will review your facility, electricity
          consumption and potential installation area.
        </p>
        <div className="actions">
          <a href="#assessment" className="btn btn-primary btn-lg">
            Get a Free RESCO Project Assessment <IconArrowRight size={16} className="arr" />
          </a>
          <a href="mailto:solar@akuntha.example" className="link-arrow">
            Speak with our commercial solar team <IconArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-bottom">
          <span>© 2026 Akuntha Projects. All rights reserved.</span>
          <span>Eligibility subject to technical, commercial and regulatory evaluation.</span>
        </div>
      </div>
    </footer>
  );
}
