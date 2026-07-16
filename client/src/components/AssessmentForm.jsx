import { useEffect, useMemo, useRef, useState } from 'react';
import { IconFactory, IconWarehouse, IconSnowflake, IconBuilding, IconHospital, IconHotel, IconSchool, IconRetail, IconOther, IconArrowLeft, IconArrowRight, IconPlus, IconCheck, IconChevronDown } from './Icons.jsx';
import FacilityMap from './FacilityMap.jsx';

// 4-step Assessment Form — sticky right column of hero

const FACILITY_OPTIONS = [
  { id: 'factory',       label: 'Factory / Industrial', Icon: IconFactory },
  { id: 'warehouse',     label: 'Warehouse',    Icon: IconWarehouse },
  { id: 'cold_storage',  label: 'Cold Storage', Icon: IconSnowflake },
  { id: 'commercial',    label: 'Commercial Building', Icon: IconBuilding },
  { id: 'hospital',      label: 'Hospital',     Icon: IconHospital },
  { id: 'hotel',         label: 'Hotel',        Icon: IconHotel },
  { id: 'education',     label: 'Educational',  Icon: IconSchool },
  { id: 'retail',        label: 'Retail / Mall',Icon: IconRetail },
  { id: 'other',         label: 'Other',        Icon: IconOther },
];

const BILL_OPTIONS = [
  'Below ₹50,000',
  '₹50,000 - ₹1 lakh',
  '₹1 - ₹3 lakh',
  '₹3 - ₹5 lakh',
  'Above ₹5 lakh',
  'Not sure',
];

const OWNERSHIP = ['Owned', 'Leased', 'Shared ownership', 'Managed property', 'Not sure'];
const SITE_OPTIONS = ['Rooftop', 'Open land', 'Both', 'Not sure'];
const OBJECTIVE_OPTIONS = [
  'Reduce electricity costs',
  'Avoid upfront capital investment',
  'Meet sustainability / ESG goals',
  'Support facility expansion',
  'Explore solar feasibility',
];
const CONTACT_TIMES = ['Morning', 'Afternoon', 'Evening', 'No preference'];

function AssessmentForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const formRef = useRef(null);
  const previousStepRef = useRef(step);
  const [data, setData] = useState({
    facility: '',
    state: '', city: '', landmark: '', pincode: '',
    latitude: null, longitude: null, locationSource: '', locationLabel: '',
    bill: '', consumption: '', ownership: '',
    site: '', area: '', areaUnit: 'sq ft', notSureArea: false, objective: '',
    company: '', contact: '', mobile: '', email: '', contactTime: '',
    fileName: '', billFile: null, billFileError: '',
    consent: true,
  });

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  useEffect(() => {
    if (previousStepRef.current === step) return;

    previousStepRef.current = step;
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const totalSteps = 4;
  const canNext = useMemo(() => {
    if (step === 1) return data.facility && data.state && data.city && data.pincode;
    if (step === 2) return data.site && data.ownership;
    if (step === 3) return data.bill;
    if (step === 4) {
      return data.company
        && data.contact
        && data.mobile
        && data.email
        && data.objective
        && data.consent;
    }
    return false;
  }, [step, data]);

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else if (canNext) setDone(true);
  };
  const back = () => setStep(Math.max(1, step - 1));

  if (done) return <SuccessScreen data={data} onReset={() => { setDone(false); setStep(1); }} />;

  return (
    <div className="form-card" id="assessment" ref={formRef}>
      <div className="form-head">
        <h3 className="form-title">Get a Free RESCO Project Assessment</h3>
        <p className="form-sub">
          Answer a few questions about your facility and electricity use. Our engineering team
          will assess whether your site may be suitable for a RESCO project.
        </p>
      </div>

      <div className="form-progress">
        <span className="form-step-label">
          <span className="cur">Step {step}</span> of {totalSteps}
        </span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>

      <div className="form-step-content" key={step}>
        {step === 1 && <Step1 data={data} set={set} />}
        {step === 2 && <Step2 data={data} set={set} />}
        {step === 3 && <Step3 data={data} set={set} />}
        {step === 4 && <Step4 data={data} set={set} />}
      </div>

      <div className="form-nav">
        <button
          className="back"
          onClick={back}
          disabled={step === 1}
        >
          <IconArrowLeft size={14} /> Back
        </button>
        <button
          className="btn btn-primary"
          onClick={next}
          disabled={!canNext}
          style={!canNext ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
        >
          {step === 4 ? 'Request My Free RESCO Assessment' : 'Continue'}
          <IconArrowRight size={14} className="arr" />
        </button>
      </div>

      <p className="form-footer-note">
        {step === 4
          ? 'No payment is required. Submission does not guarantee RESCO eligibility or project approval.'
          : 'No payment is required to submit this assessment.'}
      </p>
    </div>
  );
}

// ----- STEP 1: Facility profile -----
function Step1({ data, set }) {
  const [facilityOpen, setFacilityOpen] = useState(false);
  const selectedFacility = FACILITY_OPTIONS.find(option => option.id === data.facility);
  const SelectedFacilityIcon = selectedFacility?.Icon || IconFactory;

  return (
    <>
      <p className="form-q-title">What type of facility are you evaluating?</p>
      <div className="choice-grid facility-choice-grid">
        {FACILITY_OPTIONS.map((option) => {
          const FacilityIcon = option.Icon;

          return (
            <button
              key={option.id}
              className={`choice ${data.facility === option.id ? 'selected' : ''}`}
              onClick={() => set('facility', option.id)}
              type="button"
            >
              <FacilityIcon size={16} className="ic" />
              {option.label}
            </button>
          );
        })}
      </div>

      <div
        className={`facility-select ${facilityOpen ? 'open' : ''}`}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setFacilityOpen(false);
        }}
      >
        <button
          type="button"
          className="facility-select-trigger"
          aria-expanded={facilityOpen}
          aria-controls="facility-options"
          onClick={() => setFacilityOpen(open => !open)}
        >
          <span className="facility-select-value">
            <SelectedFacilityIcon size={17} />
            {selectedFacility?.label || 'Select facility type'}
          </span>
          <IconChevronDown className="facility-select-chevron" size={17} />
        </button>

        {facilityOpen && (
          <div className="facility-select-menu" id="facility-options" role="listbox">
            {FACILITY_OPTIONS.map((option) => {
              const FacilityIcon = option.Icon;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={data.facility === option.id}
                  className={`facility-select-option ${data.facility === option.id ? 'selected' : ''}`}
                  key={option.id}
                  onClick={() => {
                    set('facility', option.id);
                    setFacilityOpen(false);
                  }}
                >
                  <FacilityIcon size={17} />
                  <span>{option.label}</span>
                  {data.facility === option.id && <IconCheck className="option-check" size={15} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="form-q-title">Where is the facility located?</p>
      <div className="input-row">
        <div className="field">
          <label>State</label>
          <input value={data.state} onChange={e => set('state', e.target.value)} placeholder="e.g. Maharashtra" />
        </div>
        <div className="field">
          <label>City</label>
          <input value={data.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Pune" />
        </div>
      </div>
      <div className="input-row stack">
        <div className="field">
          <label>Landmark / locality</label>
          <input
            value={data.landmark}
            onChange={e => set('landmark', e.target.value)}
            placeholder="e.g. Sarangpur"
          />
        </div>
      </div>
      <div className="input-row stack">
        <div className="field">
          <label>Pincode</label>
          <input
            value={data.pincode}
            onChange={e => set('pincode', e.target.value.replace(/\D/g, '').slice(0,6))}
            placeholder="6-digit"
            inputMode="numeric"
          />
        </div>
      </div>
      <FacilityMap
        pincode={data.pincode}
        latitude={data.latitude}
        longitude={data.longitude}
        onLocationChange={(updates) => Object.entries(updates).forEach(([key, value]) => set(key, value))}
      />
    </>
  );
}

// ----- STEP 2: Site & property -----
function Step2({ data, set }) {
  return (
    <>
      <p className="form-q-title">Where could solar potentially be installed?</p>
      <div className="choice-grid compact">
        {SITE_OPTIONS.map(o => (
          <button
            key={o}
            className={`choice ${data.site === o ? 'selected' : ''}`}
            onClick={() => set('site', o)}
            type="button"
          >
            {o}
          </button>
        ))}
      </div>

      <p className="form-q-title">Approximate available area</p>
      <p className="form-q-help">Optional. Rough estimates are fine.</p>
      <div className="input-row">
        <div className="field">
          <label>Area</label>
          <input
            value={data.area}
            onChange={e => set('area', e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="e.g. 12,000"
            inputMode="decimal"
            disabled={data.notSureArea}
            style={data.notSureArea ? { opacity: 0.4 } : {}}
          />
        </div>
        <div className="field">
          <label>Unit</label>
          <select value={data.areaUnit} onChange={e => set('areaUnit', e.target.value)} disabled={data.notSureArea}>
            <option>sq ft</option>
            <option>sq m</option>
            <option>acres</option>
          </select>
        </div>
      </div>
      <label className="consent" style={{ marginTop: 4 }}>
        <input
          type="checkbox"
          checked={data.notSureArea}
          onChange={e => set('notSureArea', e.target.checked)}
        />
        Not sure; our team can help estimate this during assessment.
      </label>

      <p className="form-q-title">What is the property arrangement?</p>
      <div className="choice-grid compact">
        {OWNERSHIP.map(o => (
          <button
            key={o}
            className={`choice ${data.ownership === o ? 'selected' : ''}`}
            onClick={() => set('ownership', o)}
            type="button"
          >
            {o}
          </button>
        ))}
      </div>
    </>
  );
}


// ----- STEP 3: Electricity usage -----
function Step3({ data, set }) {
  const handleBillUpload = (event) => {
    const file = event.target.files?.[0] || null;

    if (file && file.size > 10 * 1024 * 1024) {
      set('billFile', null);
      set('fileName', '');
      set('billFileError', 'Please choose a file smaller than 10 MB.');
      event.target.value = '';
      return;
    }

    set('billFile', file);
    set('fileName', file?.name || '');
    set('billFileError', '');
  };

  return (
    <>
      <p className="form-q-title">Approximate monthly electricity bill</p>
      <div className="choice-grid">
        {BILL_OPTIONS.map(o => (
          <button
            key={o}
            className={`choice ${data.bill === o ? 'selected' : ''}`}
            onClick={() => set('bill', o)}
            type="button"
          >
            {o}
          </button>
        ))}
      </div>

      <div className="bill-upload">
        <div>
          <p className="form-q-title">Upload your electricity bill</p>
          <p className="form-q-help">Optional. PDF, JPG, JPEG or PNG up to 10 MB.</p>
        </div>
        <label className={`file-upload-button ${data.fileName ? 'has-file' : ''}`}>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={handleBillUpload}
          />
          {data.fileName ? <IconCheck size={16} /> : <IconPlus size={16} />}
          <span>{data.fileName || 'Choose electricity bill'}</span>
        </label>
        {data.billFileError && <p className="file-upload-error">{data.billFileError}</p>}
      </div>

      <p className="form-q-title">Approximate monthly consumption</p>
      <p className="form-q-help">Optional - usually shown on your latest electricity bill.</p>
      <div className="input-row stack">
        <div className="field">
          <label>Monthly units</label>
          <div className="field-wrap">
            <input
              value={data.consumption}
              onChange={e => set('consumption', e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="e.g. 25,000"
              inputMode="decimal"
              style={{ paddingRight: 46 }}
            />
            <span className="unit">kWh</span>
          </div>
        </div>
      </div>

    </>
  );
}

// ----- STEP 4: Contact -----
function Step4({ data, set }) {
  return (
    <>
      <p className="form-q-title">Where should we send your assessment?</p>
      <div className="input-row">
        <div className="field">
          <label>Company name</label>
          <input value={data.company} onChange={e => set('company', e.target.value)} placeholder="Acme Industries Pvt Ltd" />
        </div>
        <div className="field">
          <label>Contact person</label>
          <input value={data.contact} onChange={e => set('contact', e.target.value)} placeholder="Full name" />
        </div>
      </div>
      <div className="input-row">
        <div className="field">
          <label>Mobile number</label>
          <input
            value={data.mobile}
            onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0,10))}
            placeholder="10-digit"
            inputMode="numeric"
          />
        </div>
        <div className="field">
          <label>Work email</label>
          <input
            value={data.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@company.in"
            type="email"
          />
        </div>
      </div>

      <p className="form-q-title" style={{ marginTop: 24 }}>Primary objective</p>
      <div className="choice-grid" style={{ gridTemplateColumns: '1fr' }}>
        {OBJECTIVE_OPTIONS.map(o => (
          <button
            key={o}
            className={`choice ${data.objective === o ? 'selected' : ''}`}
            onClick={() => set('objective', o)}
            type="button"
          >
            {o}
          </button>
        ))}
      </div>

      
      <label className="consent">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={e => set('consent', e.target.checked)}
        />
        I agree that Akuntha Projects may contact me about this assessment and store the
        information I have provided. I understand that submission does not guarantee
        RESCO eligibility or project approval.
      </label>
    </>
  );
}

// ----- SUCCESS -----
function SuccessScreen({ data, onReset }) {
  const facility = FACILITY_OPTIONS.find(f => f.id === data.facility)?.label || '—';
  return (
    <div className="form-card">
      <div className="form-success">
        <div className="badge">
          <IconCheck size={12} stroke={2.5} /> Assessment submitted
        </div>
        <h3 className="form-title" style={{ marginBottom: 12 }}>
          Thanks{data.contact ? `, ${data.contact.split(' ')[0]}` : ''}. We'll be in touch shortly.
        </h3>
        <p className="form-sub">
          Our engineering team will review your submission and follow up within 2 business days
          to schedule an initial commercial review.
        </p>

        <dl className="success-summary">
          <dt>Facility</dt><dd>{facility} · {data.city || '-'}, {data.state || '-'}</dd>
          <dt>Monthly bill</dt><dd>{data.bill || '-'}</dd>
          <dt>Proposed site</dt><dd>{data.site || '-'}</dd>
          <dt>Primary objective</dt><dd>{data.objective || '-'}</dd>
          <dt>Contact</dt><dd>{data.email || '-'} · {data.mobile ? `+91 ${data.mobile}` : '-'}</dd>
        </dl>

        <button
          onClick={onReset}
          className="btn btn-ghost"
          style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}
        >
          Start another assessment
        </button>
      </div>
      <p className="form-footer-note">
        Submission does not guarantee RESCO eligibility or project approval.
      </p>
    </div>
  );
}

export default AssessmentForm;
