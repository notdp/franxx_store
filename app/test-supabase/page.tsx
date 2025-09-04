'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function TestSupabase() {
  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Check if we can get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Test 2: Check health
        const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`);
        const healthStatus = await healthCheck.text();
        
        setStatus({
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
          session: session,
          sessionError: sessionError?.message,
          healthStatus: healthStatus,
          healthCode: healthCheck.status
        });
      } catch (error: any) {
        setStatus({ error: error.message });
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(status, null, 2)}
      </pre>
      <div className="mt-4">
        <button
          onClick={async () => {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: 'github',
              options: {
                redirectTo: `${window.location.origin}/auth/callback`
              }
            });
            console.log('OAuth test:', { data, error });
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test GitHub OAuth
        </button>
      </div>
    </div>
  );
}