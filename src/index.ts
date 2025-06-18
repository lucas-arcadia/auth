// /src/index.ts

import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authController } from "./controllers/auth.controller";
import { companyController } from "./controllers/company.controller";
import { roleController } from "./controllers/role.controller";
import { userController } from "./controllers/user.controller";
import { authPlugin } from "./plugins/authPlugin";

const app = new Elysia();

app.use(
  swagger({
    provider: "scalar",
    documentation: {
      info: {
        title: "CSI Auth API",
        version: "1.0.0",
        description: "API de autenticação e autorização usando LDAP",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  })
);

app.use(cors());
app.use(authController);
app.use(companyController);
app.use(roleController);
app.use(userController);

app.onError(({ error, code, set }) => {
  let errorMessage = "";

  switch (code) {
    case "NOT_FOUND":
      errorMessage = "Path not Found";
      break;
    case "VALIDATION":
      errorMessage = "Validation Error";
      break;
    case "PARSE":
      errorMessage = "Parse Error";
      break;
    case "INVALID_COOKIE_SIGNATURE":
      errorMessage = "Invalid Cookie Signature";
      break;
    case "INTERNAL_SERVER_ERROR":
      errorMessage = "Internal Server Error";
      break;
    case "INVALID_FILE_TYPE":
      errorMessage = "Invalid File Type";
      break;
    case "UNKNOWN":
      errorMessage = "Unknown Error";
      break;
    default:
      errorMessage = "Default Error";
      set.status = 500;
  }
  return {
    success: false,
    error: errorMessage,
  };
});

app.listen(3000);

console.log(`🦊 Serviço CSI Auth API rodando em ${app.server?.hostname}:${app.server?.port}`);
