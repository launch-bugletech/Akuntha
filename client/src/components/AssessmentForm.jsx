import { useEffect, useMemo, useRef, useState } from 'react';
import { IconFactory, IconWarehouse, IconSnowflake, IconBuilding, IconHospital, IconHotel, IconSchool, IconRetail, IconOther, IconArrowLeft, IconArrowRight, IconPlus, IconCheck, IconChevronDown, IconMapPin } from './Icons.jsx';
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

const RESCO_API_URL = import.meta.env.VITE_RESCO_API_URL;
const RESCO_API_TOKEN = import.meta.env.VITE_RESCO_API_TOKEN;

const INITIAL_FORM_DATA = {
  facility: '',
  locationMethod: 'manual', address: '',
  state: '', city: '', landmark: '', pincode: '',
  latitude: null, longitude: null, locationSource: '', locationLabel: '',
  bill: '', consumption: '', ownership: '',
  site: '', area: '', areaUnit: 'sq ft', notSureArea: false, objective: '',
  company: '', contact: '', mobile: '', email: '',
  fileName: '', billFile: null, billFileError: '',
  consent: false,
};

function validateSubmission(data) {
  if (!data.facility) return 'Select a facility type.';
  if (data.locationMethod === 'manual' && !data.address.trim()) return 'Enter the full facility address.';
  if (data.locationMethod === 'map' && (data.latitude == null || data.longitude == null)) {
    return 'Choose the facility location on the map.';
  }
  if (!data.state.trim()) return 'Enter the facility state.';
  if (!data.city.trim()) return 'Enter the facility city.';
  if (!/^\d{6}$/.test(data.pincode)) return 'Enter a valid 6-digit PIN code.';
  if (!data.site) return 'Select where solar could be installed.';
  if (!data.ownership) return 'Select the property arrangement.';
  if (!data.bill) return 'Select the approximate monthly electricity bill.';
  if (!data.company.trim()) return 'Enter the company name.';
  if (!data.contact.trim()) return 'Enter the contact person.';
  if (!/^[6-9]\d{9}$/.test(data.mobile)) return 'Enter a valid 10-digit Indian mobile number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return 'Enter a valid work email address.';
  if (!data.objective) return 'Select the primary objective.';
  if (!data.consent) return 'Consent is required before submitting.';
  return '';
}

function AssessmentForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionId, setSubmissionId] = useState('');
  const formRef = useRef(null);
  const previousStepRef = useRef(step);
  const [data, setData] = useState(INITIAL_FORM_DATA);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  useEffect(() => {
    if (previousStepRef.current === step) return;

    previousStepRef.current = step;
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const totalSteps = 4;
  const canNext = useMemo(() => {
    if (step === 1) {
      const hasLocationDetails = data.state.trim()
        && data.city.trim()
        && /^\d{6}$/.test(data.pincode);
      const hasLocationSource = data.locationMethod === 'manual'
        ? data.address.trim()
        : data.latitude != null && data.longitude != null;

      return data.facility && hasLocationDetails && hasLocationSource;
    }
    if (step === 2) return data.site && data.ownership;
    if (step === 3) return data.bill;
    if (step === 4) {
      return data.company.trim()
        && data.contact.trim()
        && /^[6-9]\d{9}$/.test(data.mobile)
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
        && data.objective
        && data.consent;
    }
    return false;
  }, [step, data]);

  const submitAssessment = async () => {
    const validationError = validateSubmission(data);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    if (!RESCO_API_URL) {
      setSubmitError('The assessment service is not configured. Please try again later.');
      return;
    }

    const facilityOption = FACILITY_OPTIONS.find(option => option.id === data.facility);
    const payload = {
      apiToken: RESCO_API_TOKEN || '',
      facility: data.facility,
      facilityLabel: facilityOption?.label || data.facility,
      locationMethod: data.locationMethod,
      address: data.address.trim(),
      state: data.state.trim(),
      city: data.city.trim(),
      landmark: data.landmark.trim(),
      pincode: data.pincode,
      latitude: data.latitude,
      longitude: data.longitude,
      locationSource: data.locationSource,
      locationLabel: data.locationLabel,
      bill: data.bill,
      consumption: data.consumption,
      ownership: data.ownership,
      site: data.site,
      area: data.area,
      areaUnit: data.areaUnit,
      notSureArea: data.notSureArea,
      objective: data.objective,
      company: data.company.trim(),
      contact: data.contact.trim(),
      mobile: data.mobile,
      email: data.email.trim(),
      consent: data.consent,
    };

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(RESCO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        const details = Array.isArray(result.errors) ? result.errors.join(' ') : '';
        throw new Error(details || result.message || 'The assessment could not be submitted.');
      }

      setSubmissionId(result.submissionId || 'Submitted');
      setDone(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'The assessment could not be submitted. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else if (canNext && !submitting) submitAssessment();
  };
  const back = () => setStep(Math.max(1, step - 1));

  const resetForm = () => {
    setData(INITIAL_FORM_DATA);
    setSubmissionId('');
    setSubmitError('');
    setDone(false);
    setStep(1);
  };

  if (done) return <SuccessScreen data={data} submissionId={submissionId} onReset={resetForm} />;

  return (
    <div className="form-card" id="assessment" ref={formRef}>
      <div className="form-head">
        <h3 className="form-title">Get a Free RESCO Project Assessment</h3>
        <p className="form-sub">
         Complete this free assessment to help us evaluate whether RESCO, financed solar, or direct ownership may suit your facility.
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
          disabled={step === 1 || submitting}
        >
          <IconArrowLeft size={14} /> Back
        </button>
        <button
          className="btn btn-primary"
          onClick={next}
          disabled={!canNext || submitting}
          aria-busy={submitting}
          style={!canNext || submitting ? { opacity: 0.55, cursor: 'not-allowed' } : {}}
        >
          {submitting ? (
            <>
              <span className="submit-spinner" aria-hidden="true" />
              Submitting assessment…
            </>
          ) : (
            <>
              {step === 4 ? 'Request My Free RESCO Assessment' : 'Continue'}
              <IconArrowRight size={14} className="arr" />
            </>
          )}
        </button>
      </div>

      {submitError && (
        <p className="form-submit-error" role="alert">{submitError}</p>
      )}

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
  const [mapPreviewEnabled, setMapPreviewEnabled] = useState(false);
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
      <div className="location-methods" role="radiogroup" aria-label="Location entry method">
        <button
          type="button"
          role="radio"
          aria-checked={data.locationMethod === 'manual'}
          className={`location-method ${data.locationMethod === 'manual' ? 'selected' : ''}`}
          onClick={() => {
            set('locationMethod', 'manual');
            setMapPreviewEnabled(false);
          }}
        >
          <IconBuilding size={18} />
          <span>
            <strong>Enter address manually</strong>
            <small>Fastest and available anytime</small>
          </span>
          {data.locationMethod === 'manual' && <IconCheck size={16} />}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={data.locationMethod === 'map'}
          className={`location-method ${data.locationMethod === 'map' ? 'selected' : ''}`}
          onClick={() => {
            set('locationMethod', 'map');
            setMapPreviewEnabled(true);
          }}
        >
          <IconMapPin size={18} />
          <span>
            <strong>Choose on map</strong>
            <small>Pin the exact facility location</small>
          </span>
          {data.locationMethod === 'map' && <IconCheck size={16} />}
        </button>
      </div>

      {data.locationMethod === 'manual' && (
        <div className="input-row stack">
          <div className="field">
            <label htmlFor="facility-address">Full address</label>
            <textarea
              id="facility-address"
              className="manual-address"
              value={data.address}
              onChange={e => set('address', e.target.value)}
              placeholder="Building, street, industrial area and nearby details"
              rows="3"
            />
          </div>
        </div>
      )}

      {data.locationMethod === 'map' && (
        <>
          <div className="map-mode-note">
            Select the facility on the map, then confirm the address details below.
          </div>
          {mapPreviewEnabled ? (
            <FacilityMap
              pincode={data.pincode}
              latitude={data.latitude}
              longitude={data.longitude}
              onLocationChange={(updates) => Object.entries(updates).forEach(([key, value]) => set(key, value))}
              onManualFallback={() => {
                set('locationMethod', 'manual');
                setMapPreviewEnabled(false);
              }}
            />
          ) : (
            <div className="map-load-gate">
              <span className="map-load-gate-icon" aria-hidden="true"><IconMapPin size={24} /></span>
              <div>
                <strong>Map preview is paused</strong>
                <span>Open it only when you need to adjust the facility pin.</span>
              </div>
              <button type="button" onClick={() => setMapPreviewEnabled(true)}>Load map preview</button>
            </div>
          )}
        </>
      )}

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
          <label className="field-label-row">
            <span>Landmark / locality</span>
            <span className="optional-badge">Optional</span>
          </label>
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

      <div className="form-question-head">
        <p className="form-q-title">Approximate available area</p>
        <span className="optional-badge">Optional</span>
      </div>
      <p className="form-q-help">Rough estimates are fine.</p>
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
        <div className="form-question-head">
          <div>
            <p className="form-q-title">Upload your electricity bill</p>
            <p className="form-q-help">PDF, JPG, JPEG or PNG up to 10 MB.</p>
          </div>
          <span className="optional-badge">Optional</span>
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

      <div className="form-question-head">
        <p className="form-q-title">Approximate monthly consumption</p>
        <span className="optional-badge">Optional</span>
      </div>
      <p className="form-q-help">Usually shown on your latest electricity bill.</p>
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
  const [touched, setTouched] = useState({});
  const markTouched = (field) => setTouched(current => ({ ...current, [field]: true }));
  const mobileStartsIncorrectly = data.mobile.length > 0 && !/^[6-9]/.test(data.mobile);
  const mobileHasWrongLength = touched.mobile && data.mobile.length > 0 && data.mobile.length !== 10;
  const mobileError = mobileStartsIncorrectly
    ? 'Indian mobile numbers must start with 6, 7, 8, or 9.'
    : mobileHasWrongLength
      ? 'Enter all 10 digits of the mobile number.'
      : '';
  const emailError = touched.email && data.email.length > 0
    && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
    ? 'Enter a valid work email address, such as name@company.in.'
    : '';

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
        <div className={`field ${mobileError ? 'invalid' : ''}`}>
          <label>Mobile number</label>
          <input
            value={data.mobile}
            onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0,10))}
            onBlur={() => markTouched('mobile')}
            placeholder="10-digit"
            inputMode="numeric"
            aria-invalid={Boolean(mobileError)}
            aria-describedby={mobileError ? 'mobile-error' : undefined}
          />
          {mobileError && <p className="field-error" id="mobile-error" role="alert">{mobileError}</p>}
        </div>
        <div className={`field ${emailError ? 'invalid' : ''}`}>
          <label>Work email</label>
          <input
            value={data.email}
            onChange={e => set('email', e.target.value)}
            onBlur={() => markTouched('email')}
            placeholder="you@company.in"
            type="email"
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'email-error' : undefined}
          />
          {emailError && <p className="field-error" id="email-error" role="alert">{emailError}</p>}
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
function SuccessScreen({ data, submissionId, onReset }) {
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

        <div className="submission-reference">
          <span>Submission ID</span>
          <strong>{submissionId}</strong>
          <small>Keep this reference for future communication.</small>
        </div>

        <dl className="success-summary">
          <dt>Facility</dt><dd>{facility} · {data.city || '-'}, {data.state || '-'}</dd>
          <dt>Location source</dt><dd>{data.locationSource || 'Entered manually'}</dd>
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
