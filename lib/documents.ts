export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'select';

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface FieldGroup {
  id: string;
  title: string;
  icon: string;
  fields: FieldDef[];
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  popular?: boolean;
  fields: FieldGroup[];
}

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'invoice',
    name: 'Tax Invoice',
    description: 'Professional tax invoice with VAT calculation and payment details.',
    category: 'Finance',
    icon: '🧾',
    popular: true,
    fields: [
      {
        id: 'business', title: 'Your Business', icon: '🏢',
        fields: [
          { id: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Inka-Tech Solutions', required: true },
          { id: 'businessAddress', label: 'Business Address', type: 'textarea', placeholder: '123 Main Road, Durban, 4001' },
          { id: 'businessPhone', label: 'Phone', type: 'phone', placeholder: '083 000 0000' },
          { id: 'businessEmail', label: 'Email', type: 'email', placeholder: 'info@business.co.za' },
          { id: 'vatNumber', label: 'VAT Number (optional)', type: 'text', placeholder: '4123456789' },
          { id: 'bankName', label: 'Bank Name', type: 'text', placeholder: 'FNB / Standard Bank' },
          { id: 'accountNumber', label: 'Account Number', type: 'text', placeholder: '62000000000' },
          { id: 'branchCode', label: 'Branch Code', type: 'text', placeholder: '250655' },
        ],
      },
      {
        id: 'client', title: 'Client Details', icon: '👤',
        fields: [
          { id: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'INV-001', required: true },
          { id: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true },
          { id: 'dueDate', label: 'Due Date', type: 'date' },
          { id: 'clientName', label: 'Client Name / Company', type: 'text', placeholder: 'ABC Pty Ltd', required: true },
          { id: 'clientAddress', label: 'Client Address', type: 'textarea', placeholder: '456 Smith Street, Cape Town' },
          { id: 'clientEmail', label: 'Client Email', type: 'email' },
        ],
      },
      {
        id: 'items', title: 'Services / Items', icon: '📦',
        fields: [
          { id: 'description', label: 'Description of Services / Goods', type: 'textarea', placeholder: 'App Development — GentleParent v1.0\nFirebase Setup & Configuration', required: true },
          { id: 'subtotal', label: 'Subtotal (excl. VAT)', type: 'number', placeholder: '5000', required: true },
          { id: 'vatRate', label: 'VAT Rate', type: 'select', options: ['0% (No VAT)', '15% VAT'] },
          { id: 'discountAmount', label: 'Discount Amount (R)', type: 'number', placeholder: '0' },
          { id: 'totalAmount', label: 'Total Amount Due (R)', type: 'number', placeholder: '5750', required: true },
          { id: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Immediate', '7 days', '14 days', '30 days', '60 days'] },
          { id: 'notes', label: 'Additional Notes', type: 'textarea', placeholder: 'Thank you for your business.' },
        ],
      },
    ],
  },
  {
    id: 'quotation',
    name: 'Quotation',
    description: 'Formal quotation for services or goods with validity period.',
    category: 'Finance',
    icon: '📋',
    popular: true,
    fields: [
      {
        id: 'business', title: 'Your Business', icon: '🏢',
        fields: [
          { id: 'businessName', label: 'Business Name', type: 'text', required: true },
          { id: 'businessAddress', label: 'Business Address', type: 'textarea' },
          { id: 'businessPhone', label: 'Phone', type: 'phone' },
          { id: 'businessEmail', label: 'Email', type: 'email' },
        ],
      },
      {
        id: 'client', title: 'Client & Quote Details', icon: '👤',
        fields: [
          { id: 'quoteNumber', label: 'Quote Number', type: 'text', placeholder: 'QTE-001', required: true },
          { id: 'quoteDate', label: 'Quote Date', type: 'date', required: true },
          { id: 'validUntil', label: 'Valid Until', type: 'date' },
          { id: 'clientName', label: 'Client Name / Company', type: 'text', required: true },
          { id: 'clientAddress', label: 'Client Address', type: 'textarea' },
          { id: 'clientEmail', label: 'Client Email', type: 'email' },
        ],
      },
      {
        id: 'items', title: 'Services / Items', icon: '📦',
        fields: [
          { id: 'description', label: 'Description of Services / Goods', type: 'textarea', required: true },
          { id: 'subtotal', label: 'Subtotal (excl. VAT)', type: 'number', required: true },
          { id: 'vatRate', label: 'VAT Rate', type: 'select', options: ['0% (No VAT)', '15% VAT'] },
          { id: 'discountAmount', label: 'Discount Amount (R)', type: 'number' },
          { id: 'totalAmount', label: 'Total Quote Amount (R)', type: 'number', required: true },
          { id: 'validityPeriod', label: 'Validity Period', type: 'select', options: ['7 days', '14 days', '30 days', '60 days', '90 days'] },
          { id: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['50% upfront, 50% on completion', '30 days', '14 days', 'On completion'] },
          { id: 'deliveryTime', label: 'Delivery / Turnaround Time', type: 'text', placeholder: 'e.g. 2-3 weeks' },
          { id: 'notes', label: 'Additional Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'lease',
    name: 'Lease Agreement',
    description: 'Residential/commercial lease compliant with the Rental Housing Act.',
    category: 'Property',
    icon: '🏠',
    popular: true,
    fields: [
      {
        id: 'parties', title: 'Parties', icon: '👤',
        fields: [
          { id: 'landlordFullName', label: 'Landlord Full Name / Entity', type: 'text', required: true },
          { id: 'landlordIdReg', label: 'Landlord ID / Registration Number', type: 'text', required: true },
          { id: 'landlordAddress', label: 'Landlord Address', type: 'textarea', required: true },
          { id: 'landlordPhone', label: 'Landlord Phone', type: 'phone', required: true },
          { id: 'landlordEmail', label: 'Landlord Email', type: 'email' },
          { id: 'tenantFullName', label: 'Tenant Full Name', type: 'text', required: true },
          { id: 'tenantIdNumber', label: 'Tenant ID Number', type: 'text', required: true },
          { id: 'tenantPhone', label: 'Tenant Phone', type: 'phone', required: true },
          { id: 'tenantEmail', label: 'Tenant Email', type: 'email' },
        ],
      },
      {
        id: 'property', title: 'Property Details', icon: '🏡',
        fields: [
          { id: 'propertyAddress', label: 'Full Property Address', type: 'textarea', required: true },
          { id: 'propertyType', label: 'Property Type', type: 'select', options: ['House', 'Flat / Apartment', 'Townhouse', 'Room', 'Commercial Unit', 'Office Space'] },
          { id: 'propertyDescription', label: 'Property Description', type: 'textarea', placeholder: 'e.g. 3-bedroom house with garage' },
        ],
      },
      {
        id: 'terms', title: 'Lease Terms', icon: '📅',
        fields: [
          { id: 'leaseType', label: 'Lease Type', type: 'select', options: ['Fixed Term (12 months)', 'Fixed Term (6 months)', 'Month-to-Month', 'Fixed Term (24 months)'] },
          { id: 'commencementDate', label: 'Start Date', type: 'date', required: true },
          { id: 'endDate', label: 'End Date', type: 'date' },
          { id: 'noticePeriod', label: 'Notice Period', type: 'select', options: ['1 month', '2 months', '3 months'] },
        ],
      },
      {
        id: 'financial', title: 'Financial Terms', icon: '💰',
        fields: [
          { id: 'monthlyRental', label: 'Monthly Rental (R)', type: 'number', required: true },
          { id: 'depositAmount', label: 'Security Deposit (R)', type: 'number', required: true },
          { id: 'rentalDueDay', label: 'Rent Due Day', type: 'select', options: ['1st', '2nd', '3rd', '5th', '7th', '15th', '25th'] },
          { id: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['EFT / Bank Transfer', 'Cash', 'Debit Order', 'Stop Order'] },
          { id: 'bankName', label: 'Bank Name', type: 'text' },
          { id: 'accountNumber', label: 'Account Number', type: 'text' },
          { id: 'electricity', label: 'Electricity', type: 'select', options: ['Included in rental', 'Tenant pays separately', 'Pre-paid meter'] },
          { id: 'water', label: 'Water', type: 'select', options: ['Included in rental', 'Tenant pays separately'] },
          { id: 'petsAllowed', label: 'Pets', type: 'select', options: ['Not allowed', 'Allowed with written consent', 'Allowed'] },
        ],
      },
    ],
  },
  {
    id: 'employment',
    name: 'Employment Contract',
    description: 'BCEA-compliant employment contract with full terms and conditions.',
    category: 'Employment',
    icon: '💼',
    popular: true,
    fields: [
      {
        id: 'employer', title: 'Employer Details', icon: '🏢',
        fields: [
          { id: 'employerName', label: 'Employer / Company Name', type: 'text', required: true },
          { id: 'employerAddress', label: 'Employer Address', type: 'textarea', required: true },
          { id: 'employerPhone', label: 'Employer Phone', type: 'phone' },
          { id: 'employerReg', label: 'Company Registration Number', type: 'text' },
        ],
      },
      {
        id: 'employee', title: 'Employee Details', icon: '👤',
        fields: [
          { id: 'employeeFullName', label: 'Employee Full Name', type: 'text', required: true },
          { id: 'employeeId', label: 'Employee ID Number', type: 'text', required: true },
          { id: 'employeeAddress', label: 'Employee Address', type: 'textarea' },
          { id: 'employeePhone', label: 'Employee Phone', type: 'phone' },
          { id: 'employeeEmail', label: 'Employee Email', type: 'email' },
        ],
      },
      {
        id: 'job', title: 'Job Details', icon: '💼',
        fields: [
          { id: 'jobTitle', label: 'Job Title', type: 'text', required: true },
          { id: 'department', label: 'Department', type: 'text' },
          { id: 'employmentType', label: 'Employment Type', type: 'select', options: ['Permanent', 'Fixed Term', 'Part-Time', 'Casual', 'Probationary'] },
          { id: 'startDate', label: 'Start Date', type: 'date', required: true },
          { id: 'endDate', label: 'Contract End Date (if fixed term)', type: 'date' },
          { id: 'probationPeriod', label: 'Probation Period', type: 'select', options: ['None', '1 month', '3 months', '6 months'] },
          { id: 'placeOfWork', label: 'Place of Work', type: 'text', placeholder: 'e.g. Head Office, Remote, or Multiple Sites' },
          { id: 'workingHours', label: 'Working Hours', type: 'text', placeholder: 'e.g. Mon–Fri, 08:00–17:00 (45hrs/week)' },
          { id: 'jobDescription', label: 'Key Responsibilities', type: 'textarea' },
        ],
      },
      {
        id: 'remuneration', title: 'Remuneration & Benefits', icon: '💰',
        fields: [
          { id: 'grossSalary', label: 'Gross Monthly Salary (R)', type: 'number', required: true },
          { id: 'salaryFrequency', label: 'Pay Frequency', type: 'select', options: ['Monthly', 'Bi-weekly', 'Weekly'] },
          { id: 'annualLeave', label: 'Annual Leave', type: 'select', options: ['15 days per year', '21 days per year', '30 days per year'] },
          { id: 'noticePeriodEmployee', label: 'Notice Period (Employee)', type: 'select', options: ['1 week', '2 weeks', '1 month', '2 months'] },
          { id: 'noticePeriodEmployer', label: 'Notice Period (Employer)', type: 'select', options: ['1 week', '2 weeks', '1 month', '2 months'] },
        ],
      },
    ],
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement to protect confidential business information.',
    category: 'Legal',
    icon: '🔒',
    fields: [
      {
        id: 'parties', title: 'Parties', icon: '👥',
        fields: [
          { id: 'disclosingParty', label: 'Disclosing Party (Full Name / Company)', type: 'text', required: true },
          { id: 'disclosingAddress', label: 'Disclosing Party Address', type: 'textarea' },
          { id: 'receivingParty', label: 'Receiving Party (Full Name / Company)', type: 'text', required: true },
          { id: 'receivingAddress', label: 'Receiving Party Address', type: 'textarea' },
          { id: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', placeholder: 'e.g. Evaluating a potential business partnership for mobile app development', required: true },
        ],
      },
      {
        id: 'terms', title: 'NDA Terms', icon: '📄',
        fields: [
          { id: 'ndaType', label: 'NDA Type', type: 'select', options: ['One-way (Unilateral)', 'Two-way (Mutual)'] },
          { id: 'duration', label: 'Confidentiality Period', type: 'select', options: ['1 year', '2 years', '3 years', '5 years', 'Indefinite'] },
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'jurisdiction', label: 'Governing Jurisdiction', type: 'text', placeholder: 'e.g. Durban, KwaZulu-Natal, South Africa' },
          { id: 'confidentialInfo', label: 'Description of Confidential Information', type: 'textarea', placeholder: 'e.g. Business plans, source code, client lists, financial data, trade secrets' },
          { id: 'exclusions', label: 'Exclusions (what is NOT confidential)', type: 'textarea', placeholder: 'e.g. Information already in the public domain' },
        ],
      },
    ],
  },
  {
    id: 'affidavit',
    name: 'Affidavit',
    description: 'Sworn affidavit for legal or administrative use.',
    category: 'Legal',
    icon: '⚖️',
    fields: [
      {
        id: 'deponent', title: 'Deponent Details', icon: '👤',
        fields: [
          { id: 'deponentName', label: 'Full Name', type: 'text', required: true },
          { id: 'deponentId', label: 'ID Number', type: 'text', required: true },
          { id: 'deponentAddress', label: 'Residential Address', type: 'textarea', required: true },
          { id: 'deponentOccupation', label: 'Occupation', type: 'text' },
        ],
      },
      {
        id: 'statement', title: 'Statement', icon: '📝',
        fields: [
          { id: 'affidavitPurpose', label: 'Purpose of Affidavit', type: 'text', placeholder: 'e.g. Confirmation of identity for SASSA application', required: true },
          { id: 'statement', label: 'Statement (in your own words)', type: 'textarea', placeholder: 'I hereby declare that...', required: true },
          { id: 'additionalInfo', label: 'Additional Information (optional)', type: 'textarea' },
          { id: 'statementDate', label: 'Date of Statement', type: 'date', required: true },
          { id: 'location', label: 'Place Where Sworn', type: 'text', placeholder: 'e.g. Pietermaritzburg, KwaZulu-Natal' },
        ],
      },
    ],
  },
  {
    id: 'sale',
    name: 'Deed of Sale',
    description: 'Sale agreement for property or assets, compliant with SA law.',
    category: 'Property',
    icon: '🤝',
    fields: [
      {
        id: 'parties', title: 'Seller & Buyer', icon: '👥',
        fields: [
          { id: 'sellerFullName', label: 'Seller Full Name / Entity', type: 'text', required: true },
          { id: 'sellerIdReg', label: 'Seller ID / Registration Number', type: 'text', required: true },
          { id: 'sellerAddress', label: 'Seller Address', type: 'textarea', required: true },
          { id: 'sellerPhone', label: 'Seller Phone', type: 'phone' },
          { id: 'sellerEmail', label: 'Seller Email', type: 'email' },
          { id: 'buyerFullName', label: 'Buyer Full Name / Entity', type: 'text', required: true },
          { id: 'buyerIdReg', label: 'Buyer ID / Registration Number', type: 'text', required: true },
          { id: 'buyerAddress', label: 'Buyer Address', type: 'textarea', required: true },
          { id: 'buyerPhone', label: 'Buyer Phone', type: 'phone' },
          { id: 'buyerEmail', label: 'Buyer Email', type: 'email' },
        ],
      },
      {
        id: 'asset', title: 'Asset Description', icon: '🏗️',
        fields: [
          { id: 'saleType', label: 'Type of Sale', type: 'select', options: ['Residential Property', 'Commercial Property', 'Vehicle', 'Business', 'Other Asset'] },
          { id: 'propertyDescription', label: 'Full Description of Asset / Property', type: 'textarea', required: true },
          { id: 'municipalAddress', label: 'Municipal Address / Location', type: 'text' },
          { id: 'inclusionsFixtures', label: 'What is Included', type: 'textarea', placeholder: 'e.g. All built-in cupboards, stove, blinds' },
          { id: 'exclusions', label: 'What is Excluded', type: 'textarea' },
        ],
      },
      {
        id: 'price', title: 'Purchase Price', icon: '💵',
        fields: [
          { id: 'purchasePrice', label: 'Purchase Price (R)', type: 'number', required: true },
          { id: 'depositAmount', label: 'Deposit Amount (R)', type: 'number' },
          { id: 'balancePayment', label: 'Balance Payment Method', type: 'select', options: ['Bond / Mortgage', 'Cash on transfer', 'Instalment plan', 'Other'] },
          { id: 'occupationDate', label: 'Occupation Date', type: 'date' },
          { id: 'voetstoots', label: 'Sold Voetstoots (As-Is)', type: 'select', options: ['Yes — sold as-is', 'No — with warranties'] },
          { id: 'specialConditions', label: 'Special Conditions', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'cv',
    name: 'Curriculum Vitae',
    description: 'Professional CV/resume with modern formatting.',
    category: 'Personal',
    icon: '📄',
    fields: [
      {
        id: 'personal', title: 'Personal Details', icon: '👤',
        fields: [
          { id: 'fullName', label: 'Full Name', type: 'text', required: true },
          { id: 'jobTitle', label: 'Job Title / Desired Role', type: 'text', required: true },
          { id: 'phone', label: 'Phone Number', type: 'phone', required: true },
          { id: 'email', label: 'Email Address', type: 'email', required: true },
          { id: 'location', label: 'City, Province', type: 'text', placeholder: 'Pietermaritzburg, KwaZulu-Natal' },
          { id: 'portfolio', label: 'Portfolio / Website', type: 'text' },
          { id: 'driversLicense', label: "Driver's License", type: 'select', options: ['No licence', 'Code 8', 'Code 10', 'Code 10 – C1', 'Code 14'] },
        ],
      },
      {
        id: 'profile', title: 'Profile & Skills', icon: '⚡',
        fields: [
          { id: 'profileSummary', label: 'Profile Summary', type: 'textarea', required: true },
          { id: 'keyStrengths', label: 'Key Strengths (comma-separated)', type: 'text', placeholder: 'Leadership, Communication, Problem Solving' },
          { id: 'technicalSkills', label: 'Technical Skills (comma-separated)', type: 'text' },
          { id: 'languages', label: 'Languages Spoken', type: 'text', placeholder: 'English, IsiZulu, Afrikaans' },
        ],
      },
      {
        id: 'experience', title: 'Work Experience', icon: '💼',
        fields: [
          { id: 'job1Title', label: 'Most Recent Job Title', type: 'text' },
          { id: 'job1Company', label: 'Company Name', type: 'text' },
          { id: 'job1Start', label: 'Start Date', type: 'text', placeholder: 'April 2017' },
          { id: 'job1End', label: 'End Date', type: 'text', placeholder: 'Present' },
          { id: 'job1Duties', label: 'Key Responsibilities', type: 'textarea' },
          { id: 'job2Title', label: 'Previous Job Title', type: 'text' },
          { id: 'job2Company', label: 'Company Name', type: 'text' },
          { id: 'job2Start', label: 'Start Date', type: 'text' },
          { id: 'job2End', label: 'End Date', type: 'text' },
          { id: 'job2Duties', label: 'Key Responsibilities', type: 'textarea' },
        ],
      },
      {
        id: 'education', title: 'Education & References', icon: '🎓',
        fields: [
          { id: 'qual1Name', label: 'Highest Qualification', type: 'text' },
          { id: 'qual1Institution', label: 'Institution', type: 'text' },
          { id: 'qual1Year', label: 'Year', type: 'text' },
          { id: 'certifications', label: 'Additional Certifications', type: 'textarea', placeholder: 'CompTIA A+, Diploma in IT Support...' },
          { id: 'ref1Name', label: 'Reference 1 Name', type: 'text' },
          { id: 'ref1Title', label: 'Reference 1 Title', type: 'text' },
          { id: 'ref1Phone', label: 'Reference 1 Phone', type: 'phone' },
          { id: 'ref2Name', label: 'Reference 2 Name', type: 'text' },
          { id: 'ref2Title', label: 'Reference 2 Title', type: 'text' },
          { id: 'ref2Phone', label: 'Reference 2 Phone', type: 'phone' },
        ],
      },
    ],
  },
];

export const CATEGORIES = ['All', 'Finance', 'Legal', 'Property', 'Employment', 'Personal'];
