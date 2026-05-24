import { useAuth, useUser } from '@clerk/react';
import { useCallback } from 'react';
import { createAuthenticatedSupabaseClient } from '../services/supabaseClient';

export function useDatabase() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const getClient = useCallback(async () => {
    // Generate the Supabase JWT using the Clerk template we will create
    const token = await getToken({ template: 'supabase' });
    return createAuthenticatedSupabaseClient(token);
  }, [getToken]);

  const createApplication = async (data) => {
    if (!user) return null;
    const client = await getClient();
    
    const newApp = {
      ...data,
      user_id: user.id,
      // For Supabase we map JS properties to DB column names if needed,
      // but let's stick to the JSON keys provided.
    };

    const { data: insertedData, error } = await client
      .from('applications')
      .insert([newApp])
      .select()
      .single();

    if (error) {
      console.error("Error creating application:", error);
      throw error;
    }
    return insertedData.id;
  };

  const getApplication = async (id) => {
    const client = await getClient();
    const { data, error } = await client
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error getting application:", error);
      return null;
    }
    return data;
  };

  const updateApplication = async (id, updates) => {
    const client = await getClient();
    
    const { error } = await client
      .from('applications')
      .update({
        ...updates,
        lastUpdated: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  };

  const deleteApplication = async (id) => {
    const client = await getClient();
    const { error } = await client
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting application:", error);
      throw error;
    }
  };

  const getAllApplications = async () => {
    if (!user) return [];
    const client = await getClient();
    
    const { data, error } = await client
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('lastUpdated', { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
    return data;
  };

  return {
    createApplication,
    getApplication,
    updateApplication,
    deleteApplication,
    getAllApplications
  };
}
