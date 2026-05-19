import { DocumentType } from './documents';

const today = () =>
  new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

const zar = (v?: string) =>
  v ? `R ${Number(v).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : 'R —';

const val = (data: Record<string, string>, key: string, fallback = '—') =>
  data[key]?.trim() || fallback;

const row = (label: string, value: string) =>
  value && value !== '—'
    ? `<tr><td class="label">${label}</td><td class="value">${value.replace(/\n/g, '<br/>')}</td></tr>`
    : '';

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Source Sans 3', Arial, sans-serif; font-size: 11pt; color: #1a1a2e; background: #fff; padding: 40px; }
  .page { max-width: 780px; margin: 0 auto; }
  .doc-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0A1628; padding-bottom: 20px; margin-bottom: 24px; }
  .doc-header .brand { font-family: 'Playfair Display', serif; font-size: 26pt; color: #0A1628; }
  .doc-header .doc-type { text-align: right; font-size: 18pt; font-weight: 700; color: #B8860B; letter-spacing: 1px; text-transform: uppercase; }
  .doc-header .doc-meta { font-size: 9pt; color: #666; margin-top: 4px; text-align: right; }
  .two-col { display: flex; gap: 32px; margin-bottom: 20px; }
  .two-col .col { flex: 1; }
  .col-title { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #B8860B; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
  .col p { font-size: 10pt; line-height: 1.7; }
  .col strong { font-weight: 700; display: block; font-size: 11pt; margin-bottom: 2px; }
  .section-header { background: #0A1628; color: #fff; padding: 7px 14px; font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; margin: 20px 0 10px; border-radius: 3px; }
  .field-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
  .field-table tr:nth-child(even) td { background: #f8fafc; }
  .field-table td { padding: 7px 10px; font-size: 10pt; border-bottom: 1px solid #eef2f7; vertical-align: top; }
  .field-table td.label { font-weight: 600; color: #475569; width: 40%; white-space: nowrap; }
  .field-table td.value { color: #1a1a2e; }
  .clause { margin-bottom: 14px; padding: 12px 14px; border-left: 3px solid #B8860B; background: #fffdf5; border-radius: 0 4px 4px 0; }
  .clause .clause-title { font-weight: 700; font-size: 10pt; margin-bottom: 4px; color: #0A1628; }
  .clause p { font-size: 10pt; line-height: 1.7; color: #333; }
  .financial-box { border: 2px solid #0A1628; border-radius: 6px; overflow: hidden; margin: 16px 0; }
  .financial-box .fin-row { display: flex; justify-content: space-between; padding: 8px 16px; font-size: 10pt; border-bottom: 1px solid #e2e8f0; }
  .financial-box .fin-row:last-child { border-bottom: none; }
  .financial-box .fin-row.total { background: #0A1628; color: #fff; font-weight: 700; font-size: 12pt; }
  .sig-section { margin-top: 40px; }
  .sig-grid { display: flex; gap: 40px; margin-top: 20px; }
  .sig-box { flex: 1; text-align: center; }
  .sig-line { border-top: 1.5px solid #1a1a2e; padding-top: 6px; margin-top: 50px; }
  .sig-label { font-size: 9pt; color: #666; }
  .sig-name { font-size: 10pt; font-weight: 600; color: #1a1a2e; margin-top: 2px; }
  .notice-box { background: #fff8e1; border: 1px solid #f59e0b; border-radius: 4px; padding: 10px 14px; font-size: 9.5pt; margin: 12px 0; color: #92400e; }
  .legal-notice { background: #f1f5f9; border-top: 2px solid #cbd5e1; margin-top: 32px; padding: 12px; font-size: 8.5pt; color: #64748b; text-align: center; }
  .doc-footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 8pt; color: #94a3b8; }
  @media print { body { padding: 20px; } .page { max-width: 100%; } }
`;

