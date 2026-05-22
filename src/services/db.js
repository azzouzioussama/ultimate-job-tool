/**
 * ============================================================================
 * FILE: db.js
 * PURPOSE: Dexie.js (IndexedDB) configuration and schema definition.
 * ============================================================================
 *
 * WHAT IS THIS?
 * This file sets up our local-first database. Dexie is a wrapper around
 * the browser's native IndexedDB. It allows us to store multiple job
 * applications securely in the user's browser without needing a backend.
 *
 * SCHEMA OVERVIEW:
 * - applications: Stores job details, original CV, and generated CV.
 */

import Dexie from 'dexie';

export const db = new Dexie('UltimateJobToolDB');

db.version(1).stores({
  // ++id = auto-incrementing primary key
  // We index companyName and lastUpdated for fast sorting/searching
  applications: '++id, companyName, jobTitle, lastUpdated'
});

// Helper functions for easy database access

export async function createApplication(data) {
  const newApp = {
    ...data,
    lastUpdated: Date.now(),
    createdAt: Date.now()
  };
  return await db.applications.add(newApp);
}

export async function getApplication(id) {
  return await db.applications.get(id);
}

export async function updateApplication(id, updates) {
  return await db.applications.update(id, {
    ...updates,
    lastUpdated: Date.now()
  });
}

export async function deleteApplication(id) {
  return await db.applications.delete(id);
}

export async function getAllApplications() {
  // Return all applications, sorted by most recently updated first
  return await db.applications.orderBy('lastUpdated').reverse().toArray();
}
