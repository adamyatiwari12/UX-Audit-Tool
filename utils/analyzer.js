import { JSDOM } from 'jsdom';

const calculateBasicMetrics = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const bodyText = document.body.textContent || '';
  const wordCount = bodyText.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  return {
    wordCount,
    readingTime,
    headingCount: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
    paragraphCount: document.querySelectorAll('p').length,
    imageCount: document.querySelectorAll('img').length,
    linkCount: document.querySelectorAll('a').length,
    buttonCount: document.querySelectorAll('button, .btn, [class*="button"], [type="button"], [type="submit"]').length
  };
};

const extractKeyComponents = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
    level: h.tagName.toLowerCase(),
    text: h.textContent.trim()
  }));
  
  const ctaElements = Array.from(document.querySelectorAll('button, .btn, [class*="button"], a[href]'));
  const ctas = ctaElements.map(cta => ({
    type: cta.tagName.toLowerCase(),
    text: cta.textContent.trim(),
    isProminent: cta.classList.toString().includes('primary') || 
                cta.style.fontSize > 16 ||
                cta.getBoundingClientRect().width > 200
  })).filter(cta => cta.text.length > 0);
  
  const title = document.querySelector('title')?.textContent || '';
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  return {
    title,
    metaDescription,
    headings,
    ctas
  };
};

export async function analyzeLandingPage(html, url = '') {
  try {
    const metrics = calculateBasicMetrics(html);
    const components = extractKeyComponents(html);
    
    const apiKey =process.env.GEMINI_API_KEY;
    
    if (!apiKey) {  
      console.error('Gemini API key is not set');
      throw new Error('Gemini API key is not set');
    }
    
    const prompt = `
      You are a UX expert specialized in landing page optimization. Analyze this landing page ${url ? `at ${url}` : ''} based on the HTML components I'll provide.
      
      Focus on:
      - CTA clarity and effectiveness
      - Visual hierarchy and layout
      - Copy effectiveness and readability
      - Trust signals and credibility
      
      Page Title: ${components.title}
      Meta Description: ${components.metaDescription}
      
      Headings:
      ${components.headings.map(h => `${h.level}: "${h.text}"`).join('\n')}
      
      Call-to-Actions:
      ${components.ctas.map(cta => `${cta.type}${cta.isProminent ? ' (prominent)' : ''}: "${cta.text}"`).join('\n')}
      
      Page Statistics:
      - Word Count: ${metrics.wordCount}
      - Reading Time: ${metrics.readingTime} min
      - Number of Headings: ${metrics.headingCount}
      - Number of Paragraphs: ${metrics.paragraphCount}
      - Number of Images: ${metrics.imageCount}
      - Number of Links: ${metrics.linkCount}
      - Number of Buttons: ${metrics.buttonCount}
      
      HTML Snapshot (truncated):
      ${html.substring(0, 3000)}
      
      Please analyze this landing page and provide your recommendations in JSON format with this structure:
      {
        "overallScore": number from 0-100,
        "suggestions": [
          {
            "title": "clear suggestion title",
            "category": "CTA, Hierarchy, Copy, or Trust",
            "description": "description of the issue",
            "recommendation": "specific recommendation"
          }
        ]
      }
    `;

    // Direct call to Gemini API using fetch
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    let analysisResult;
    try {
      analysisResult = JSON.parse(text);
    } catch (e) {
      console.error('Error parsing Gemini response as JSON:', e);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisResult = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          throw new Error('Failed to parse Gemini response');
        }
      } else {
        throw new Error('Failed to parse Gemini response');
      }
    }
    
    return {
      ...analysisResult,
      metrics: {
        "Word Count": metrics.wordCount.toString(),
        "Reading Time": `${metrics.readingTime} min`,
        "Headings": metrics.headingCount.toString(),
        "Paragraphs": metrics.paragraphCount.toString(),
        "Images": metrics.imageCount.toString(),
        "Links": metrics.linkCount.toString(),
        "Buttons": metrics.buttonCount.toString()
      }
    };
  } catch (error) {
    console.error('Error using Gemini API:', error);
    
    const metrics = calculateBasicMetrics(html);
    
    return {
      overallScore: 50,
      suggestions: [
        {
          title: "API Error - Basic Analysis Only",
          category: "Copy",
          description: `We couldn't perform a full UX analysis. Error: ${error.message}`,
          recommendation: "Please ensure your Gemini API key is correctly set up in your environment variables."
        }
      ],
      metrics: {
        "Word Count": metrics.wordCount.toString(),
        "Reading Time": `${metrics.readingTime} min`,
        "Headings": metrics.headingCount.toString(),
        "Paragraphs": metrics.paragraphCount.toString(),
        "Images": metrics.imageCount.toString(),
        "Links": metrics.linkCount.toString(),
        "Buttons": metrics.buttonCount.toString()
      }
    };
  }
}