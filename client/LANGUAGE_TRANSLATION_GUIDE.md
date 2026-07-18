# Landing Page Translation Approach

## Objective

The landing page uses one React component tree for every language. Do not duplicate sections or create separate English, Hindi, and Gujarati page components.

Supported languages:

- English (`en`)
- हिन्दी (`hi`)
- ગુજરાતી (`gu`)

The first implementation translates the navbar and hero only. Every section below the hero remains in English until its keys are added.

## File structure

```text
src/locales/en.json
src/locales/hi.json
src/locales/gu.json
src/i18n/LanguageProvider.jsx
src/i18n/useLanguage.js
src/i18n/translations.js
```

Every locale file must have exactly the same key structure. English is the fallback language.

## Using translations in a component

```jsx
import useLanguage from '../i18n/useLanguage.js';

function ExampleSection() {
  const { t } = useLanguage();
  return <h2>{t('benefits.title')}</h2>;
}
```

Then add the same key to all three locale files:

```json
{
  "benefits": {
    "title": "English content"
  }
}
```

Do not hard-code translated text inside JSX.

## Key naming convention

Group keys by visible section:

```text
nav.*
hero.*
rescoExplainer.*
benefits.*
eligibility.*
process.*
whyAkuntha.*
industries.*
assessmentForm.*
faq.*
finalCta.*
footer.*
```

Use descriptive names such as `assessmentForm.steps.contact.mobileError`. Do not use generic keys such as `text1` or use the English sentence as the key.

## Headline emphasis

Hero-style headings can use asterisks to mark the emphasized phrase:

```json
"title": "Normal text *emphasized text*"
```

The existing component converts the asterisk-wrapped phrase into an `<em>` element.

## Forms and submitted values

Translate only what the user sees. Keep internal values and API payload fields language-independent.

Example:

```text
Displayed English: Factory / Industrial
Displayed Hindi: फैक्ट्री / औद्योगिक
Displayed Gujarati: ફેક્ટરી / ઔદ્યોગિક
Submitted value: factory
```

Do not submit translated labels to the backend. Translate validation messages, help text, placeholders, option labels, map messages, and the success screen.

## Adding another section

1. Identify every visible string in the section.
2. Add organized English keys to `en.json`.
3. Add matching Hindi keys to `hi.json`.
4. Add matching Gujarati keys to `gu.json`.
5. Replace hard-coded JSX strings with `t('section.key')`.
6. Confirm that links, IDs, form values, and analytics identifiers remain unchanged.
7. Test all three languages at desktop and mobile sizes because translated strings have different lengths.

## Language behaviour

- The selected language is saved in `localStorage` under `akuntha-language`.
- English is used when there is no saved selection.
- Missing Hindi or Gujarati keys automatically fall back to English.
- All three languages use left-to-right layout.
- The page URL does not change when the language changes.

## Translation quality

Keep `RESCO`, `DISCOM`, company names, technical units, and legally required terminology consistent. Translations should be reviewed by a fluent Hindi or Gujarati speaker before production release.
