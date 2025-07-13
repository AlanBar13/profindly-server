import OpenAI from "openai";

export class OpenAIService {
  private _client: OpenAI;

  constructor() {
    this._client = new OpenAI({
      apiKey: Bun.env.OPENAI_API_KEY,
    });
  }

  async createAIResponse(instructions: string, input: string): Promise<string> {
    const response = await this._client.responses.create({
        model: "gpt-4o",
        instructions,
        input,
        temperature: 0.3,
        max_output_tokens: 300,
    });

    return response.output_text;
  }
}

export const openAIService = new OpenAIService();