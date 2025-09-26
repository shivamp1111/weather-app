export const streamWeatherAgentResponse = async (messages, onChunk, onError, onDone, signal) => {
  try {
    const response = await fetch('https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mastra-dev-playground': 'true',
      },
      body: JSON.stringify({
        messages: messages,
        runId: "weatherAgent",
        maxRetries: 2,
        maxSteps: 5,
        temperature: 0.5,
        topP: 1,
        runtimeContext: {},
        threadId: 40,
        resourceId: "weatherAgent"
      }),
      signal: signal,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break; 
      }
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk); 
    }

    onDone();

  } catch (error) {
    onError(error); 
  }
};