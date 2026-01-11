'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, copyToClipboard } from '@/lib/utils';

// Types
type SegmentType = 'flight' | 'lodging' | 'ground' | 'meeting' | 'meal' | 'reminder';
type TripPurpose = 'client' | 'conference' | 'site-visit' | 'offsite' | 'personal';
type PackingCategory = 'clothes' | 'tech' | 'toiletries' | 'documents' | 'work' | 'misc';

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  tag: 'ea' | 'driver' | 'hotel' | 'airline' | 'office' | 'client';
  favorite: boolean;
}

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  notes: string;
  distanceToHotel: string;
  distanceToOffice: string;
}

interface Segment {
  id: string;
  type: SegmentType;
  startTime: string;
  endTime: string;
  title: string;
  locationId: string;
  locationManual: string;
  contactIds: string[];
  confirmation: string;
  notes: string;
  attachments: string;
  // Flight specific
  airline: string;
  flightNumber: string;
  departAirport: string;
  arriveAirport: string;
  seat: string;
  baggage: string;
  // Lodging specific
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  // Ground specific
  transportType: 'uber' | 'blackcar' | 'rental' | 'shuttle' | '';
  pickupLocation: string;
  dropoffLocation: string;
  driverContact: string;
  // Meeting specific
  attendees: string;
  outcome: string;
  prepNotes: string;
  dialIn: string;
}

interface TripDay {
  id: string;
  date: string;
  segments: Segment[];
}

interface PackingItem {
  id: string;
  text: string;
  category: PackingCategory;
  checked: boolean;
  forExec: boolean;
}

interface TripSetup {
  tripName: string;
  executiveName: string;
  timezone: string;
  destination: string;
  homeCity: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  purpose: TripPurpose;
  purposeNotes: string;
  airline: string;
  airlineLoyalty: string;
  hotelPreference: string;
  hotelLoyalty: string;
  seatPreference: string;
  mealPreference: string;
  groundPreference: string;
  emergencyContact: string;
  documents: {
    passport: boolean;
    id: boolean;
    visa: boolean;
    globalEntry: boolean;
    tsa: boolean;
  };
}

interface SavedTrip {
  id: string;
  name: string;
  updatedAt: string;
  setup: TripSetup;
  days: TripDay[];
  packingList: PackingItem[];
}

interface TravelState {
  setup: TripSetup;
  contacts: Contact[];
  locations: Location[];
  days: TripDay[];
  packingList: PackingItem[];
  savedTrips: SavedTrip[];
  eaInternalNotes: string;
  showConfirmations: boolean;
  showAddresses: boolean;
  showPacking: boolean;
  outputFormat: 'bullets' | 'numbered';
}

// Constants
const SEGMENT_TYPES: { id: SegmentType; label: string; icon: string }[] = [
  { id: 'flight', label: 'Flight', icon: '✈️' },
  { id: 'lodging', label: 'Lodging', icon: '🏨' },
  { id: 'ground', label: 'Ground Transport', icon: '🚗' },
  { id: 'meeting', label: 'Meeting / Event', icon: '📅' },
  { id: 'meal', label: 'Meal / Personal', icon: '🍽️' },
  { id: 'reminder', label: 'Reminder / Task', icon: '📌' },
];

const PURPOSES: { id: TripPurpose; label: string }[] = [
  { id: 'client', label: 'Client Meetings' },
  { id: 'conference', label: 'Conference' },
  { id: 'site-visit', label: 'Site Visit' },
  { id: 'offsite', label: 'Internal Offsite' },
  { id: 'personal', label: 'Personal' },
];

const CONTACT_TAGS = [
  { id: 'ea', label: 'EA' },
  { id: 'driver', label: 'Driver' },
  { id: 'hotel', label: 'Hotel' },
  { id: 'airline', label: 'Airline' },
  { id: 'office', label: 'Office' },
  { id: 'client', label: 'Client' },
] as const;

const PACKING_TEMPLATES: Record<string, { category: PackingCategory; items: string[] }[]> = {
  'Business Trip': [
    { category: 'clothes', items: ['Suits (2)', 'Dress shirts (3)', 'Ties', 'Dress shoes', 'Casual outfit', 'Workout clothes'] },
    { category: 'tech', items: ['Laptop + charger', 'Phone charger', 'Power bank', 'Headphones', 'Adapters'] },
    { category: 'documents', items: ['ID/Passport', 'Business cards', 'Meeting materials', 'Itinerary printout'] },
    { category: 'toiletries', items: ['Toiletry bag', 'Medications'] },
  ],
  'Conference': [
    { category: 'clothes', items: ['Business casual outfits (3)', 'Comfortable shoes', 'Networking dinner outfit'] },
    { category: 'tech', items: ['Laptop + charger', 'Phone charger', 'Portable battery', 'Badge holder'] },
    { category: 'documents', items: ['Conference registration', 'Business cards (extra)', 'Notebook'] },
    { category: 'work', items: ['Company swag', 'Presentation materials'] },
  ],
  'Warm Weather': [
    { category: 'clothes', items: ['Light suits/blazers', 'Breathable shirts', 'Sunglasses', 'Light jacket (AC)'] },
    { category: 'toiletries', items: ['Sunscreen', 'Toiletry bag', 'Medications'] },
  ],
  'Cold Weather': [
    { category: 'clothes', items: ['Heavy coat', 'Layers', 'Warm accessories', 'Boots', 'Umbrella'] },
    { category: 'toiletries', items: ['Lip balm', 'Hand cream', 'Toiletry bag'] },
  ],
  'Overnight': [
    { category: 'clothes', items: ['Change of clothes', 'Sleepwear'] },
    { category: 'toiletries', items: ['Travel toiletry kit', 'Medications'] },
    { category: 'tech', items: ['Phone charger', 'Laptop if needed'] },
  ],
};

const TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney',
];

const STORAGE_KEY = 'eawiz-travel-brief';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York';
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function createEmptySegment(type: SegmentType): Segment {
  return {
    id: generateId(),
    type,
    startTime: '',
    endTime: '',
    title: '',
    locationId: '',
    locationManual: '',
    contactIds: [],
    confirmation: '',
    notes: '',
    attachments: '',
    airline: '',
    flightNumber: '',
    departAirport: '',
    arriveAirport: '',
    seat: '',
    baggage: '',
    hotelName: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    transportType: '',
    pickupLocation: '',
    dropoffLocation: '',
    driverContact: '',
    attendees: '',
    outcome: '',
    prepNotes: '',
    dialIn: '',
  };
}

export function ExecutiveTravelBrief() {
  const [state, setState] = useState<TravelState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      setup: {
        tripName: '',
        executiveName: '',
        timezone: getBrowserTimezone(),
        destination: '',
        homeCity: '',
        startDate: getDefaultDate(),
        startTime: '',
        endDate: '',
        endTime: '',
        purpose: 'client',
        purposeNotes: '',
        airline: '',
        airlineLoyalty: '',
        hotelPreference: '',
        hotelLoyalty: '',
        seatPreference: '',
        mealPreference: '',
        groundPreference: '',
        emergencyContact: '',
        documents: { passport: false, id: true, visa: false, globalEntry: false, tsa: false },
      },
      contacts: [],
      locations: [],
      days: [],
      packingList: [],
      savedTrips: [],
      eaInternalNotes: '',
      showConfirmations: true,
      showAddresses: true,
      showPacking: false,
      outputFormat: 'bullets',
    };
  });

  const [activeTab, setActiveTab] = useState<'setup' | 'contacts' | 'locations' | 'packing'>('setup');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Update setup
  const updateSetup = useCallback(<K extends keyof TripSetup>(key: K, value: TripSetup[K]) => {
    setState(prev => ({ ...prev, setup: { ...prev.setup, [key]: value } }));
  }, []);

  // Contact CRUD
  const saveContact = useCallback((contact: Contact) => {
    setState(prev => ({
      ...prev,
      contacts: contact.id && prev.contacts.find(c => c.id === contact.id)
        ? prev.contacts.map(c => c.id === contact.id ? contact : c)
        : [...prev.contacts, { ...contact, id: contact.id || generateId() }],
    }));
    setEditingContact(null);
  }, []);

  const deleteContact = useCallback((id: string) => {
    setState(prev => ({ ...prev, contacts: prev.contacts.filter(c => c.id !== id) }));
  }, []);

  // Location CRUD
  const saveLocation = useCallback((location: Location) => {
    setState(prev => ({
      ...prev,
      locations: location.id && prev.locations.find(l => l.id === location.id)
        ? prev.locations.map(l => l.id === location.id ? location : l)
        : [...prev.locations, { ...location, id: location.id || generateId() }],
    }));
    setEditingLocation(null);
  }, []);

  const deleteLocation = useCallback((id: string) => {
    setState(prev => ({ ...prev, locations: prev.locations.filter(l => l.id !== id) }));
  }, []);

  // Days management
  const addDay = useCallback(() => {
    const lastDay = state.days[state.days.length - 1];
    let nextDate = state.setup.startDate;
    if (lastDay?.date) {
      const d = new Date(lastDay.date + 'T12:00:00');
      d.setDate(d.getDate() + 1);
      nextDate = d.toISOString().split('T')[0];
    }
    setState(prev => ({
      ...prev,
      days: [...prev.days, { id: generateId(), date: nextDate, segments: [] }],
    }));
  }, [state.days, state.setup.startDate]);

  const updateDayDate = useCallback((dayId: string, date: string) => {
    setState(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId ? { ...d, date } : d),
    }));
  }, []);

  const removeDay = useCallback((dayId: string) => {
    setState(prev => ({ ...prev, days: prev.days.filter(d => d.id !== dayId) }));
  }, []);

  // Segment management
  const addSegment = useCallback((dayId: string, type: SegmentType) => {
    setState(prev => ({
      ...prev,
      days: prev.days.map(d =>
        d.id === dayId ? { ...d, segments: [...d.segments, createEmptySegment(type)] } : d
      ),
    }));
  }, []);

  const updateSegment = useCallback((dayId: string, segmentId: string, updates: Partial<Segment>) => {
    setState(prev => ({
      ...prev,
      days: prev.days.map(d =>
        d.id === dayId
          ? { ...d, segments: d.segments.map(s => s.id === segmentId ? { ...s, ...updates } : s) }
          : d
      ),
    }));
  }, []);

  const removeSegment = useCallback((dayId: string, segmentId: string) => {
    setState(prev => ({
      ...prev,
      days: prev.days.map(d =>
        d.id === dayId ? { ...d, segments: d.segments.filter(s => s.id !== segmentId) } : d
      ),
    }));
  }, []);

  // Packing list
  const loadPackingTemplate = useCallback((templateName: string) => {
    const template = PACKING_TEMPLATES[templateName];
    if (!template) return;

    const items: PackingItem[] = [];
    template.forEach(cat => {
      cat.items.forEach(text => {
        items.push({ id: generateId(), text, category: cat.category, checked: false, forExec: true });
      });
    });
    setState(prev => ({ ...prev, packingList: [...prev.packingList, ...items] }));
  }, []);

  const addPackingItem = useCallback((text: string, category: PackingCategory) => {
    if (!text.trim()) return;
    setState(prev => ({
      ...prev,
      packingList: [...prev.packingList, { id: generateId(), text: text.trim(), category, checked: false, forExec: true }],
    }));
  }, []);

  const togglePackingItem = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      packingList: prev.packingList.map(i => i.id === id ? { ...i, checked: !i.checked } : i),
    }));
  }, []);

  const removePackingItem = useCallback((id: string) => {
    setState(prev => ({ ...prev, packingList: prev.packingList.filter(i => i.id !== id) }));
  }, []);

  // Trip save/load
  const saveTrip = useCallback(() => {
    const name = state.setup.tripName || `Trip ${new Date().toLocaleDateString()}`;
    const trip: SavedTrip = {
      id: generateId(),
      name,
      updatedAt: new Date().toISOString(),
      setup: state.setup,
      days: state.days,
      packingList: state.packingList,
    };
    setState(prev => ({
      ...prev,
      savedTrips: [trip, ...prev.savedTrips.filter(t => t.name !== name)].slice(0, 20),
    }));
  }, [state.setup, state.days, state.packingList]);

  const loadTrip = useCallback((trip: SavedTrip) => {
    setState(prev => ({
      ...prev,
      setup: trip.setup,
      days: trip.days,
      packingList: trip.packingList,
    }));
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setState(prev => ({ ...prev, savedTrips: prev.savedTrips.filter(t => t.id !== id) }));
  }, []);

  const resetTrip = useCallback(() => {
    setState(prev => ({
      ...prev,
      setup: {
        tripName: '',
        executiveName: '',
        timezone: getBrowserTimezone(),
        destination: '',
        homeCity: '',
        startDate: getDefaultDate(),
        startTime: '',
        endDate: '',
        endTime: '',
        purpose: 'client',
        purposeNotes: '',
        airline: '',
        airlineLoyalty: '',
        hotelPreference: '',
        hotelLoyalty: '',
        seatPreference: '',
        mealPreference: '',
        groundPreference: '',
        emergencyContact: '',
        documents: { passport: false, id: true, visa: false, globalEntry: false, tsa: false },
      },
      days: [],
      packingList: [],
      eaInternalNotes: '',
    }));
  }, []);

  // Generate exec output
  const execOutput = useMemo(() => {
    const lines: string[] = [];
    const bullet = state.outputFormat === 'bullets' ? '•' : '';

    lines.push('EXECUTIVE TRAVEL BRIEF');
    lines.push('═'.repeat(40));
    if (state.setup.tripName) lines.push(state.setup.tripName);
    if (state.setup.executiveName) lines.push(`Traveler: ${state.setup.executiveName}`);
    lines.push(`${formatDate(state.setup.startDate)} - ${formatDate(state.setup.endDate)}`);
    if (state.setup.destination) lines.push(`Destination: ${state.setup.destination}`);
    lines.push(`Timezone: ${state.setup.timezone}`);
    lines.push('');

    // Key contacts
    const favoriteContacts = state.contacts.filter(c => c.favorite);
    if (favoriteContacts.length > 0) {
      lines.push('KEY CONTACTS');
      favoriteContacts.forEach(c => {
        lines.push(`${bullet} ${c.name} (${c.role})`);
        if (c.phone) lines.push(`  Phone: ${c.phone}`);
        if (c.email) lines.push(`  Email: ${c.email}`);
      });
      lines.push('');
    }

    // Day by day
    state.days.forEach(day => {
      lines.push(`─── ${formatDate(day.date)} ───`);
      if (day.segments.length === 0) {
        lines.push('  No events scheduled');
      }
      day.segments.forEach(seg => {
        const typeInfo = SEGMENT_TYPES.find(t => t.id === seg.type);
        const time = seg.startTime ? `${seg.startTime}${seg.endTime ? '-' + seg.endTime : ''}` : '';

        if (seg.type === 'flight') {
          lines.push(`${bullet} ${typeInfo?.icon} ${time} ${seg.airline} ${seg.flightNumber}`);
          lines.push(`  ${seg.departAirport} → ${seg.arriveAirport}`);
          if (seg.seat) lines.push(`  Seat: ${seg.seat}`);
          if (state.showConfirmations && seg.confirmation) lines.push(`  Conf: ${seg.confirmation}`);
        } else if (seg.type === 'lodging') {
          lines.push(`${bullet} ${typeInfo?.icon} ${seg.hotelName || seg.title}`);
          if (seg.checkIn) lines.push(`  Check-in: ${seg.checkIn}`);
          if (seg.checkOut) lines.push(`  Check-out: ${seg.checkOut}`);
          if (state.showConfirmations && seg.confirmation) lines.push(`  Conf: ${seg.confirmation}`);
        } else if (seg.type === 'ground') {
          lines.push(`${bullet} ${typeInfo?.icon} ${time} ${seg.transportType || 'Transport'}: ${seg.title || seg.pickupLocation + ' → ' + seg.dropoffLocation}`);
        } else {
          lines.push(`${bullet} ${typeInfo?.icon} ${time} ${seg.title}`);
          if (seg.locationManual) lines.push(`  Location: ${seg.locationManual}`);
        }
      });
      lines.push('');
    });

    // Confirmations
    if (state.showConfirmations) {
      const confirmations: string[] = [];
      state.days.forEach(d => d.segments.forEach(s => {
        if (s.confirmation) {
          confirmations.push(`${s.title || s.hotelName || s.airline}: ${s.confirmation}`);
        }
      }));
      if (confirmations.length > 0) {
        lines.push('CONFIRMATIONS');
        confirmations.forEach(c => lines.push(`${bullet} ${c}`));
        lines.push('');
      }
    }

    // Addresses
    if (state.showAddresses && state.locations.length > 0) {
      lines.push('KEY ADDRESSES');
      state.locations.forEach(loc => {
        lines.push(`${bullet} ${loc.name}`);
        lines.push(`  ${loc.address}`);
        if (loc.phone) lines.push(`  ${loc.phone}`);
      });
      lines.push('');
    }

    // Packing
    if (state.showPacking && state.packingList.length > 0) {
      lines.push('PACKING CHECKLIST');
      const byCategory = state.packingList.filter(i => i.forExec).reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, PackingItem[]>);

      Object.entries(byCategory).forEach(([cat, items]) => {
        lines.push(`  ${cat.toUpperCase()}`);
        items.forEach(i => lines.push(`  ${i.checked ? '☑' : '☐'} ${i.text}`));
      });
    }

    return lines.join('\n');
  }, [state]);

  // Generate EA internal output
  const eaOutput = useMemo(() => {
    const lines: string[] = [];

    lines.push('EA INTERNAL TRAVEL BRIEF');
    lines.push('═'.repeat(40));
    lines.push('');
    lines.push(`Trip: ${state.setup.tripName || 'Unnamed'}`);
    lines.push(`Executive: ${state.setup.executiveName || 'N/A'}`);
    lines.push(`Dates: ${state.setup.startDate} to ${state.setup.endDate}`);
    lines.push(`Destination: ${state.setup.destination}`);
    lines.push(`Purpose: ${PURPOSES.find(p => p.id === state.setup.purpose)?.label}`);
    if (state.setup.purposeNotes) lines.push(`Notes: ${state.setup.purposeNotes}`);
    lines.push('');

    lines.push('PREFERENCES');
    if (state.setup.airline) lines.push(`  Airline: ${state.setup.airline} (${state.setup.airlineLoyalty || 'no loyalty #'})`);
    if (state.setup.hotelPreference) lines.push(`  Hotel: ${state.setup.hotelPreference} (${state.setup.hotelLoyalty || 'no loyalty #'})`);
    if (state.setup.seatPreference) lines.push(`  Seat: ${state.setup.seatPreference}`);
    if (state.setup.groundPreference) lines.push(`  Ground: ${state.setup.groundPreference}`);
    if (state.setup.emergencyContact) lines.push(`  Emergency: ${state.setup.emergencyContact}`);
    lines.push('');

    lines.push('DOCUMENTS');
    const docs = state.setup.documents;
    lines.push(`  Passport: ${docs.passport ? '✓' : '✗'} | ID: ${docs.id ? '✓' : '✗'} | Visa: ${docs.visa ? '✓' : '✗'}`);
    lines.push(`  Global Entry: ${docs.globalEntry ? '✓' : '✗'} | TSA Pre: ${docs.tsa ? '✓' : '✗'}`);
    lines.push('');

    lines.push('ALL CONTACTS');
    state.contacts.forEach(c => {
      lines.push(`  [${c.tag.toUpperCase()}] ${c.name} - ${c.role}`);
      lines.push(`    ${c.phone} | ${c.email}`);
      if (c.notes) lines.push(`    Notes: ${c.notes}`);
    });
    lines.push('');

    lines.push('ALL LOCATIONS');
    state.locations.forEach(loc => {
      lines.push(`  ${loc.name}`);
      lines.push(`    ${loc.address}`);
      if (loc.distanceToHotel) lines.push(`    Distance to hotel: ${loc.distanceToHotel}`);
      if (loc.notes) lines.push(`    Notes: ${loc.notes}`);
    });
    lines.push('');

    lines.push('FULL ITINERARY WITH NOTES');
    state.days.forEach(day => {
      lines.push(`\n─── ${formatDate(day.date)} ───`);
      day.segments.forEach(seg => {
        const typeInfo = SEGMENT_TYPES.find(t => t.id === seg.type);
        lines.push(`  ${typeInfo?.icon} ${seg.startTime || ''} ${seg.title || seg.hotelName || seg.airline + ' ' + seg.flightNumber}`);
        if (seg.notes) lines.push(`    [NOTES] ${seg.notes}`);
        if (seg.prepNotes) lines.push(`    [PREP] ${seg.prepNotes}`);
        if (seg.confirmation) lines.push(`    Confirmation: ${seg.confirmation}`);
      });
    });

    if (state.eaInternalNotes) {
      lines.push('\n─── EA PRIVATE NOTES ───');
      lines.push(state.eaInternalNotes);
    }

    return lines.join('\n');
  }, [state]);

  // Copy handler
  const handleCopy = useCallback(async (text: string, type: string) => {
    await copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  // Export/Import
  const exportJson = useCallback(() => {
    const data = { setup: state.setup, contacts: state.contacts, locations: state.locations, days: state.days, packingList: state.packingList };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-brief-${state.setup.tripName || 'trip'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importJson = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setState(prev => ({
          ...prev,
          setup: data.setup || prev.setup,
          contacts: data.contacts || prev.contacts,
          locations: data.locations || prev.locations,
          days: data.days || prev.days,
          packingList: data.packingList || prev.packingList,
        }));
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // Packing item input state
  const [newPackingItem, setNewPackingItem] = useState('');
  const [newPackingCategory, setNewPackingCategory] = useState<PackingCategory>('clothes');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel */}
      <div className="lg:col-span-3 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['setup', 'contacts', 'locations', 'packing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors',
                activeTab === tab ? 'bg-white shadow text-primary-700' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'setup' && (
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Trip Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                type="text"
                value={state.setup.tripName}
                onChange={e => updateSetup('tripName', e.target.value)}
                placeholder="Trip name"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                value={state.setup.executiveName}
                onChange={e => updateSetup('executiveName', e.target.value)}
                placeholder="Executive name"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={state.setup.startDate} onChange={e => updateSetup('startDate', e.target.value)} className="px-2 py-1.5 border border-gray-300 rounded text-sm" />
                <input type="date" value={state.setup.endDate} onChange={e => updateSetup('endDate', e.target.value)} className="px-2 py-1.5 border border-gray-300 rounded text-sm" />
              </div>
              <input
                type="text"
                value={state.setup.destination}
                onChange={e => updateSetup('destination', e.target.value)}
                placeholder="Destination city"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
              <select value={state.setup.purpose} onChange={e => updateSetup('purpose', e.target.value as TripPurpose)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                {PURPOSES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <select value={state.setup.timezone} onChange={e => updateSetup('timezone', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm">
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>

              <div className="border-t pt-3 mt-3">
                <div className="text-xs font-medium text-gray-700 mb-2">Preferences</div>
                <input type="text" value={state.setup.airline} onChange={e => updateSetup('airline', e.target.value)} placeholder="Airline preference" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm mb-2" />
                <input type="text" value={state.setup.hotelPreference} onChange={e => updateSetup('hotelPreference', e.target.value)} placeholder="Hotel preference" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm mb-2" />
                <input type="text" value={state.setup.groundPreference} onChange={e => updateSetup('groundPreference', e.target.value)} placeholder="Ground transport preference" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm" />
              </div>

              <div className="border-t pt-3">
                <div className="text-xs font-medium text-gray-700 mb-2">Documents</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(state.setup.documents).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={e => updateSetup('documents', { ...state.setup.documents, [key]: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600"
                      />
                      <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'contacts' && (
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Contacts</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditingContact({ id: '', name: '', role: '', phone: '', email: '', address: '', notes: '', tag: 'client', favorite: false })}>+</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {editingContact && (
                <div className="p-2 border rounded space-y-2 bg-gray-50">
                  <input type="text" value={editingContact.name} onChange={e => setEditingContact({ ...editingContact, name: e.target.value })} placeholder="Name" className="w-full px-2 py-1 border rounded text-sm" />
                  <input type="text" value={editingContact.role} onChange={e => setEditingContact({ ...editingContact, role: e.target.value })} placeholder="Role / Company" className="w-full px-2 py-1 border rounded text-sm" />
                  <input type="text" value={editingContact.phone} onChange={e => setEditingContact({ ...editingContact, phone: e.target.value })} placeholder="Phone" className="w-full px-2 py-1 border rounded text-sm" />
                  <input type="text" value={editingContact.email} onChange={e => setEditingContact({ ...editingContact, email: e.target.value })} placeholder="Email" className="w-full px-2 py-1 border rounded text-sm" />
                  <select value={editingContact.tag} onChange={e => setEditingContact({ ...editingContact, tag: e.target.value as Contact['tag'] })} className="w-full px-2 py-1 border rounded text-sm">
                    {CONTACT_TAGS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={editingContact.favorite} onChange={e => setEditingContact({ ...editingContact, favorite: e.target.checked })} className="rounded" />
                    <span>Key contact (show in brief)</span>
                  </label>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => saveContact(editingContact)}>Save</Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingContact(null)}>Cancel</Button>
                  </div>
                </div>
              )}
              {state.contacts.map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <div className="font-medium">{c.name} {c.favorite && '⭐'}</div>
                    <div className="text-xs text-gray-500">{c.role}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingContact(c)} className="text-gray-400 hover:text-primary-600">✎</button>
                    <button onClick={() => deleteContact(c.id)} className="text-gray-400 hover:text-red-500">×</button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === 'locations' && (
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Locations</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditingLocation({ id: '', name: '', address: '', phone: '', notes: '', distanceToHotel: '', distanceToOffice: '' })}>+</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {editingLocation && (
                <div className="p-2 border rounded space-y-2 bg-gray-50">
                  <input type="text" value={editingLocation.name} onChange={e => setEditingLocation({ ...editingLocation, name: e.target.value })} placeholder="Location name" className="w-full px-2 py-1 border rounded text-sm" />
                  <input type="text" value={editingLocation.address} onChange={e => setEditingLocation({ ...editingLocation, address: e.target.value })} placeholder="Full address" className="w-full px-2 py-1 border rounded text-sm" />
                  <input type="text" value={editingLocation.phone} onChange={e => setEditingLocation({ ...editingLocation, phone: e.target.value })} placeholder="Phone" className="w-full px-2 py-1 border rounded text-sm" />
                  <input type="text" value={editingLocation.distanceToHotel} onChange={e => setEditingLocation({ ...editingLocation, distanceToHotel: e.target.value })} placeholder="Distance to hotel (e.g., 2.5 mi)" className="w-full px-2 py-1 border rounded text-sm" />
                  <textarea value={editingLocation.notes} onChange={e => setEditingLocation({ ...editingLocation, notes: e.target.value })} placeholder="Notes (parking, security, etc.)" rows={2} className="w-full px-2 py-1 border rounded text-sm" />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => saveLocation(editingLocation)}>Save</Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingLocation(null)}>Cancel</Button>
                  </div>
                </div>
              )}
              {state.locations.map(loc => (
                <div key={loc.id} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{loc.name}</span>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingLocation(loc)} className="text-gray-400 hover:text-primary-600">✎</button>
                      <button onClick={() => deleteLocation(loc.id)} className="text-gray-400 hover:text-red-500">×</button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{loc.address}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === 'packing' && (
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Packing List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-xs font-medium text-gray-700 mb-1">Load Template</div>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(PACKING_TEMPLATES).map(t => (
                    <button key={t} onClick={() => loadPackingTemplate(t)} className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">{t}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPackingItem}
                  onChange={e => setNewPackingItem(e.target.value)}
                  placeholder="Add item..."
                  className="flex-1 px-2 py-1 border rounded text-sm"
                  onKeyDown={e => { if (e.key === 'Enter') { addPackingItem(newPackingItem, newPackingCategory); setNewPackingItem(''); } }}
                />
                <select value={newPackingCategory} onChange={e => setNewPackingCategory(e.target.value as PackingCategory)} className="px-2 py-1 border rounded text-xs">
                  <option value="clothes">Clothes</option>
                  <option value="tech">Tech</option>
                  <option value="toiletries">Toiletries</option>
                  <option value="documents">Documents</option>
                  <option value="work">Work</option>
                  <option value="misc">Misc</option>
                </select>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {state.packingList.map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={item.checked} onChange={() => togglePackingItem(item.id)} className="rounded" />
                    <span className={cn('flex-1', item.checked && 'line-through text-gray-400')}>{item.text}</span>
                    <span className="text-xs text-gray-400">{item.category}</span>
                    <button onClick={() => removePackingItem(item.id)} className="text-gray-400 hover:text-red-500">×</button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Trips */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Saved Trips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="primary" size="sm" onClick={saveTrip} className="w-full">Save Current Trip</Button>
            {state.savedTrips.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {state.savedTrips.map(trip => (
                  <div key={trip.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <button onClick={() => loadTrip(trip)} className="text-left flex-1 hover:text-primary-600 truncate">{trip.name}</button>
                    <button onClick={() => deleteTrip(trip.id)} className="text-gray-400 hover:text-red-500 ml-2">×</button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Itinerary */}
      <div className="lg:col-span-5 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Itinerary</CardTitle>
              <Button variant="primary" size="sm" onClick={addDay}>+ Add Day</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.days.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Click &quot;Add Day&quot; to start building your itinerary</p>
            ) : (
              state.days.map((day, dayIdx) => (
                <div key={day.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary">Day {dayIdx + 1}</Badge>
                    <input
                      type="date"
                      value={day.date}
                      onChange={e => updateDayDate(day.id, e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    />
                    <span className="text-sm text-gray-500">{formatDate(day.date)}</span>
                    <button onClick={() => removeDay(day.id)} className="ml-auto text-gray-400 hover:text-red-500">×</button>
                  </div>

                  <div className="space-y-2">
                    {day.segments.map(seg => (
                      <div key={seg.id} className="p-2 bg-gray-50 rounded border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span>{SEGMENT_TYPES.find(t => t.id === seg.type)?.icon}</span>
                          <select
                            value={seg.type}
                            onChange={e => updateSegment(day.id, seg.id, { type: e.target.value as SegmentType })}
                            className="text-xs border rounded px-1 py-0.5"
                          >
                            {SEGMENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                          </select>
                          <input
                            type="time"
                            value={seg.startTime}
                            onChange={e => updateSegment(day.id, seg.id, { startTime: e.target.value })}
                            className="text-xs border rounded px-1 py-0.5"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="time"
                            value={seg.endTime}
                            onChange={e => updateSegment(day.id, seg.id, { endTime: e.target.value })}
                            className="text-xs border rounded px-1 py-0.5"
                          />
                          <button onClick={() => removeSegment(day.id, seg.id)} className="ml-auto text-gray-400 hover:text-red-500">×</button>
                        </div>

                        {seg.type === 'flight' && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <input value={seg.airline} onChange={e => updateSegment(day.id, seg.id, { airline: e.target.value })} placeholder="Airline" className="px-2 py-1 border rounded" />
                            <input value={seg.flightNumber} onChange={e => updateSegment(day.id, seg.id, { flightNumber: e.target.value })} placeholder="Flight #" className="px-2 py-1 border rounded" />
                            <input value={seg.departAirport} onChange={e => updateSegment(day.id, seg.id, { departAirport: e.target.value })} placeholder="From (JFK)" className="px-2 py-1 border rounded" />
                            <input value={seg.arriveAirport} onChange={e => updateSegment(day.id, seg.id, { arriveAirport: e.target.value })} placeholder="To (LAX)" className="px-2 py-1 border rounded" />
                            <input value={seg.seat} onChange={e => updateSegment(day.id, seg.id, { seat: e.target.value })} placeholder="Seat" className="px-2 py-1 border rounded" />
                            <input value={seg.confirmation} onChange={e => updateSegment(day.id, seg.id, { confirmation: e.target.value })} placeholder="Confirmation #" className="px-2 py-1 border rounded" />
                          </div>
                        )}

                        {seg.type === 'lodging' && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <input value={seg.hotelName} onChange={e => updateSegment(day.id, seg.id, { hotelName: e.target.value })} placeholder="Hotel name" className="px-2 py-1 border rounded col-span-2" />
                            <input value={seg.checkIn} onChange={e => updateSegment(day.id, seg.id, { checkIn: e.target.value })} placeholder="Check-in time" className="px-2 py-1 border rounded" />
                            <input value={seg.checkOut} onChange={e => updateSegment(day.id, seg.id, { checkOut: e.target.value })} placeholder="Check-out time" className="px-2 py-1 border rounded" />
                            <input value={seg.roomType} onChange={e => updateSegment(day.id, seg.id, { roomType: e.target.value })} placeholder="Room type" className="px-2 py-1 border rounded" />
                            <input value={seg.confirmation} onChange={e => updateSegment(day.id, seg.id, { confirmation: e.target.value })} placeholder="Confirmation #" className="px-2 py-1 border rounded" />
                          </div>
                        )}

                        {seg.type === 'ground' && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <select value={seg.transportType} onChange={e => updateSegment(day.id, seg.id, { transportType: e.target.value as Segment['transportType'] })} className="px-2 py-1 border rounded">
                              <option value="">Type...</option>
                              <option value="uber">Uber</option>
                              <option value="blackcar">Black Car</option>
                              <option value="rental">Rental</option>
                              <option value="shuttle">Shuttle</option>
                            </select>
                            <input value={seg.confirmation} onChange={e => updateSegment(day.id, seg.id, { confirmation: e.target.value })} placeholder="Confirmation #" className="px-2 py-1 border rounded" />
                            <input value={seg.pickupLocation} onChange={e => updateSegment(day.id, seg.id, { pickupLocation: e.target.value })} placeholder="Pickup location" className="px-2 py-1 border rounded" />
                            <input value={seg.dropoffLocation} onChange={e => updateSegment(day.id, seg.id, { dropoffLocation: e.target.value })} placeholder="Dropoff location" className="px-2 py-1 border rounded" />
                          </div>
                        )}

                        {seg.type === 'meeting' && (
                          <div className="space-y-2 text-xs">
                            <input value={seg.title} onChange={e => updateSegment(day.id, seg.id, { title: e.target.value })} placeholder="Meeting title" className="w-full px-2 py-1 border rounded" />
                            <input value={seg.attendees} onChange={e => updateSegment(day.id, seg.id, { attendees: e.target.value })} placeholder="Attendees" className="w-full px-2 py-1 border rounded" />
                            <input value={seg.locationManual} onChange={e => updateSegment(day.id, seg.id, { locationManual: e.target.value })} placeholder="Location" className="w-full px-2 py-1 border rounded" />
                            <input value={seg.dialIn} onChange={e => updateSegment(day.id, seg.id, { dialIn: e.target.value })} placeholder="Dial-in / Zoom link" className="w-full px-2 py-1 border rounded" />
                            <textarea value={seg.prepNotes} onChange={e => updateSegment(day.id, seg.id, { prepNotes: e.target.value })} placeholder="Prep notes (EA only)" rows={2} className="w-full px-2 py-1 border rounded" />
                          </div>
                        )}

                        {(seg.type === 'meal' || seg.type === 'reminder') && (
                          <div className="space-y-2 text-xs">
                            <input value={seg.title} onChange={e => updateSegment(day.id, seg.id, { title: e.target.value })} placeholder="Title" className="w-full px-2 py-1 border rounded" />
                            <input value={seg.locationManual} onChange={e => updateSegment(day.id, seg.id, { locationManual: e.target.value })} placeholder="Location" className="w-full px-2 py-1 border rounded" />
                            <textarea value={seg.notes} onChange={e => updateSegment(day.id, seg.id, { notes: e.target.value })} placeholder="Notes" rows={2} className="w-full px-2 py-1 border rounded" />
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex flex-wrap gap-1">
                      {SEGMENT_TYPES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => addSegment(day.id, t.id)}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* EA Notes */}
        <Card variant="bordered" className="border-amber-300 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">EA Internal Notes</CardTitle>
              <Badge variant="warning" size="sm">Private</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={state.eaInternalNotes}
              onChange={e => setState(s => ({ ...s, eaInternalNotes: e.target.value }))}
              placeholder="Private notes, reminders, backup plans..."
              rows={3}
              className="w-full px-3 py-2 border border-amber-300 rounded text-sm bg-white resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Output */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Output Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <button onClick={() => setState(s => ({ ...s, outputFormat: 'bullets' }))} className={cn('flex-1 px-2 py-1.5 text-sm rounded border', state.outputFormat === 'bullets' ? 'bg-primary-600 text-white' : 'bg-white')}>Bullets</button>
              <button onClick={() => setState(s => ({ ...s, outputFormat: 'numbered' }))} className={cn('flex-1 px-2 py-1.5 text-sm rounded border', state.outputFormat === 'numbered' ? 'bg-primary-600 text-white' : 'bg-white')}>Numbered</button>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={state.showConfirmations} onChange={e => setState(s => ({ ...s, showConfirmations: e.target.checked }))} className="rounded" />
                Include confirmations section
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={state.showAddresses} onChange={e => setState(s => ({ ...s, showAddresses: e.target.checked }))} className="rounded" />
                Include addresses section
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={state.showPacking} onChange={e => setState(s => ({ ...s, showPacking: e.target.checked }))} className="rounded" />
                Include packing checklist
              </label>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Exec-Ready Brief</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gray-50 rounded text-sm text-gray-800 whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-y-auto font-mono">
              {execOutput || 'Build your itinerary to see output...'}
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-lg">Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="primary" size="sm" onClick={() => handleCopy(execOutput, 'exec')} className="w-full">
              {copied === 'exec' ? 'Copied!' : 'Copy Exec-Ready'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleCopy(eaOutput, 'ea')} className="w-full">
              {copied === 'ea' ? 'Copied!' : 'Copy EA Internal'}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={exportJson}>Export JSON</Button>
              <label className="cursor-pointer">
                <Button variant="secondary" size="sm" className="w-full pointer-events-none">Import JSON</Button>
                <input type="file" accept=".json" onChange={importJson} className="hidden" />
              </label>
            </div>
            <Button variant="outline" size="sm" onClick={resetTrip} className="w-full">Reset Trip</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
