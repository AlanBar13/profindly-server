import type { Patient } from "../models/patient.model";
import type { Specialist } from "../models/specialist.model";
import { openAIService as service, OpenAIService } from "./openai";

export type PatientInfo = {
  age: number;
  syntoms: string;
  budget: [number, number];
  location?: string;
  languages?: string[];
};

class MatchingService {
  private openaiService: OpenAIService;
  constructor() {
    this.openaiService = service;
  }

  calculateDistance(location1: string, location2: string): number {
    return location1 === location2 ? 0 : 10; // Same location = 0, different location = 10
  }

  calculatePoints(patient: Patient, specialist: Specialist): number {
    let points = 0;

    if (
      specialist.speciality.some(
        (spec) => patient.syntoms.includes(spec) || patient.diagnostic === spec
      )
    ) {
      points += 40;
    }

    if (
      specialist.subspecialities?.some((sub) => patient.syntoms.includes(sub))
    ) {
      points += 20;
    }

    const distance = this.calculateDistance(
      patient.location ?? "",
      specialist.location ?? "none"
    );
    if (distance === 0) {
      points += 20;
    }

    if (specialist.languages.some((lang) => patient.languages.includes(lang))) {
      points += 10;
    }

    if (
      patient.budget[0] >= specialist.budget_range[0] &&
      patient.budget[1] <= specialist.budget_range[1]
    ) {
      points += 20;
    }

    //Experience poitns
    if (specialist.experience) {
      if (specialist.experience >= 5) {
        points += 5;
      } else if (specialist.experience >= 10) {
        points += 10;
      } else if (specialist.experience >= 15) {
        points += 15;
      }
    }

    //Rating points
    if (specialist.rating) {
      if (specialist.rating >= 4) {
        points += 5;
      } else if (specialist.rating >= 4.5) {
        points += 10;
      } else if (specialist.rating >= 5) {
        points += 15;
      }
    }

    return points;
  }

  matchSpecialist(
    patient: Patient,
    specialists: Specialist[]
  ): { specialist: Specialist; points: number }[] {
    const results = specialists
      .map((specialist) => ({
        specialist,
        points: this.calculatePoints(patient, specialist),
      }))
      .filter((result) => result.points > 35)
      .sort((a, b) => b.points - a.points); // Ordet by points in descending order

    return results;
  }

  async matchSpecialistAI(specialists: Specialist[], info: PatientInfo) {
    const instructions =
      "Eres un asistente médico experto. Basado en los síntomas o descripción del paciente, devuelve solo 3 especialistas más relevantes como un arreglo JSON. Sé preciso y no divagues. No des información médica, solo recomendaciones de especialistas.";

    const input = `Paciente:
            Edad: ${info.age}
            Sintomas: ${info.syntoms}
            Presupuesto: ${info.budget[0]} - ${info.budget[1]}
            Ubicación: ${info.location ?? "No especificada"}

            Especialistas disponibles:
            ${specialists
              .map(
                (spec) =>
                  `especialista: ${spec.prefix} ${(spec.user as any).name} ${
                    (spec.user as any).lastname
                  }, especialidad: ${spec.speciality.join(
                    ", "
                  )}, subespecialidades: ${
                    spec.subspecialities?.join(", ") ?? "Ninguna"
                  }, presupuesto: ${spec.budget_range[0]} - ${
                    spec.budget_range[1]
                  }, ubicación: ${
                    spec.location ?? "No especificada"
                  }, idiomas: ${spec.languages.join(", ")}, experiencia: ${
                    spec.experience ?? "No especificada"
                  }, rating: ${
                    spec.rating ?? "No especificada"
                  }, descripcion: ${spec.brief_description}`
              )
              .join("\n")}

            Basado en la información del paciente, recomienda los 3 especialistas más adecuados con justificación.`;

    const response = await this.openaiService.createAIResponse(
      instructions,
      input
    );
    console.log("AI Response:", response);
    return response;
  }
}

export const matchingService = new MatchingService();
