import fs from 'fs';

try {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
  const supabaseKey = envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.*)/)[1].trim();

  const endpoint = `${supabaseUrl}/rest/v1/applications`;

  const validPayload = {
    companyName: 'Test Company',
    jobTitle: 'Test Job',
    jobDescription: 'Test Desc',
    cvOriginal: 'Test CV',
    cvGenerated: '',
    documents: [],
    atsResult: null,
    trackingStatus: 'Draft',
    promptResponses: {},
    atsScoreBefore: null,
    atsScoreAfter: null,
    lastGeneratedDate: null,
    aiResponses: []
  };

  console.log("Attempting valid insert...");
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(validPayload)
  });

  console.log("Response status:", response.status);
  const text = await response.text();
  console.log("Response body:", text);
  if (response.ok) {
    const inserted = JSON.parse(text);
    console.log("Columns returned by Supabase:", Object.keys(inserted[0] || inserted));
  }
} catch (e) {
  console.error("Insert test failed:", e);
}