function generateGenericHTML(doc: DocumentType, data: Record<string, string>): string {
  const sections = doc.fields
    .map((group) => {
      const dataFields = group.fields.filter(f => data[f.id]);
      if (dataFields.length === 0) return '';
      return `
      <div class="section-header">${group.icon} ${group.title}</div>
      <table class="field-table">
        ${dataFields.map(f => row(f.label, val(data, f.id))).join('')}
      </table>`;
    })
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>${doc.name}</title><style>${BASE_CSS}</style></head><body><div class="page">
  <div class="doc-header">
    <div class="brand">${val(data, 'businessName', val(data, 'deponentName', 'FormCraft'))}</div>
    <div><div class="doc-type">${doc.name}</div><div class="doc-meta">Date: ${today()}</div></div>
  </div>
  ${sections}
  <div class="sig-section">
    <div class="section-header">✍️ Signatures</div>
    <div class="sig-grid">
      <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Party 1 Signature</div></div>
      <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Party 2 Signature</div></div>
      <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Date</div><div class="sig-name">${today()}</div></div>
    </div>
  </div>
  <div class="doc-footer"><span>Generated by FormCraft · inka.club</span><span>${today()}</span></div>
  </div></body></html>`;
}

function generateLeaseHTML(data: Record<string, string>): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Lease Agreement</title><style>${BASE_CSS}</style></head><body><div class="page">
  <div class="doc-header">
    <div class="brand">LEASE AGREEMENT</div>
    <div><div class="doc-type">Residential / Commercial</div><div class="doc-meta">Date: ${today()}</div><div class="doc-meta">Rental Housing Act 50 of 1999</div></div>
  </div>
  <div class="notice-box">This Lease Agreement is entered into on <strong>${today()}</strong> between the Landlord and Tenant identified below, subject to the Rental Housing Act 50 of 1999 and all applicable South African legislation.</div>
  <div class="section-header">👤 Parties</div>
  <div class="two-col">
    <div class="col"><div class="col-title">Landlord</div>
      <strong>${val(data, 'landlordFullName')}</strong>
      <p>ID / Reg: ${val(data, 'landlordIdReg')}</p>
      <p>${val(data, 'landlordAddress').replace(/\n/g, '<br/>')}</p>
      <p>📞 ${val(data, 'landlordPhone')}</p>
      ${data.landlordEmail ? `<p>✉️ ${data.landlordEmail}</p>` : ''}
    </div>
    <div class="col"><div class="col-title">Tenant</div>
      <strong>${val(data, 'tenantFullName')}</strong>
      <p>ID: ${val(data, 'tenantIdNumber')}</p>
      <p>📞 ${val(data, 'tenantPhone')}</p>
      ${data.tenantEmail ? `<p>✉️ ${data.tenantEmail}</p>` : ''}
    </div>
  </div>
  <div class="section-header">🏡 Property</div>
  <table class="field-table">
    ${row('Property Address', val(data, 'propertyAddress'))}
    ${row('Property Type', val(data, 'propertyType'))}
    ${data.propertyDescription ? row('Description', val(data, 'propertyDescription')) : ''}
  </table>
  <div class="section-header">📅 Lease Terms</div>
  <table class="field-table">
    ${row('Lease Type', val(data, 'leaseType'))}
    ${row('Start Date', val(data, 'commencementDate'))}
    ${data.endDate ? row('End Date', val(data, 'endDate')) : ''}
    ${row('Notice Period', val(data, 'noticePeriod'))}
  </table>
  <div class="section-header">💰 Financial Terms</div>
  <div class="financial-box">
    <div class="fin-row"><span>Monthly Rental</span><span>${zar(val(data, 'monthlyRental'))}</span></div>
    <div class="fin-row"><span>Rental Due</span><span>${val(data, 'rentalDueDay')} of each month</span></div>
    <div class="fin-row"><span>Payment Method</span><span>${val(data, 'paymentMethod')}</span></div>
    ${data.bankName ? `<div class="fin-row"><span>Bank</span><span>${val(data, 'bankName')}</span></div>` : ''}
    ${data.accountNumber ? `<div class="fin-row"><span>Account Number</span><span>${val(data, 'accountNumber')}</span></div>` : ''}
    <div class="fin-row total"><span>Security Deposit</span><span>${zar(val(data, 'depositAmount'))}</span></div>
  </div>
  <div class="section-header">🔌 Utilities & Rules</div>
  <table class="field-table">
    ${row('Electricity', val(data, 'electricity'))}
    ${row('Water', val(data, 'water'))}
    ${row('Pets', val(data, 'petsAllowed'))}
  </table>
  <div class="section-header">⚖️ Standard Clauses</div>
  <div class="clause"><div class="clause-title">1. Inspection</div><p>The parties shall conduct a joint incoming and outgoing inspection as required by the Rental Housing Act 50 of 1999.</p></div>
  <div class="clause"><div class="clause-title">2. Deposit Refund</div><p>The deposit shall be refunded within 14 days of lease end (if no damage) or 21 days after final restoration of the property.</p></div>
  <div class="clause"><div class="clause-title">3. Breach</div><p>Written notice of 20 business days shall be given before either party may cancel this Agreement due to breach.</p></div>
  <div class="clause"><div class="clause-title">4. Governing Law</div><p>This Agreement is governed by the laws of the Republic of South Africa.</p></div>
  <div class="section-header">✍️ Signatures</div>
  <div class="sig-grid">
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Landlord Signature</div><div class="sig-name">${val(data, 'landlordFullName')}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Tenant Signature</div><div class="sig-name">${val(data, 'tenantFullName')}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Date</div><div class="sig-name">${today()}</div></div>
  </div>
  <div class="legal-notice">Generated by FormCraft (inka.club). Template only — not legal advice. Compliant with the Rental Housing Act 50 of 1999.</div>
  <div class="doc-footer"><span>FormCraft · Inka-Tech Solutions · inka.club</span><span>${today()}</span></div>
  </div></body></html>`;
}

