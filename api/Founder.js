// Fresh stealth founder leads — the deal-flow query.
const res = await fetch(
  "https://www.startuphub.ai/api/v1/startups?stealth=true&domain_tld=ai,io&has_known_emails=true&sort=founded_date.desc&limit=20",
  {
    headers: {
      Authorization: "Bearer sk_live_...",
    },
  }
);

const { data, pagination } = await res.json();
// data[].tech_fingerprint exposes detected CDN, email provider, analytics
// stack, payments, and frameworks. data[].domain_created_at is the RDAP
// registration date so you can compute domain-age-vs-founding signals.
