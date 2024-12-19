import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

// This ensures the route is always dynamic
export const dynamic = 'force-dynamic';

export async function GET(request) {
  // During build time or when SUPABASE_KEY is not available
  if (!process.env.SUPABASE_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 1500;

    console.time('getSimilarityData');
    const { data, error } = await supabase
      .from('resumes')
      .select('username, embedding, resume')
      .not('embedding', 'is', null)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching similarity data:', error);
      return NextResponse.json(
        { message: 'Error fetching similarity data' },
        { status: 500 }
      );
    }

    console.timeEnd('getSimilarityData');

    // Parse embeddings from strings to numerical arrays and extract position
    const parsedData = data.map(item => {
      let resumeData;
      try {
        resumeData = JSON.parse(item.resume);
      } catch (e) {
        console.warn('Failed to parse resume for user:', item.username);
        resumeData = {};
      }

      return {
        username: item.username,
        embedding: typeof item.embedding === 'string' 
          ? JSON.parse(item.embedding)
          : Array.isArray(item.embedding)
            ? item.embedding
            : null,
        position: resumeData?.basics?.label || 'Unknown Position'
      };
    }).filter(item => item.embedding !== null);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in similarity endpoint:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}