/**
 * Section schema for the Executive Profile tool
 * Ported from the Google Apps Script version
 */

export interface FieldDef {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'email' | 'tel' | 'url';
  placeholder?: string;
  options?: string[];
}

export interface FieldGroup {
  title: string;
  fields: FieldDef[];
}

export interface TableGroup {
  title: string;
  tableKey: 'contacts' | 'documents' | 'vendors';
}

export interface Section {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  groups: (FieldGroup | TableGroup)[];
}

function isTableGroup(group: FieldGroup | TableGroup): group is TableGroup {
  return 'tableKey' in group;
}

export { isTableGroup };

export const SECTIONS: Section[] = [
  {
    id: 'overview',
    name: 'Overview',
    icon: '📊',
    subtitle: 'Executive summary and key information',
    groups: [
      {
        title: 'Executive Information',
        fields: [
          { id: 'exec_name', label: 'Executive Name', type: 'text', placeholder: 'Full name' },
          { id: 'exec_title', label: 'Title', type: 'text', placeholder: 'Current title' },
          { id: 'exec_company', label: 'Company', type: 'text', placeholder: 'Company name' },
          { id: 'exec_department', label: 'Department', type: 'text', placeholder: 'Department' },
          { id: 'exec_email', label: 'Email', type: 'email', placeholder: 'Email address' },
          { id: 'exec_phone', label: 'Phone', type: 'tel', placeholder: 'Phone number' },
        ],
      },
      {
        title: 'EA Information',
        fields: [
          { id: 'ea_name', label: 'EA Name', type: 'text', placeholder: 'Your name' },
          { id: 'ea_email', label: 'EA Email', type: 'email', placeholder: 'Your email' },
          { id: 'ea_phone', label: 'EA Phone', type: 'tel', placeholder: 'Your phone' },
          { id: 'ea_start_date', label: 'Start Date', type: 'date' },
        ],
      },
      {
        title: 'Quick Reference Notes',
        fields: [
          { id: 'overview_notes', label: 'Key Notes', type: 'textarea', placeholder: 'Important things to remember...' },
        ],
      },
    ],
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: '👤',
    subtitle: 'Personal details and preferences',
    groups: [
      {
        title: 'Basic Information',
        fields: [
          { id: 'personal_dob', label: 'Date of Birth', type: 'date' },
          { id: 'personal_ssn_last4', label: 'SSN Last 4', type: 'text', placeholder: 'Last 4 digits' },
          { id: 'personal_drivers_license', label: 'Driver\'s License #', type: 'text' },
          { id: 'personal_passport', label: 'Passport #', type: 'text' },
          { id: 'personal_passport_exp', label: 'Passport Expiry', type: 'date' },
        ],
      },
      {
        title: 'Home Address',
        fields: [
          { id: 'home_street', label: 'Street', type: 'text', placeholder: 'Street address' },
          { id: 'home_city', label: 'City', type: 'text' },
          { id: 'home_state', label: 'State', type: 'text' },
          { id: 'home_zip', label: 'ZIP', type: 'text' },
          { id: 'home_country', label: 'Country', type: 'text' },
        ],
      },
      {
        title: 'Emergency Contact',
        fields: [
          { id: 'emergency_name', label: 'Name', type: 'text' },
          { id: 'emergency_relationship', label: 'Relationship', type: 'text' },
          { id: 'emergency_phone', label: 'Phone', type: 'tel' },
          { id: 'emergency_email', label: 'Email', type: 'email' },
        ],
      },
      {
        title: 'Personal Preferences',
        fields: [
          { id: 'personal_nickname', label: 'Preferred Name/Nickname', type: 'text' },
          { id: 'personal_pronouns', label: 'Pronouns', type: 'text' },
          { id: 'personal_languages', label: 'Languages', type: 'text', placeholder: 'Languages spoken' },
          { id: 'personal_notes', label: 'Additional Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: '💼',
    subtitle: 'Work style and professional preferences',
    groups: [
      {
        title: 'Work Style',
        fields: [
          { id: 'work_style', label: 'Work Style', type: 'textarea', placeholder: 'How they prefer to work...' },
          { id: 'communication_style', label: 'Communication Preferences', type: 'textarea', placeholder: 'Email vs. Slack, response time expectations...' },
          { id: 'decision_style', label: 'Decision Making Style', type: 'textarea', placeholder: 'How they make decisions...' },
        ],
      },
      {
        title: 'Professional Bio',
        fields: [
          { id: 'bio_short', label: 'Short Bio (1-2 sentences)', type: 'textarea' },
          { id: 'bio_long', label: 'Long Bio', type: 'textarea' },
          { id: 'linkedin', label: 'LinkedIn URL', type: 'url' },
          { id: 'twitter', label: 'Twitter/X Handle', type: 'text' },
        ],
      },
      {
        title: 'Professional Preferences',
        fields: [
          { id: 'signature_preferences', label: 'Email Signature Preferences', type: 'textarea' },
          { id: 'response_templates', label: 'Standard Response Templates', type: 'textarea' },
          { id: 'professional_notes', label: 'Additional Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'support',
    name: 'Support Team',
    icon: '🤝',
    subtitle: 'Direct reports and support staff',
    groups: [
      {
        title: 'Direct Reports',
        fields: [
          { id: 'direct_reports', label: 'Direct Reports List', type: 'textarea', placeholder: 'Names and roles of direct reports...' },
        ],
      },
      {
        title: 'Key Stakeholders',
        fields: [
          { id: 'key_stakeholders', label: 'Key Internal Stakeholders', type: 'textarea', placeholder: 'Important internal relationships...' },
          { id: 'board_members', label: 'Board Members', type: 'textarea', placeholder: 'Board contacts and notes...' },
          { id: 'external_stakeholders', label: 'Key External Stakeholders', type: 'textarea', placeholder: 'Important external relationships...' },
        ],
      },
      {
        title: 'Support Team Notes',
        fields: [
          { id: 'support_notes', label: 'Team Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'meetings',
    name: 'Meetings',
    icon: '📅',
    subtitle: 'Meeting preferences and protocols',
    groups: [
      {
        title: 'Meeting Preferences',
        fields: [
          { id: 'meeting_duration', label: 'Preferred Meeting Duration', type: 'text', placeholder: '30 min, 45 min, 60 min...' },
          { id: 'meeting_buffer', label: 'Buffer Between Meetings', type: 'text', placeholder: '15 min, 30 min...' },
          { id: 'meeting_times', label: 'Preferred Meeting Times', type: 'textarea', placeholder: 'Best times for meetings...' },
          { id: 'no_meeting_times', label: 'No Meeting Times', type: 'textarea', placeholder: 'Times to keep clear...' },
        ],
      },
      {
        title: 'Meeting Types',
        fields: [
          { id: 'standing_meetings', label: 'Standing Meetings', type: 'textarea', placeholder: 'Regular recurring meetings...' },
          { id: 'one_on_ones', label: '1:1 Preferences', type: 'textarea', placeholder: 'How they like to run 1:1s...' },
          { id: 'team_meetings', label: 'Team Meeting Preferences', type: 'textarea' },
        ],
      },
      {
        title: 'Meeting Logistics',
        fields: [
          { id: 'video_platform', label: 'Preferred Video Platform', type: 'text', placeholder: 'Zoom, Teams, Google Meet...' },
          { id: 'meeting_room_prefs', label: 'Conference Room Preferences', type: 'textarea' },
          { id: 'meeting_notes', label: 'Additional Meeting Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    subtitle: 'Travel preferences and frequent destinations',
    groups: [
      {
        title: 'Travel Preferences',
        fields: [
          { id: 'airline_pref', label: 'Preferred Airline(s)', type: 'text' },
          { id: 'airline_loyalty', label: 'Airline Loyalty #', type: 'text' },
          { id: 'seat_pref', label: 'Seat Preference', type: 'text', placeholder: 'Aisle, window, specific rows...' },
          { id: 'class_pref', label: 'Class Preference', type: 'text', placeholder: 'First, business, economy+...' },
        ],
      },
      {
        title: 'Hotel Preferences',
        fields: [
          { id: 'hotel_pref', label: 'Preferred Hotel Chain(s)', type: 'text' },
          { id: 'hotel_loyalty', label: 'Hotel Loyalty #', type: 'text' },
          { id: 'room_pref', label: 'Room Preferences', type: 'textarea', placeholder: 'High floor, quiet, king bed...' },
        ],
      },
      {
        title: 'Ground Transportation',
        fields: [
          { id: 'car_rental_pref', label: 'Preferred Car Rental', type: 'text' },
          { id: 'car_rental_loyalty', label: 'Car Rental Loyalty #', type: 'text' },
          { id: 'car_type_pref', label: 'Vehicle Type Preference', type: 'text' },
          { id: 'rideshare_pref', label: 'Rideshare Preference', type: 'text', placeholder: 'Uber, Lyft, car service...' },
        ],
      },
      {
        title: 'TSA & Documents',
        fields: [
          { id: 'tsa_precheck', label: 'TSA PreCheck #', type: 'text' },
          { id: 'global_entry', label: 'Global Entry #', type: 'text' },
          { id: 'clear_member', label: 'CLEAR Member', type: 'select', options: ['Yes', 'No'] },
          { id: 'travel_docs_notes', label: 'Travel Document Notes', type: 'textarea' },
        ],
      },
      {
        title: 'Travel Notes',
        fields: [
          { id: 'frequent_destinations', label: 'Frequent Destinations', type: 'textarea' },
          { id: 'travel_restrictions', label: 'Travel Restrictions/Preferences', type: 'textarea' },
          { id: 'travel_notes', label: 'Additional Travel Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'contacts',
    name: 'Contacts',
    icon: '📇',
    subtitle: 'Key contacts and relationships',
    groups: [
      {
        title: 'Key Contacts',
        tableKey: 'contacts',
      },
    ],
  },
  {
    id: 'health',
    name: 'Health',
    icon: '🏥',
    subtitle: 'Health information and preferences',
    groups: [
      {
        title: 'Medical Information',
        fields: [
          { id: 'primary_physician', label: 'Primary Physician', type: 'text' },
          { id: 'physician_phone', label: 'Physician Phone', type: 'tel' },
          { id: 'blood_type', label: 'Blood Type', type: 'text' },
          { id: 'allergies', label: 'Allergies', type: 'textarea', placeholder: 'Food, medication, environmental...' },
        ],
      },
      {
        title: 'Insurance',
        fields: [
          { id: 'health_insurance', label: 'Health Insurance Provider', type: 'text' },
          { id: 'health_insurance_id', label: 'Insurance ID #', type: 'text' },
          { id: 'health_insurance_group', label: 'Group #', type: 'text' },
        ],
      },
      {
        title: 'Dietary',
        fields: [
          { id: 'dietary_restrictions', label: 'Dietary Restrictions', type: 'textarea' },
          { id: 'dietary_preferences', label: 'Dietary Preferences', type: 'textarea' },
          { id: 'favorite_foods', label: 'Favorite Foods', type: 'textarea' },
          { id: 'disliked_foods', label: 'Disliked Foods', type: 'textarea' },
        ],
      },
      {
        title: 'Health Notes',
        fields: [
          { id: 'health_notes', label: 'Additional Health Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial',
    icon: '💰',
    subtitle: 'Financial accounts and preferences',
    groups: [
      {
        title: 'Corporate Cards',
        fields: [
          { id: 'corp_card_type', label: 'Corporate Card Type', type: 'text' },
          { id: 'corp_card_last4', label: 'Card Last 4', type: 'text' },
          { id: 'corp_card_exp', label: 'Expiration', type: 'text' },
          { id: 'expense_system', label: 'Expense System', type: 'text', placeholder: 'Concur, Expensify, etc.' },
        ],
      },
      {
        title: 'Banking',
        fields: [
          { id: 'primary_bank', label: 'Primary Bank', type: 'text' },
          { id: 'banking_notes', label: 'Banking Notes', type: 'textarea' },
        ],
      },
      {
        title: 'Financial Notes',
        fields: [
          { id: 'financial_notes', label: 'Additional Financial Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    icon: '👨‍👩‍👧‍👦',
    subtitle: 'Family members and important dates',
    groups: [
      {
        title: 'Spouse/Partner',
        fields: [
          { id: 'spouse_name', label: 'Name', type: 'text' },
          { id: 'spouse_phone', label: 'Phone', type: 'tel' },
          { id: 'spouse_email', label: 'Email', type: 'email' },
          { id: 'spouse_employer', label: 'Employer', type: 'text' },
          { id: 'anniversary', label: 'Anniversary', type: 'date' },
        ],
      },
      {
        title: 'Children',
        fields: [
          { id: 'children', label: 'Children Details', type: 'textarea', placeholder: 'Names, ages, schools...' },
        ],
      },
      {
        title: 'Parents',
        fields: [
          { id: 'parents', label: 'Parents Details', type: 'textarea', placeholder: 'Names, contact info...' },
        ],
      },
      {
        title: 'Pets',
        fields: [
          { id: 'pets', label: 'Pets', type: 'textarea', placeholder: 'Names, types, vet info...' },
        ],
      },
      {
        title: 'Important Dates',
        fields: [
          { id: 'family_birthdays', label: 'Family Birthdays', type: 'textarea' },
          { id: 'family_notes', label: 'Family Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: '🎯',
    subtitle: 'Hobbies, interests, and preferences',
    groups: [
      {
        title: 'Interests & Hobbies',
        fields: [
          { id: 'hobbies', label: 'Hobbies', type: 'textarea' },
          { id: 'sports_teams', label: 'Favorite Sports Teams', type: 'textarea' },
          { id: 'interests', label: 'Other Interests', type: 'textarea' },
        ],
      },
      {
        title: 'Gift Preferences',
        fields: [
          { id: 'gift_ideas', label: 'Gift Ideas', type: 'textarea' },
          { id: 'gift_avoid', label: 'Gifts to Avoid', type: 'textarea' },
          { id: 'favorite_restaurants', label: 'Favorite Restaurants', type: 'textarea' },
          { id: 'favorite_stores', label: 'Favorite Stores/Brands', type: 'textarea' },
        ],
      },
      {
        title: 'Lifestyle Notes',
        fields: [
          { id: 'lifestyle_notes', label: 'Additional Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'property',
    name: 'Property',
    icon: '🏠',
    subtitle: 'Properties and locations',
    groups: [
      {
        title: 'Primary Residence',
        fields: [
          { id: 'primary_address', label: 'Address', type: 'textarea' },
          { id: 'primary_gate_code', label: 'Gate/Access Code', type: 'text' },
          { id: 'primary_alarm_code', label: 'Alarm Code', type: 'text' },
          { id: 'primary_wifi', label: 'WiFi Password', type: 'text' },
        ],
      },
      {
        title: 'Secondary Residence',
        fields: [
          { id: 'secondary_address', label: 'Address', type: 'textarea' },
          { id: 'secondary_gate_code', label: 'Gate/Access Code', type: 'text' },
          { id: 'secondary_alarm_code', label: 'Alarm Code', type: 'text' },
          { id: 'secondary_wifi', label: 'WiFi Password', type: 'text' },
        ],
      },
      {
        title: 'Office Location',
        fields: [
          { id: 'office_address', label: 'Office Address', type: 'textarea' },
          { id: 'office_floor', label: 'Floor/Suite', type: 'text' },
          { id: 'parking_info', label: 'Parking Info', type: 'textarea' },
          { id: 'building_access', label: 'Building Access Notes', type: 'textarea' },
        ],
      },
      {
        title: 'Property Notes',
        fields: [
          { id: 'property_notes', label: 'Additional Property Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    subtitle: 'Devices and tech preferences',
    groups: [
      {
        title: 'Devices',
        fields: [
          { id: 'phone_model', label: 'Phone Model', type: 'text' },
          { id: 'phone_carrier', label: 'Phone Carrier', type: 'text' },
          { id: 'laptop_model', label: 'Laptop Model', type: 'text' },
          { id: 'tablet_model', label: 'Tablet Model', type: 'text' },
        ],
      },
      {
        title: 'Accounts & Software',
        fields: [
          { id: 'email_platform', label: 'Email Platform', type: 'text', placeholder: 'Outlook, Gmail, etc.' },
          { id: 'calendar_platform', label: 'Calendar Platform', type: 'text' },
          { id: 'productivity_tools', label: 'Productivity Tools', type: 'textarea' },
          { id: 'communication_tools', label: 'Communication Tools', type: 'textarea', placeholder: 'Slack, Teams, etc.' },
        ],
      },
      {
        title: 'Tech Support',
        fields: [
          { id: 'it_contact', label: 'IT Support Contact', type: 'text' },
          { id: 'tech_notes', label: 'Technology Notes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: '📄',
    subtitle: 'Important documents and records',
    groups: [
      {
        title: 'Document Registry',
        tableKey: 'documents',
      },
    ],
  },
  {
    id: 'vendors',
    name: 'Vendors',
    icon: '🏪',
    subtitle: 'Service providers and vendors',
    groups: [
      {
        title: 'Vendor Directory',
        tableKey: 'vendors',
      },
    ],
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: '📝',
    subtitle: 'General notes and reminders',
    groups: [
      {
        title: 'General Notes',
        fields: [
          { id: 'general_notes', label: 'General Notes', type: 'textarea', placeholder: 'Any additional information...' },
        ],
      },
      {
        title: 'Protocols & Procedures',
        fields: [
          { id: 'protocols', label: 'Standard Protocols', type: 'textarea', placeholder: 'How to handle common situations...' },
        ],
      },
      {
        title: 'Important Reminders',
        fields: [
          { id: 'reminders', label: 'Reminders', type: 'textarea' },
        ],
      },
      {
        title: 'Lessons Learned',
        fields: [
          { id: 'lessons_learned', label: 'Lessons Learned', type: 'textarea', placeholder: 'What works, what doesn\'t...' },
        ],
      },
    ],
  },
];
