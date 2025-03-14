import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Profindly API",
      version: "1.0.0",
      description: "API documentation for Profindly",
    },
    components: {
      schemas: {
        Notification: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            body: {
              type: "string",
            },
            user_id: {
              type: "string",
            },
            token: {
              type: "string",
            },
            type: {
              type: "string",
            },
          },
          required: ["title", "body", "user_id", "token"],
        },
        Booking: {
          type: "object",
          properties: {
            services: {
              type: "string",
            },
            client: {
              type: "string",
            },
            startTime: {
              type: "string",
              format: "date-time",
            },
            endTime: {
              type: "string",
              format: "date-time",
            },
            status: {
              type: "string",
            },
          },
          required: ["services"],
        },
        UpdatedBooking: {
          type: "object",
          properties: {
            status: {
              type: "string",
            },
          },
        },
        Patient: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            age: {
              type: "number",
            },
            email: {
              type: "string",
              format: "email",
            },
            syntoms: {
              type: "array",
              items: {
                type: "string",
              },
            },
            diagnostic: {
              type: "string",
            },
            treatment: {
              type: "string",
            },
            budget: {
              type: "array",
              items: {
                type: "number",
              },
            },
            location: {
              type: "string",
            },
            languages: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["name", "age", "email", "budget", "location", "languages"],
        },
        Service: {
          type: "object",
          properties: {
            label: {
              type: "string",
            },
            thumbnail: {
              type: "string",
            },
            location: {
              type: "number",
            },
            aviability: {
              type: "object",
            },
          },
          required: ["label", "description", "location", "aviability"],
        },
        Specialist: {
          type: "object",
          properties: {
            prefix: {
              type: "string",
            },
            brief_description: {
              type: "string",
            },
            photo_link: {
              type: "number",
            },
            description: {
              type: "string",
            },
            links: {
              type: "array",
              items: {
                type: "string",
              },
            },
            budget_range: {
              type: "array",
              items: {
                type: "number",
              },
            },
            schedule: {
              type: "string",
            },
            location: {
              type: "string",
            },
            languages: {
              type: "array",
              items: {
                type: "string",
              },
            },
            speciality: {
              type: "array",
              items: {
                type: "string",
              },
            },
            subspecialities: {
              type: "array",
              items: {
                type: "string",
              },
            },
            experience: {
              type: "number",
            },
            specialist_id: {
              type: "array",
              items: {
                type: "string",
              },
            },
            category: {
              type: "string",
            },
            user: {
              type: "string",
            },
          },
          required: [
            "prefix",
            "brief_description",
            "photo_link",
            "description",
            "budget_range",
            "location",
            "speciality",
            "experience",
            "specialist_id",
          ],
        },
        User: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            lastname: {
              type: "string",
            },
            email: {
              type: "string",
            },
            gender: {
              type: "string",
            },
            preferred_language: {
              type: "string",
            },
            preferred_location: {
              type: "string",
            },
            notificationToken: {
              type: "string",
            },
            login_type: {
              type: "string",
            },
            auth_id: {
              type: "string",
            },
          },
          required: [
            "name",
            "lastname",
            "email",
            "gender",
            "login_type",
            "auth_id",
          ],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
