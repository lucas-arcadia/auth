import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import compression from "elysia-compress";
// import { rateLimit } from "elysia-rate-limit"

// Companies
import AddCompanyController from "./controllers/company/AddCompanyController";
import GetCompanyController from "./controllers/company/GetCompanyController";
import ListCompanyController from "./controllers/company/ListCompanyController";
import UpdadeCompanyController from "./controllers/company/UpdateCompanyController";

// Contacts
import AddContactController from "./controllers/contact/AddContactController";
import GetContactController from "./controllers/contact/GetContactController";
import ListContactController from "./controllers/contact/ListContactController";
import UpdadeContactController from "./controllers/contact/UpdateContactController";

// Policies
import AddPoliceController from "./controllers/police/AddPoliceController";
import GetPoliceController from "./controllers/police/GetPoliceController";
import ListPoliceController from "./controllers/police/ListPoliceController";
import UpdatePoliceController from "./controllers/police/UpdatePoliceController";

// Rules
import AddRoleController from "./controllers/rule/AddRuleController";
import GetRoleController from "./controllers/rule/GetRuleController";
import ListRoleController from "./controllers/rule/ListRulesController";
import UpdadeRoleController from "./controllers/rule/UpdateRuleController";

// Services
import AddServiceController from "./controllers/service/AddServiceController";
import GetServiceController from "./controllers/service/GetServiceController";
import ListServiceController from "./controllers/service/ListServiceController";
import UpdadeServiceController from "./controllers/service/UpdateServiceController";

// Users
import AddUserController from "./controllers/user/AddUserController";
import GetUserController from "./controllers/user/GetUserController";
import ListUserController from "./controllers/user/ListUsersController";
import UpdateUserController from "./controllers/user/UpdateUserController";

import AboutMeController from "./controllers/user/AboutMeController";
import CheckPermissionController from "./controllers/user/CheckPermissionController";
import LoginController from "./controllers/user/LoginController";
import LogoutController from "./controllers/user/LogoutController";

const app = new Elysia();
app.use(
  swagger({
    provider: "scalar",
    scalarConfig: {
      showSidebar: true,
    },
    documentation: {
      info: {
        title: "API do serviço Empresa",
        description: "Endpoints da API do serviço Empresa.",
        version: "1.0.50",
      },
    },
  })
);
app.use(
  cors({
    allowedHeaders: ["Authorization"],
  })
);
app.use(compression());

// app.use(rateLimit())

// Companies
new AddCompanyController(app);
new GetCompanyController(app);
new ListCompanyController(app);
new UpdadeCompanyController(app);

// Contacts
new AddContactController(app);
new GetContactController(app);
new ListContactController(app);
new UpdadeContactController(app);

// Policies
new AddPoliceController(app);
new GetPoliceController(app);
new ListPoliceController(app);
new UpdatePoliceController(app);

// Rules
new AddRoleController(app);
new GetRoleController(app);
new ListRoleController(app);
new UpdadeRoleController(app);

// Services
new AddServiceController(app);
new GetServiceController(app);
new ListServiceController(app);
new UpdadeServiceController(app);

// Users
new AddUserController(app);
new GetUserController(app);
new ListUserController(app);
new UpdateUserController(app);

new AboutMeController(app);
new CheckPermissionController(app);
new LoginController(app);
new LogoutController(app);

app.listen(process.env.APP_PORT ?? 3000, (s) => {
  console.log(`User Service is running on ${s.hostname}:${s.port}`);
});