function generateSaleHTML(data: Record<string, string>): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Deed of Sale</title><style>${BASE_CSS}</style></head><body><div class="page">
  <div class="doc-header">
    <div class="brand">DEED OF SALE</div>
    <div><div class="doc-type">Sale Agreement</div><div class="doc-meta">Date: ${today()}</div><div class="doc-meta">Alienation of Land Act 68 of 1981</div></div>
  </div>
  <div class="notice-box">This Deed of Sale is entered into by the Seller and Buyer identified herein, subject to all applicable South African legislation.</div>
  <div class="section-header">👥 Parties</div>
  <div class="two-col">
    <div class="col"><div class="col-title">Seller</div>
      <strong>${val(data, 'sellerFullName')}</strong>
      <p>ID / Reg: ${val(data, 'sellerIdReg')}</p>
      <p>${val(data, 'sellerAddress').replace(/\n/g, '<br/>')}</p>
      <p>📞 ${val(data, 'sellerPhone')}</p>
      ${data.sellerEmail ? `<p>✉️ ${data.sellerEmail}</p>` : ''}
    </div>
    <div class="col"><div class="col-title">Buyer</div>
      <strong>${val(data, 'buyerFullName')}</strong>
      <p>ID / Reg: ${val(data, 'buyerIdReg')}</p>
      <p>${val(data, 'buyerAddress').replace(/\n/g, '<br/>')}</p>
      <p>📞 ${val(data, 'buyerPhone')}</p>
      ${data.buyerEmail ? `<p>✉️ ${data.buyerEmail}</p>` : ''}
    </div>
  </div>
  <div class="section-header">🏗️ Asset / Property</div>
  <table class="field-table">
    ${row('Type', val(data, 'saleType'))}
    ${row('Description', val(data, 'propertyDescription'))}
    ${data.municipalAddress ? row('Municipal Address', val(data, 'municipalAddress')) : ''}
    ${data.inclusionsFixtures ? row('Inclusions', val(data, 'inclusionsFixtures')) : ''}
    ${data.exclusions ? row('Exclusions', val(data, 'exclusions')) : ''}
  </table>
  <div class="section-header">💵 Purchase Price</div>
  <div class="financial-box">
    <div class="fin-row total"><span>Purchase Price</span><span>${zar(val(data, 'purchasePrice'))}</span></div>
    ${data.depositAmount ? `<div class="fin-row"><span>Deposit</span><span>${zar(val(data, 'depositAmount'))}</span></div>` : ''}
    <div class="fin-row"><span>Balance Payment</span><span>${val(data, 'balancePayment')}</span></div>
    ${data.voetstoots ? `<div class="fin-row"><span>Voetstoots</span><span>${val(data, 'voetstoots')}</span></div>` : ''}
  </div>
  ${data.occupationDate ? `<table class="field-table">${row('Occupation Date', val(data, 'occupationDate'))}</table>` : ''}
  ${data.specialConditions ? `<div class="clause"><div class="clause-title">Special Conditions</div><p>${val(data, 'specialConditions')}</p></div>` : ''}
  <div class="section-header">⚖️ Standard Clauses</div>
  <div class="clause"><div class="clause-title">1. Risk</div><p>Risk in and to the property shall pass to the Buyer on the date of registration of transfer.</p></div>
  <div class="clause"><div class="clause-title">2. Costs</div><p>Transfer costs, conveyancing fees and registration costs shall be borne by the Buyer unless otherwise agreed in writing.</p></div>
  <div class="clause"><div class="clause-title">3. Breach</div><p>Should either party breach this Agreement and fail to remedy within 7 days of written notice, the aggrieved party may cancel and claim damages.</p></div>
  <div class="section-header">✍️ Signatures</div>
  <div class="sig-grid">
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Seller Signature</div><div class="sig-name">${val(data, 'sellerFullName')}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Buyer Signature</div><div class="sig-name">${val(data, 'buyerFullName')}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Date</div><div class="sig-name">${today()}</div></div>
  </div>
  <div class="legal-notice">Generated by FormCraft (inka.club). Template only — seek qualified conveyancer advice before signing.</div>
  <div class="doc-footer"><span>FormCraft · Inka-Tech Solutions · inka.club</span><span>${today()}</span></div>
  </div></body></html>`;
}

function generateInvoiceHTML(data: Record<string, string>): string {
  const subtotal = parseFloat(data.subtotal || '0');
  const vatRate = data.vatRate?.includes('15%') || data.vatRate === '15% VAT' ? 0.15 : 0;
  const discount = parseFloat(data.discountAmount || '0');
  const vatAmount = (subtotal - discount) * vatRate;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Tax Invoice ${val(data, 'invoiceNumber')}</title>
  <style>${BASE_CSS}</style></head><body><div class="page">
  <div class="doc-header">
    <div><div class="brand">${val(data, 'businessName', 'Your Business')}</div>
      ${data.vatNumber ? `<div style="font-size:9pt;color:#666;margin-top:4px">VAT: ${data.vatNumber}</div>` : ''}
    </div>
    <div><div class="doc-type">TAX INVOICE</div>
      <div class="doc-meta" style="font-size:14pt;font-weight:700;color:#B8860B">${val(data, 'invoiceNumber')}</div>
      <div class="doc-meta">Date: ${val(data, 'invoiceDate', today())}</div>
      <div class="doc-meta">Due: ${val(data, 'dueDate', '—')}</div>
    </div>
  </div>
  <div class="two-col">
    <div class="col"><div class="col-title">From</div>
      <strong>${val(data, 'businessName', 'Your Business')}</strong>
      <p>${val(data, 'businessAddress', '').replace(/\n/g, '<br/>')}</p>
      ${data.businessPhone ? `<p>📞 ${data.businessPhone}</p>` : ''}
      ${data.businessEmail ? `<p>✉️ ${data.businessEmail}</p>` : ''}
    </div>
    <div class="col"><div class="col-title">Bill To</div>
      <strong>${val(data, 'clientName')}</strong>
      <p>${val(data, 'clientAddress', '').replace(/\n/g, '<br/>')}</p>
      ${data.clientEmail ? `<p>✉️ ${data.clientEmail}</p>` : ''}
    </div>
  </div>
  <div class="section-header">📦 Services / Goods</div>
  <div style="padding:14px;background:#f8fafc;border-radius:4px;font-size:10pt;line-height:1.9;white-space:pre-line;margin-bottom:4px">${val(data, 'description')}</div>
  <div class="financial-box" style="margin-top:16px">
    <div class="fin-row"><span>Subtotal (excl. VAT)</span><span>${zar(data.subtotal)}</span></div>
    ${discount > 0 ? `<div class="fin-row"><span>Discount</span><span>- ${zar(data.discountAmount)}</span></div>` : ''}
    <div class="fin-row"><span>VAT (${data.vatRate || '0%'})</span><span>${vatAmount > 0 ? zar(String(vatAmount)) : 'R 0.00'}</span></div>
    <div class="fin-row total"><span>TOTAL DUE</span><span>${zar(data.totalAmount)}</span></div>
  </div>
  ${data.bankName ? `
  <div class="section-header">💳 Payment Details</div>
  <table class="field-table">
    ${row('Bank', val(data, 'bankName'))}
    ${row('Account Number', val(data, 'accountNumber'))}
    ${row('Branch Code', val(data, 'branchCode'))}
    ${data.paymentTerms ? row('Payment Terms', val(data, 'paymentTerms')) : ''}
  </table>` : ''}
  ${data.notes ? `<div class="clause"><div class="clause-title">Notes</div><p>${val(data, 'notes')}</p></div>` : ''}
  <div class="sig-grid" style="margin-top:32px">
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Authorised Signature</div><div class="sig-name">${val(data, 'businessName', 'Your Business')}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Date</div></div>
  </div>
  <div class="legal-notice">Interest of 2% per month may be charged on overdue accounts. E&amp;OE.</div>
  <div class="doc-footer"><span>${val(data, 'businessName', 'Your Business')} · FormCraft · inka.club</span><span>${today()}</span></div>
  </div></body></html>`;
}

