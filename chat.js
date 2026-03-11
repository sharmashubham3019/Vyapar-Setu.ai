// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VyaparSetu AI — Netlify Serverless Function
// This file runs on Netlify's servers (not in the browser).
// Your API key stays here — users can NEVER see it.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

exports.handler = async function (event, context) {

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse what the browser sent us
    const { messages, systemPrompt } = JSON.parse(event.body);

    // Call Claude API using the secret key stored in Netlify's environment
    // The key is NEVER sent to the browser — it lives only here on the server
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,   // ← Secret key, safe here
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();

    // Send Claude's reply back to the browser
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('VyaparSetu AI Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error. Please try again.' })
    };
  }
};
