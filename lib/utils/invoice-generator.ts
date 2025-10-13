/**
 * Utility functions for generating readable IDs and invoice numbers
 * Supports multi-company structure for future implementation
 */

export interface CompanyConfig {
  name: string;
  code: string;
}

// Default company configuration (will be dynamic in multi-company setup)
const DEFAULT_COMPANY: CompanyConfig = {
  name: 'RSLITE',
  code: 'RSLITE'
};

/**
 * Generates employee initials from contact name
 * Uses only first and last name, ignoring middle names
 * @param contact - Contact object or string
 * @returns Two-letter initials in uppercase
 */
export const generateEmployeeInitials = (contact: any): string => {
  const contactName = typeof contact === 'string' ? contact : contact?.name || 'Unknown';
  const nameParts = contactName.trim().split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) return 'UN';
  if (nameParts.length === 1) return nameParts[0].slice(0, 2).toUpperCase();
  
  // Use first and last name only
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts[nameParts.length - 1][0];
  return (firstInitial + lastInitial).toUpperCase();
};

// Global counter for incremental IDs
let globalIdCounter = 0;
const idMapping = new Map<string, string>(); // Maps UUID to sequential ID

// Global counter for invoice numbers to prevent duplicates
let globalInvoiceCounter = 0;
const invoiceMapping = new Map<string, string>(); // Maps contact+id to invoice number

/**
 * Generates a readable sequential ID from UUID
 * Creates incremental numbers starting from 1, no duplicates
 * @param id - Original UUID or ID
 * @returns Sequential number padded to 3 digits (e.g., "001", "002")
 */
export const generateReadableId = (id: string): string => {
  if (!id || id.length === 0) {
    globalIdCounter++;
    return String(globalIdCounter).padStart(3, '0');
  }

  // Check if we already have a mapping for this UUID
  if (idMapping.has(id)) {
    return idMapping.get(id)!;
  }

  // Generate new sequential ID
  globalIdCounter++;
  const sequentialId = String(globalIdCounter).padStart(3, '0');
  
  // Store the mapping
  idMapping.set(id, sequentialId);
  
  return sequentialId;
};

/**
 * Reset the ID counter (useful for testing or when starting fresh)
 */
export const resetIdCounter = (): void => {
  globalIdCounter = 0;
  idMapping.clear();
};

/**
 * Reset the invoice counter (useful for testing or when starting fresh)
 */
export const resetInvoiceCounter = (): void => {
  globalInvoiceCounter = 0;
  invoiceMapping.clear();
};

/**
 * Reset all counters (useful for testing or when starting fresh)
 */
export const resetAllCounters = (): void => {
  resetIdCounter();
  resetInvoiceCounter();
};

/**
 * Generates invoice number in format: COMPANY-EMPLOYEE_INITIALS SEQUENTIAL_NUMBER
 * Prevents duplicates by using a global counter
 * @param contact - Contact object or string
 * @param id - Entry ID (will be converted to readable format)
 * @param company - Company configuration (optional, uses default if not provided)
 * @returns Formatted invoice number (e.g., "RSLITE-TN 003")
 */
export const generateInvoiceNumber = (
  contact: any, 
  id: string, 
  company: CompanyConfig = DEFAULT_COMPANY
): string => {
  const initials = generateEmployeeInitials(contact);
  const contactKey = typeof contact === 'string' ? contact : contact?.name || 'Unknown';
  const mappingKey = `${contactKey}-${id}`;
  
  // Check if we already have an invoice number for this contact+id combination
  if (invoiceMapping.has(mappingKey)) {
    return invoiceMapping.get(mappingKey)!;
  }
  
  // Generate new sequential invoice number
  globalInvoiceCounter++;
  const sequentialNumber = String(globalInvoiceCounter).padStart(3, '0');
  const invoiceNumber = `${company.code}-${initials} ${sequentialNumber}`;
  
  // Store the mapping to prevent duplicates
  invoiceMapping.set(mappingKey, invoiceNumber);
  
  return invoiceNumber;
};

/**
 * Generates avatar initials from contact name
 * @param contact - Contact object or string
 * @returns Two-letter initials in uppercase
 */
export const generateAvatar = (contact: any): string => {
  return generateEmployeeInitials(contact);
};

/**
 * Future: Get company configuration from user context
 * This will be implemented when multi-company support is added
 */
export const getCompanyConfig = (): CompanyConfig => {
  // TODO: Implement dynamic company selection based on user context
  // For now, return default company
  return DEFAULT_COMPANY;
};

/**
 * Future: Generate invoice number with dynamic company
 * This will replace the current generateInvoiceNumber when multi-company is implemented
 */
export const generateDynamicInvoiceNumber = (contact: any, id: string): string => {
  const company = getCompanyConfig();
  return generateInvoiceNumber(contact, id, company);
};
