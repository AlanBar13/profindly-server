import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const specialist = z.object({
  especialista: z.string(),
  especialidad: z.string(),
  subespecialidades: z.string(),
  presupuesto: z.string(),
  ubicacion: z.string(),
  id: z.string()
});

const OpenAIOutput = z.object({
  specialists: z.array(specialist),
});

export class OpenAIService {
  private _client: OpenAI;

  constructor() {
    this._client = new OpenAI({
      apiKey: Bun.env.OPENAI_API_KEY,
    });
  }

  async createAIResponse(instructions: string, input: string) {
    const response = await this._client.responses.parse({
      model: "gpt-4o",
      instructions,
      input,
      temperature: 0.3,
      max_output_tokens: 300,
      text: {
        format: zodTextFormat(OpenAIOutput, "output"),
      },
    });
    
    return response.output_parsed;
  }
}

export const openAIService = new OpenAIService();