function generateQuotationHTML(data: Record<string, string>): string {
  const subtotal = parseFloat(data.subtotal || '0');
  const vatRate = data.vatRate?.includes('15%') || data.vatRate === '15% VAT' ? 0.15 : 0;
  const discount = parseFloat(data.discountAmount || '0');
  const vatAmount = (subtotal - discount) * vatRate;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Quotation ${val(data, 'quoteNumber')}</title>
  <style>${BASE_CSS}</style></head><body><div class="page">
  <div class="doc-header">
    <div><div class="brand">${val(data, 'businessName', 'Your Business')}</div></div>
    <div><div class="doc-type">QUOTATION</div>
      <div class="doc-meta" style="font-size:14pt;font-weight:700;color:#B8860B">${val(data, 'quoteNumber')}</div>
      <div class="doc-meta">Date: ${val(data, 'quoteDate', today())}</div>
      <div class="doc-meta">Valid Until: ${val(data, 'validUntil', '—')}</div>
    </div>
  </div>
  <div class="two-col">
    <div class="col"><div class="col-title">From</div>
      <strong>${val(data, 'businessName', 'Your Business')}</strong>
      <p>${val(data, 'businessAddress', '').replace(/\n/g, '<br/>')}</p>
      ${data.businessPhone ? `<p>📞 ${data.businessPhone}</p>` : ''}
      ${data.businessEmail ? `<p>✉️ ${data.businessEmail}</p>` : ''}
    </div>
    <div class="col"><div class="col-title">Quote For</div>
      <strong>${val(data, 'clientName')}</strong>
      <p>${val(data, 'clientAddress', '').replace(/\n/g, '<br/>')}</p>
      ${data.clientEmail ? `<p>✉️ ${data.clientEmail}</p>` : ''}
    </div>
  </div>
  <div class="section-header">📦 Services / Goods</div>
  <div style="padding:14px;background:#f8fafc;border-radius:4px;font-size:10pt;line-height:1.9;white-space:pre-line;margin-bottom:4px">${val(data, 'description')}</div>
  <div class="financial-box" style="margin-top:16px">
    <div class="fin-row"><span>Subtotal (excl. VAT)</span><span>${zar(data.subtotal)}</span></div>
    ${discount > 0 ? `<div class="fin-row"><span>Discount</span><span>- ${zar(data.discountAmount)}</span></div>` : ''}
    <div class="fin-row"><span>VAT (${data.vatRate || '0%'})</span><span>${vatAmount > 0 ? zar(String(vatAmount)) : 'R 0.00'}</span></div>
    <div class="fin-row total"><span>TOTAL QUOTE</span><span>${zar(data.totalAmount)}</span></div>
  </div>
  ${data.paymentTerms ? `<table class="field-table">${row('Payment Terms', val(data, 'paymentTerms'))}${data.deliveryTime ? row('Delivery Time', val(data, 'deliveryTime')) : ''}${data.validityPeriod ? row('Validity', val(data, 'validityPeriod')) : ''}</table>` : ''}
  ${data.notes ? `<div class="clause"><div class="clause-title">Notes</div><p>${val(data, 'notes')}</p></div>` : ''}
  <div class="notice-box">This quotation is valid for ${val(data, 'validityPeriod', '30 days')} from the date above. Prices exclude VAT unless stated otherwise. E&amp;OE.</div>
  <div class="sig-grid" style="margin-top:32px">
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Prepared By</div><div class="sig-name">${val(data, 'businessName', 'Your Business')}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Date</div></div>
  </div>
  <div class="doc-footer"><span>${val(data, 'businessName', 'Your Business')} · FormCraft · inka.club</span><span>${today()}</span></div>
  </div></body></html>`;
}

function generateEmploymentHTML(data: Record<string, string>): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>Employment Contract</title><style>${BASE_CSS}</style></head><body><div class="page">
  <div class="doc-header">
    <div class="brand">${val(data, 'employerName', 'EMPLOYMENT CONTRACT')}</div>
    <div><div class="doc-type">Employment Contract</div><div class="doc-meta">Date: ${today()}</div><div class="doc-meta">BCEA 75 of 1997</div></div>
  </div>
  <div class="notice-box">This Employment Contract is entered into on <strong>${today()}</strong> between the Employer and Employee below, subject to the Basic Conditions of Employment Act 75 of 1997 and all applicable South African labour legislation.</div>
  <div class="section-header">🏢 Employer</div>
  <table class="field-table">
    ${row('Employer', val(data, 'employerName'))}
    ${data.employerReg ? row('Reg. Number', val(data, 'employerReg')) : ''}
    ${row('Address', val(data, 'employerAddress'))}
    ${data.employerPhone ? row('Phone', val(data, 'employerPhone')) : ''}
  </table>
  <div class="section-header">🧑 Employee</div>
  <div class="two-col">
    <div class="col">
      <strong>${val(data, 'employeeFullName')}</strong>
      <p>ID: ${val(data, 'employeeId')}</p>
      ${data.employeeAddress ? `<p>${val(data, 'employeeAddress').replace(/\n/g, '<br/>')}</p>` : ''}
    </div>
    <div class="col">
      ${data.employeePhone ? `<p>📞 ${data.employeePhone}</p>` : ''}
      ${data.employeeEmail ? `<p>✉️ ${data.employeeEmail}</p>` : ''}
    </div>
  </div>
  <div class="section-header">💼 Job Details</div>
  <table class="field-table">
    ${row('Job Title', val(data, 'jobTitle'))}
    ${data.department ? row('Department', val(data, 'department')) : ''}
    ${row('Employment Type', val(data, 'employmentType'))}
    ${row('Start Date', val(data, 'startDate'))}
    ${data.endDate ? row('End Date', val(data, 'endDate')) : ''}
    ${data.probationPeriod ? row('Probation', val(data, 'probationPeriod')) : ''}
    ${data.placeOfWork ? row('Place of Work', val(data, 'placeOfWork')) : ''}
    ${data.workingHours ? row('Working Hours', val(data, 'workingHours')) : ''}
  </table>
  ${data.jobDescription ? `<div class="clause"><div class="clause-title">Key Responsibilities</div><p>${val(data, 'jobDescription').replace(/\n/g, '<br/>')}</p></div>` : ''}
  <div class="section-header">💰 Remuneration</div>
  <div class="financial-box">
    <div class="fin-row total"><span>Gross Monthly Salary</span><span>${zar(val(data, 'grossSalary'))}</span></div>
    <div class="fin-row"><span>Pay Frequency</span><span>${val(data, 'salaryFrequency')}</span></div>
    <div class="fin-row"><span>Annual Leave</span><span>${val(data, 'annualLeave')}</span></div>
    ${data.noticePeriodEmployee ? `<div class="fin-row"><span>Employee Notice</span><span>${val(data, 'noticePeriodEmployee')}</span></div>` : ''}
    ${data.noticePeriodEmployer ? `<div class="fin-row"><span>Employer Notice</span><span>${val(data, 'noticePeriodEmployer')}</span></div>` : ''}
  </div>
  <div class="sig-grid" style="margin-top:32px">
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Employer Signature</div><div class="sig-name">${val(data, 'employerName')}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Employee Signature</div><div class="sig-name">${val(data, 'employeeFullName')}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Date</div><div class="sig-name">${today()}</div></div>
  </div>
  <div class="legal-notice">Generated by FormCraft (inka.club). Template only — not legal advice. BCEA 75/1997 compliant.</div>
  <div class="doc-footer"><span>FormCraft · Inka-Tech Solutions · inka.club</span><span>${today()}</span></div>
  </div></body></html>`;
}

