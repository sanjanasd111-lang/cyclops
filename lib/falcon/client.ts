/**
 * Falcon-Mamba-7B AI Client & Inference Engine
 * Interacts with Hugging Face Inference API for tiiuae/falcon-mamba-7b
 */

export interface FalconInferenceOptions {
  prompt: string;
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
}

export async function queryFalconMamba(options: FalconInferenceOptions): Promise<{ success: boolean; text?: string; error?: string; source: 'FALCON_MAMBA_7B' | 'DETERMINISTIC_FALLBACK' }> {
  const apiKey = process.env.HF_API_KEY;

  if (!apiKey || apiKey === 'your_token_here') {
    return {
      success: false,
      error: 'Missing or invalid HF_API_KEY',
      source: 'DETERMINISTIC_FALLBACK',
    };
  }

  const endpoint = "https://api-inference.huggingface.co/models/tiiuae/falcon-mamba-7b";
  let retries = 3;
  let delay = 1000;

  while (retries > 0) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: options.prompt,
          parameters: {
            max_new_tokens: options.max_new_tokens || 512,
            temperature: options.temperature || 0.7,
            top_p: options.top_p || 0.9,
            return_full_text: false,
          },
        }),
      });

      if (response.status === 503) {
        // Model loading, wait and retry
        const errorData = await response.json().catch(() => ({}));
        const waitTime = errorData.estimated_time ? Math.ceil(errorData.estimated_time * 1000) : delay;
        await new Promise((resolve) => setTimeout(resolve, Math.min(waitTime, 3000)));
        retries--;
        delay *= 2;
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        // Try fallback to HF Router endpoint if standard model endpoint returns 404 or 400
        const routerRes = await fetch("https://router.huggingface.co/hf-inference/v1/chat/completions", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            model: "tiiuae/falcon-mamba-7b",
            messages: [{ role: "user", content: options.prompt }],
            max_tokens: options.max_new_tokens || 512,
          }),
        }).catch(() => null);

        if (routerRes && routerRes.ok) {
          const routerData = await routerRes.json();
          const generated = routerData.choices?.[0]?.message?.content || routerData[0]?.generated_text;
          if (generated) {
            return {
              success: true,
              text: generated.trim(),
              source: 'FALCON_MAMBA_7B',
            };
          }
        }

        return {
          success: false,
          error: `HuggingFace API error (${response.status}): ${errText.slice(0, 100)}`,
          source: 'DETERMINISTIC_FALLBACK',
        };
      }

      const result = await response.json();
      let generatedText = '';

      if (Array.isArray(result) && result[0]?.generated_text) {
        generatedText = result[0].generated_text;
      } else if (result.generated_text) {
        generatedText = result.generated_text;
      } else if (typeof result === 'string') {
        generatedText = result;
      }

      if (generatedText) {
        return {
          success: true,
          text: generatedText.trim(),
          source: 'FALCON_MAMBA_7B',
        };
      }

      return {
        success: false,
        error: 'Empty response from Falcon Mamba 7B',
        source: 'DETERMINISTIC_FALLBACK',
      };
    } catch (err: any) {
      retries--;
      if (retries === 0) {
        return {
          success: false,
          error: err.message || 'Failed to communicate with Falcon Mamba API',
          source: 'DETERMINISTIC_FALLBACK',
        };
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: 'Falcon Mamba API retries exhausted',
    source: 'DETERMINISTIC_FALLBACK',
  };
}
