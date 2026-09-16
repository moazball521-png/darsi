/* =====================================================================
   DARSI — SITE OWNER SETTINGS
   Edit the values below. This is the only file you should need to touch
   for payment details, email notifications, and your admin password.
   ===================================================================== */

// Where should students/teachers send manual payments?
// The number below is a PLACEHOLDER and will not receive real money.
// Replace it with your real Vodafone Cash / InstaPay / Etisalat Cash number
// before you publish this site.
const WALLET_INFO = {
  method: "Vodafone Cash",          // e.g. "Vodafone Cash", "InstaPay", "Orange Cash"
  methodAr: "فودافون كاش",
  number: "01XXXXXXXXX"             // <-- REPLACE with your real wallet number
};

// Get a free access key from https://web3forms.com (takes ~2 minutes, no backend
// needed) so that every join request is emailed straight to you. Until you paste
// a real key here, requests still work on the site but no email is sent.
const WEB3FORMS_ACCESS_KEY = "PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE";

// Password for the /admin/ page. Change this to something only you know.
// Note: this is a soft lock, not real security — anyone who views this
// file's source can read it. Do not use it to protect sensitive data.
const ADMIN_PASSWORD = "Darsi@2026";