function generateCVHTML(data: Record<string, string>): string {
  const d = (k: string) => data[k]?.trim() || '';

  const jobBlock = (title: string, company: string, start: string, end: string, duties: string) => {
    if (!title && !company) return '';
    return `<div style="margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px">
        <div>
          <span style="font-size:11pt;font-weight:700;color:#0A1628">${title || '—'}</span>
          ${company ? `<span style="font-size:10pt;color:#475569"> · ${company}</span>` : ''}
        </div>
        ${(start || end) ? `<span style="font-size:9pt;color:#B8860B;font-weight:600">${start}${end ? ' – ' + end : ''}</span>` : ''}
      </div>
      ${duties ? `<div style="margin-top:6px;font-size:10pt;color:#334155;line-height:1.7;white-space:pre-line">${duties}</div>` : ''}
    </div>`;
  };

  const pills = (text: string) => {
    if (!text) return '';
    return `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">${
      text.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
        .map(i => `<span style="background:#EFF6FF;color:#1e40af;font-size:9.5pt;padding:3px 10px;border-radius:20px;border:1px solid #bfdbfe">${i}</span>`)
        .join('')
    }</div>`;
  };

  const sec = (icon: string, title: string) =>
    `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 12px">
      <div style="width:4px;height:22px;background:#B8860B;border-radius:2px;flex-shrink:0"></div>
      <span style="font-family:'Playfair Display',serif;font-size:13pt;font-weight:700;color:#0A1628">${icon} ${title}</span>
    </div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <title>CV — ${d('fullName')}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@300;400;600;700&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Source Sans 3',Arial,sans-serif; font-size:11pt; color:#1a1a2e; background:#fff; }
    .page { max-width:800px; margin:0 auto; }
    .divider { height:1px; background:#e2e8f0; margin:16px 0; }
    @media print { body { padding:0; } }
  </style></head><body><div class="page">
  <div style="background:#0A1628;padding:32px 40px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px">
    <div>
      <div style="font-family:'Playfair Display',serif;font-size:26pt;color:#fff;margin-bottom:4px">${d('fullName')}</div>
      <div style="font-size:13pt;color:#B8860B;font-weight:600">${d('jobTitle')}</div>
    </div>
    <div style="text-align:right;font-size:10pt;color:#94a3b8;line-height:1.9">
      ${d('phone') ? `<div>📞 ${d('phone')}</div>` : ''}
      ${d('email') ? `<div>✉️ ${d('email')}</div>` : ''}
      ${d('location') ? `<div>📍 ${d('location')}</div>` : ''}
      ${d('portfolio') ? `<div>🌐 ${d('portfolio')}</div>` : ''}
    </div>
  </div>
  <div style="padding:24px 40px 40px">
    ${d('profileSummary') ? `${sec('👤', 'Profile Summary')}<div style="font-size:10.5pt;color:#334155;line-height:1.8;background:#fffdf5;border-left:3px solid #B8860B;padding:12px 16px;border-radius:0 6px 6px 0">${d('profileSummary').replace(/\n/g, '<br/>')}</div>` : ''}
    ${d('keyStrengths') ? `${sec('⚡', 'Key Strengths')}${pills(d('keyStrengths'))}` : ''}
    <div class="divider" style="margin-top:20px"></div>
    ${sec('💼', 'Work Experience')}
    ${jobBlock(d('job1Title'), d('job1Company'), d('job1Start'), d('job1End'), d('job1Duties'))}
    ${jobBlock(d('job2Title'), d('job2Company'), d('job2Start'), d('job2End'), d('job2Duties'))}
    <div class="divider"></div>
    ${sec('🎓', 'Education')}
    ${d('qual1Name') ? `<div style="margin-bottom:10px"><span style="font-size:11pt;font-weight:700;color:#0A1628">${d('qual1Name')}</span>${d('qual1Institution') ? `<span style="color:#475569"> · ${d('qual1Institution')}</span>` : ''}${d('qual1Year') ? `<span style="float:right;color:#B8860B;font-weight:600">${d('qual1Year')}</span>` : ''}</div>` : ''}
    ${d('certifications') ? `<div style="font-size:10pt;color:#334155;line-height:1.8;white-space:pre-line;margin-top:8px">${d('certifications')}</div>` : ''}
    <div class="divider"></div>
    ${d('technicalSkills') ? `${sec('🛠️', 'Technical Skills')}${pills(d('technicalSkills'))}` : ''}
    ${d('languages') ? `${sec('🗣️', 'Languages')}<div style="font-size:10pt;color:#334155;line-height:1.9">${d('languages')}</div>` : ''}
    <div class="divider"></div>
    ${sec('📞', 'References')}
    ${d('ref1Name') ? `<div style="display:flex;gap:14px;flex-wrap:wrap">
      <div style="flex:1;min-width:200px;background:#f8fafc;border-radius:8px;padding:12px 14px;border:1px solid #e2e8f0">
        <div style="font-weight:700;font-size:10.5pt;color:#0A1628">${d('ref1Name')}</div>
        ${d('ref1Title') ? `<div style="font-size:9.5pt;color:#475569">${d('ref1Title')}</div>` : ''}
        ${d('ref1Phone') ? `<div style="font-size:9.5pt;color:#64748b">📞 ${d('ref1Phone')}</div>` : ''}
      </div>
      ${d('ref2Name') ? `<div style="flex:1;min-width:200px;background:#f8fafc;border-radius:8px;padding:12px 14px;border:1px solid #e2e8f0">
        <div style="font-weight:700;font-size:10.5pt;color:#0A1628">${d('ref2Name')}</div>
        ${d('ref2Title') ? `<div style="font-size:9.5pt;color:#475569">${d('ref2Title')}</div>` : ''}
        ${d('ref2Phone') ? `<div style="font-size:9.5pt;color:#64748b">📞 ${d('ref2Phone')}</div>` : ''}
      </div>` : ''}
    </div>` : `<div style="font-style:italic;color:#475569;font-size:10.5pt">References available on request.</div>`}
  </div>
  <div style="background:#0A1628;padding:10px 40px;display:flex;justify-content:space-between;font-size:8pt;color:#475569">
    <span>${d('fullName')} · Curriculum Vitae</span>
    <span>Generated by FormCraft · inka.club</span>
  </div>
  </div></body></html>`;
}

export function generateHTML(doc: DocumentType, data: Record<string, string>): string {
  switch (doc.id) {
    case 'lease':      return generateLeaseHTML(data);
    case 'sale':       return generateSaleHTML(data);
    case 'invoice':    return generateInvoiceHTML(data);
    case 'quotation':  return generateQuotationHTML(data);
    case 'employment': return generateEmploymentHTML(data);
    case 'cv':         return generateCVHTML(data);
    default:           return generateGenericHTML(doc, data);
  }
}
