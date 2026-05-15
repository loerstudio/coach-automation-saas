import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core'

// Users table - ogni coach che si registra
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').unique().notNull(),
  name: text('name'),

  // Instant setup - salviamo encrypted tokens
  twilioConfigured: boolean('twilio_configured').default(false),
  resendConfigured: boolean('resend_configured').default(false),

  // Subscription
  plan: text('plan').default('trial'), // trial, pro
  subscriptionEndDate: timestamp('subscription_end_date'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Contacts - i contatti da CRM/CSV/Airtable
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),

  // Contact info
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),

  // Automation fields
  status: text('status').default('to_contact'), // to_contact, contacted, failed
  message: text('message'),
  customFields: jsonb('custom_fields'), // Per campi extra dal CRM

  // Tracking
  lastContactedAt: timestamp('last_contacted_at'),
  emailSent: boolean('email_sent').default(false),
  whatsappSent: boolean('whatsapp_sent').default(false),

  // Source
  source: text('source'), // csv, airtable, manual, api
  sourceId: text('source_id'), // ID nel sistema originale

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Automations - configurazioni automazione per utente
export const automations = pgTable('automations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),

  name: text('name').default('Main Automation'),
  active: boolean('active').default(true),

  // Source config
  sourceType: text('source_type'), // airtable, csv, api
  sourceConfig: jsonb('source_config'), // API keys, base IDs, etc (encrypted)

  // Message templates
  emailTemplate: text('email_template'),
  whatsappTemplate: text('whatsapp_template'),

  // Schedule
  checkInterval: integer('check_interval').default(15), // minuti
  lastRunAt: timestamp('last_run_at'),
  nextRunAt: timestamp('next_run_at'),

  // Stats
  totalEmailsSent: integer('total_emails_sent').default(0),
  totalWhatsappSent: integer('total_whatsapp_sent').default(0),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Logs - tracciamo ogni invio
export const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  contactId: integer('contact_id').references(() => contacts.id),

  type: text('type'), // email, whatsapp, error
  status: text('status'), // success, failed
  message: text('message'),
  details: jsonb('details'),

  createdAt: timestamp('created_at').defaultNow(),
})