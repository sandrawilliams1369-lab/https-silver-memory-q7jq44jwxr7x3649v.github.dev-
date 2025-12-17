
import { GoogleGenAI, Type } from "@google/genai";
import { Metrics, VMInfo } from "../types";

export const getGeminiInsights = async (metrics: Metrics, vms: VMInfo[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    System Health Data:
    - Active Players: ${metrics.active_players}
    - CPU Usage: ${metrics.cpu_usage.toFixed(2)}%
    - Memory Usage: ${metrics.memory_usage.toFixed(2)}%
    - Active VMs: ${metrics.active_vms}
    - Player/VM Ratio: ${metrics.active_players / (metrics.active_vms || 1)}
    - Unikernel Statuses: ${vms.map(v => v.status).join(', ')}

    Acting as a Senior DevOps Engineer for CraftBox (a high-performance gaming platform using Nanos unikernels), 
    provide 3 concise, actionable insights for production stability and cost-efficiency. 
    Focus on scaling, hardware utilization, or potential failures.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, description: 'low, medium, or high' },
              title: { type: Type.STRING },
              advice: { type: Type.STRING },
              action: { type: Type.STRING }
            },
            required: ['severity', 'title', 'advice', 'action']
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [{
      severity: 'medium',
      title: 'API Connectivity Interrupted',
      advice: 'The Gemini optimization engine is currently unavailable.',
      action: 'Check network or API key status.'
    }];
  }
};
