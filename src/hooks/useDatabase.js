import { useCallback } from 'react';
import { useAuth, useUser } from '@clerk/react';
import { createAuthenticatedSupabaseClient } from '../services/supabaseClient';

const isClerkAvailable = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isSupabaseAvailable = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Database hook that works in two modes:
 * 1. Cloud mode (Clerk + Supabase): When env vars are configured
 * 2. Local mode (localStorage fallback): When env vars are missing
 */
export function useDatabase() {
  // If both Clerk and Supabase are available, use cloud mode
  if (isClerkAvailable && isSupabaseAvailable) {
    return useCloudDatabase();
  }
  // Otherwise fall back to localStorage
  return useLocalDatabase();
}

// ── Local Storage Fallback ──────────────────────────────────────────────────
function useLocalDatabase() {
  const getStoredApps = () => {
    try {
      return JSON.parse(localStorage.getItem('ujt_applications') || '[]');
    } catch { return []; }
  };

  const saveApps = (apps) => {
    localStorage.setItem('ujt_applications', JSON.stringify(apps));
  };

  const createApplication = useCallback(async (data) => {
    const apps = getStoredApps();
    const newApp = {
      ...data,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    apps.unshift(newApp);
    saveApps(apps);
    return newApp.id;
  }, []);

  const getApplication = useCallback(async (id) => {
    const apps = getStoredApps();
    return apps.find(a => a.id === id) || null;
  }, []);

  const updateApplication = useCallback(async (id, updates) => {
    const apps = getStoredApps();
    const idx = apps.findIndex(a => a.id === id);
    if (idx !== -1) {
      apps[idx] = { ...apps[idx], ...updates, lastUpdated: new Date().toISOString() };
      saveApps(apps);
    }
  }, []);

  const deleteApplication = useCallback(async (id) => {
    const apps = getStoredApps().filter(a => a.id !== id);
    saveApps(apps);
  }, []);

  const getAllApplications = useCallback(async () => {
    return getStoredApps().sort((a, b) => 
      new Date(b.lastUpdated) - new Date(a.lastUpdated)
    );
  }, []);

  return { createApplication, getApplication, updateApplication, deleteApplication, getAllApplications };
}

// ── Cloud Database (Clerk + Supabase) ───────────────────────────────────────
function useCloudDatabase() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const getClient = useCallback(async () => {
    const token = await getToken({ template: 'supabase' });
    return createAuthenticatedSupabaseClient(token);
  }, [getToken]);

  const createApplication = useCallback(async (data) => {
    try {
      if (!user) return null;
      const client = await getClient();
      if (!client) return null;

      // Extract jobUrl and store inside promptResponses.__job_url__ to match Supabase schema
      const { jobUrl, ...rest } = data;
      const promptResponses = rest.promptResponses || {};
      const newApp = { 
        ...rest, 
        promptResponses: {
          ...promptResponses,
          __job_url__: jobUrl || ''
        },
        user_id: user.id 
      };

      const { data: insertedData, error } = await client
        .from('applications').insert([newApp]).select().single();
      if (error) { console.error("Error creating application:", error); throw error; }
      return insertedData.id;
    } catch (e) { console.error(e); return null; }
  }, [user, getClient]);

  const getApplication = useCallback(async (id) => {
    try {
      const client = await getClient();
      if (!client) return null;
      const { data, error } = await client
        .from('applications').select('*').eq('id', id).single();
      if (error) { console.error("Error getting application:", error); return null; }
      if (data) {
        // Restore jobUrl from promptResponses.__job_url__
        data.jobUrl = data.promptResponses?.__job_url__ || '';
      }
      return data;
    } catch (e) { console.error(e); return null; }
  }, [getClient]);

  const updateApplication = useCallback(async (id, updates) => {
    try {
      const client = await getClient();
      if (!client) return;

      const { jobUrl, ...rest } = updates;
      let finalUpdates = { ...rest };

      // Preserve __job_url__ if we are updating promptResponses, or merge/update it if jobUrl is provided
      if (rest.promptResponses) {
        const { data: currentApp } = await client
          .from('applications')
          .select('promptResponses')
          .eq('id', id)
          .single();
        
        const existingJobUrl = currentApp?.promptResponses?.__job_url__ || '';
        const finalJobUrl = jobUrl !== undefined ? jobUrl : existingJobUrl;

        finalUpdates.promptResponses = {
          ...rest.promptResponses,
          __job_url__: finalJobUrl
        };
      } else if (jobUrl !== undefined) {
        const { data: currentApp } = await client
          .from('applications')
          .select('promptResponses')
          .eq('id', id)
          .single();
        
        const currentPromptResponses = currentApp?.promptResponses || {};
        finalUpdates.promptResponses = {
          ...currentPromptResponses,
          __job_url__: jobUrl
        };
      }

      const { error } = await client
        .from('applications')
        .update({ ...finalUpdates, lastUpdated: new Date().toISOString() })
        .eq('id', id);
      if (error) { console.error("Error updating application:", error); throw error; }
    } catch (e) { console.error(e); }
  }, [getClient]);

  const deleteApplication = useCallback(async (id) => {
    try {
      const client = await getClient();
      if (!client) return;
      const { error } = await client
        .from('applications').delete().eq('id', id);
      if (error) { console.error("Error deleting application:", error); throw error; }
    } catch (e) { console.error(e); }
  }, [getClient]);

  const getAllApplications = useCallback(async () => {
    try {
      if (!user) return [];
      const client = await getClient();
      if (!client) return [];
      const { data, error } = await client
        .from('applications').select('*')
        .eq('user_id', user.id)
        .order('lastUpdated', { ascending: false });
      if (error) { console.error("Error fetching applications:", error); return []; }
      
      // Restore jobUrl for all items
      const mappedData = (data || []).map(app => ({
        ...app,
        jobUrl: app.promptResponses?.__job_url__ || ''
      }));
      return mappedData;
    } catch (e) { console.error(e); return []; }
  }, [user, getClient]);

  return { createApplication, getApplication, updateApplication, deleteApplication, getAllApplications };
}
