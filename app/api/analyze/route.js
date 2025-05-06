// app/api/analyze/route.js
import { analyzeLandingPage } from '../../../utils/analyzer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Extract request data
    const body = await request.json();
    const { url, html } = body;

    if (!url && !html) {
      return NextResponse.json(
        { message: 'URL or HTML is required' },
        { status: 400 }
      );
    }

    let pageContent;
    
    if (url) {
      // Fetch the URL content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }
      pageContent = await response.text();
    } else {
      pageContent = html;
    }
    
    // Analyze the landing page with the URL for context if available
    const results = await analyzeLandingPage(pageContent, url);
    
    // Return the results
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}