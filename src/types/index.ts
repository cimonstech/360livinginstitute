export type Role = 'client' | 'admin'

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export type PublishTo = 'institute' | 'foundation' | 'both'
export type ResourceType = 'article' | 'pdf' | 'infographic'

export type EmailType =
  | 'booking_received'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'email_verification'
  | 'password_reset'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  role: Role
  email_verified: boolean
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  slug: string
  title: string
  description?: string
  duration_minutes: number
  price_ghs?: number
  /** Per-session override when use_global_price is false */
  price_override_ghs?: number | null
  /** Default true: use pricing_settings.global_price_ghs */
  use_global_price?: boolean | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  cover_image_url?: string | null
  cover_image_alt?: string | null
  author_id?: string | null
  author_name: string
  publish_to: PublishTo
  resource_type: ResourceType
  category?: string | null
  attachment_url?: string | null
  attachment_name?: string | null
  attachment_size?: number | null
  status: 'draft' | 'published'
  featured: boolean
  tags: string[] | null
  read_time_minutes: number
  published_at?: string | null
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  title: string
  slug: string
  description?: string | null
  resource_type: 'pdf' | 'infographic'
  publish_to: PublishTo
  category?: string | null
  file_url?: string | null
  file_name?: string | null
  file_size?: number | null
  image_url?: string | null
  image_alt?: string | null
  cover_image_url?: string | null
  author_name: string
  tags: string[]
  status: 'draft' | 'published'
  featured: boolean
  download_count: number
  published_at?: string | null
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  file_name: string
  file_url: string
  file_size?: number | null
  mime_type?: string | null
  alt_text?: string | null
  uploaded_by?: string | null
  used_in?: string | null
  created_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description?: string | null
  long_description?: string | null
  category: string
  event_date: string
  event_time?: string | null
  end_time?: string | null
  location: string
  is_online: boolean
  online_link?: string | null
  audience?: string | null
  cover_image_url?: string | null
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled'
  is_featured: boolean
  registration_link?: string | null
  max_attendees?: number | null
  show_attendee_count?: boolean | null
  created_at: string
  updated_at: string
  /** From select('*, event_registrations(count)') */
  event_registrations?: { count: number }[]
}

export interface EventRegistration {
  id: string
  event_id: string
  user_id?: string | null
  full_name: string
  email: string
  phone?: string | null
  organisation?: string | null
  status: 'registered' | 'attended' | 'cancelled' | 'no_show'
  is_guest: boolean
  notes?: string | null
  created_at: string
  updated_at: string
  events?: Event
}

export type DashboardEventRegistration = EventRegistration & {
  events: Pick<Event, 'title' | 'event_date' | 'event_time' | 'location'> | null
}

export interface PricingSettings {
  id: string
  global_price_ghs: number
  show_prices: boolean
  payment_instructions: string
  momo_number: string
  momo_name: string
  created_at?: string
  updated_at?: string
}

export interface Availability {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  slot_duration_minutes: number
  is_active: boolean
}

export interface BlackoutDate {
  id: string
  date: string
  reason?: string
}

export interface Appointment {
  id: string
  client_id?: string
  client_name: string
  client_email: string
  client_phone?: string
  service_id?: string
  service_title: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  status: AppointmentStatus
  notes?: string
  admin_notes?: string
  cancellation_reason?: string
  is_guest: boolean
  confirmed_at?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
  profiles?: Profile
  services?: Service
}

export interface EmailLog {
  id: string
  appointment_id?: string
  recipient_email: string
  email_type: EmailType
  subject?: string
  status: 'sent' | 'failed'
  resend_id?: string
  created_at: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingFormData {
  service_id: string
  service_title: string
  /** Copied from selected service in the booking wizard */
  duration_minutes?: number
  appointment_date: string
  appointment_time: string
  client_name: string
  client_email: string
  client_phone?: string
  notes?: string
  create_account?: boolean
  password?: string
  /** Used only in the booking wizard UI; not persisted */
  confirm_password?: string
}

export type ApplicationStatus = 'new' | 'reviewing' | 'accepted' | 'waitlisted' | 'rejected'
export type PartnerStatus = 'new' | 'reviewing' | 'active' | 'declined'
export type VolunteerStatus = 'new' | 'reviewing' | 'active' | 'inactive'
export type SponsorStatus = 'new' | 'contacted' | 'confirmed' | 'declined'

export interface FoundationApplication {
  id: string
  full_name: string
  email: string
  phone?: string
  age_range?: string
  gender?: string
  location?: string
  program_interest: string
  program_title: string
  motivation?: string
  heard_about_us?: string
  status: ApplicationStatus
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface FoundationPartner {
  id: string
  organisation_name: string
  contact_name: string
  email: string
  phone?: string
  organisation_type?: string
  website?: string
  partnership_interest?: string
  message?: string
  status: PartnerStatus
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface FoundationVolunteer {
  id: string
  full_name: string
  email: string
  phone?: string
  occupation?: string
  skills?: string
  availability?: string
  motivation?: string
  status: VolunteerStatus
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface FoundationSponsor {
  id: string
  full_name: string
  email: string
  phone?: string
  organisation?: string
  inquiry_type: 'sponsor' | 'donate'
  program_interest?: string
  message?: string
  status: SponsorStatus
  admin_notes?: string
  created_at: string
  updated_at: string
}
