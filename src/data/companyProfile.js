// Shared letterhead for every printed document (Trip Sheet, Booking/BBooking/
// TruckBooking receipts, E-Way Bill slip, report prints, ...): the CargoNet
// logo plus the business's own profile — not the software vendor's — read
// from the "Company" master (src/data/mastersData.js) so editing that master
// updates every print header at once, same spirit as the reference layout
// (logo left, business name/address/contact right-aligned).
import { apiGetMasterList } from "src/data/mastersData.js";
// Same brand mark used by the app's own sidebar (src/layouts/mainlayout2/
// Ml2Sidebar.vue): the small round icon + "CargoNet" wordmark + tagline,
// not the bare 512x512 icon (src/assets/cargonet-logo.png) on its own.
import cargoNetLogoUrl from "src/assets/logo-round.png";

const FALLBACK_PROFILE = {
  name: "CargoNet Transportation Pvt Ltd",
  address: "Rajkot, Gujarat",
  tel: "",
  email: "",
  web: "",
};

let cachedLogoDataUrl = null;

export async function getCompanyProfile() {
  try {
    const rows = await apiGetMasterList("company");
    const company = rows?.[0];
    if (!company) return { ...FALLBACK_PROFILE };
    return {
      name: company.CompanyName || FALLBACK_PROFILE.name,
      address: company.Address || FALLBACK_PROFILE.address,
      tel: company.Tel || "",
      email: company.Email || "",
      web: company.Web || "",
    };
  } catch {
    return { ...FALLBACK_PROFILE };
  }
}

export async function getCompanyLogoDataUrl() {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;
  try {
    const res = await fetch(cargoNetLogoUrl);
    const blob = await res.blob();
    cachedLogoDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return cachedLogoDataUrl;
  } catch {
    return "";
  }
}

// Same "hdr"/"hdr-logo"/"hdr-info"/... class names every buildXHtml() print
// template already declares in its own <style> block — this only supplies
// the markup + the per-document values, not the CSS itself.
export function buildPrintHeaderHtml(logoDataUrl, company) {
  const contactParts = [
    company.tel ? `Tel: ${company.tel}` : "",
    company.email ? `Email: ${company.email}` : "",
    company.web ? `Web: ${company.web}` : "",
  ].filter(Boolean);

  return `<table class="hdr">
  <tr>
    <td class="hdr-logo">
      <table class="hdr-brand">
        <tr>
          ${
            logoDataUrl
              ? `<td class="hdr-brand-icon"><img src="${logoDataUrl}" alt="CargoNet" /></td>`
              : ""
          }
          <td class="hdr-brand-text">
            <div class="hdr-brand-name">CargoNet</div>
            <div class="hdr-brand-tagline">Web Centric Logistics Software</div>
          </td>
        </tr>
      </table>
    </td>
    <td class="hdr-info">
      <div class="hdr-company">${company.name}</div>
      <div class="hdr-sub">CargoNet &mdash; Cargo Management System</div>
      <div class="hdr-addr">${company.address}</div>
      ${
        contactParts.length
          ? `<div class="hdr-contact">${contactParts.join(" &nbsp;|&nbsp; ")}</div>`
          : ""
      }
    </td>
  </tr>
</table>`;
}

// Right-aligned company block (matches the reference print layout) instead
// of the old centered-text header — shared by every buildXHtml()'s <style>.
export const PRINT_HEADER_CSS = `
  .hdr{width:100%;border-collapse:collapse;margin-bottom:10px}
  .hdr-logo{width:230px;vertical-align:middle;padding-right:10px;text-align:left}
  .hdr-brand{border-collapse:collapse}
  .hdr-brand-icon{width:46px;padding-right:8px;vertical-align:middle}
  .hdr-brand-icon img{width:42px;height:42px;display:inline-block}
  .hdr-brand-text{vertical-align:middle;white-space:nowrap}
  .hdr-brand-name{font-size:15pt;font-weight:800;color:#173a5e;letter-spacing:.2px}
  .hdr-brand-tagline{font-size:6.5pt;font-weight:600;font-style:italic;color:#0178bc;letter-spacing:.2px}
  .hdr-info{vertical-align:middle;text-align:right}
  .hdr-company{font-size:13pt;font-weight:bold;text-transform:uppercase;color:#0178bc;letter-spacing:.5px}
  .hdr-sub{font-size:8.5pt;color:#0178bc;letter-spacing:.3px;margin:1px 0 2px}
  .hdr-addr{font-size:8pt;color:#333;line-height:1.6}
  .hdr-contact{font-size:8pt;color:#333;margin-top:1px}
`;
