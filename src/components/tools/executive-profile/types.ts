/**
 * Types for the Executive Profile tool
 */

export interface ContactRow {
  id: string;
  Name: string;
  Title: string;
  Company: string;
  Relationship: string;
  Phone: string;
  Email: string;
  Location: string;
  Priority: string;
  Notes: string;
}

export interface DocumentRow {
  id: string;
  'Document Type': string;
  Description: string;
  'Physical Location': string;
  'Digital Location': string;
  'Issue Date': string;
  'Expiry Date': string;
  Notes: string;
}

export interface VendorRow {
  id: string;
  'Service Type': string;
  Company: string;
  'Contact Name': string;
  Phone: string;
  Email: string;
  'Account #': string;
  Location: string;
  Notes: string;
}

export interface ProfileTables {
  contacts: ContactRow[];
  documents: DocumentRow[];
  vendors: VendorRow[];
}

export interface ProfileState {
  fields: Record<string, string>;
  tables: ProfileTables;
  lastSaved?: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export const CONTACT_COLUMNS = [
  'Name', 'Title', 'Company', 'Relationship', 'Phone', 'Email', 'Location', 'Priority', 'Notes'
] as const;

export const DOCUMENT_COLUMNS = [
  'Document Type', 'Description', 'Physical Location', 'Digital Location', 'Issue Date', 'Expiry Date', 'Notes'
] as const;

export const VENDOR_COLUMNS = [
  'Service Type', 'Company', 'Contact Name', 'Phone', 'Email', 'Account #', 'Location', 'Notes'
] as const;

export function createEmptyContactRow(): ContactRow {
  return {
    id: crypto.randomUUID(),
    Name: '',
    Title: '',
    Company: '',
    Relationship: '',
    Phone: '',
    Email: '',
    Location: '',
    Priority: '',
    Notes: '',
  };
}

export function createEmptyDocumentRow(): DocumentRow {
  return {
    id: crypto.randomUUID(),
    'Document Type': '',
    Description: '',
    'Physical Location': '',
    'Digital Location': '',
    'Issue Date': '',
    'Expiry Date': '',
    Notes: '',
  };
}

export function createEmptyVendorRow(): VendorRow {
  return {
    id: crypto.randomUUID(),
    'Service Type': '',
    Company: '',
    'Contact Name': '',
    Phone: '',
    Email: '',
    'Account #': '',
    Location: '',
    Notes: '',
  };
}

export function createEmptyState(): ProfileState {
  return {
    fields: {},
    tables: {
      contacts: [],
      documents: [],
      vendors: [],
    },
  };
}

export function isValidProfileState(data: unknown): data is ProfileState {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!obj.fields || typeof obj.fields !== 'object') return false;
  if (!obj.tables || typeof obj.tables !== 'object') return false;
  const tables = obj.tables as Record<string, unknown>;
  if (!Array.isArray(tables.contacts)) return false;
  if (!Array.isArray(tables.documents)) return false;
  if (!Array.isArray(tables.vendors)) return false;
  return true;
}
