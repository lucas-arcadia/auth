import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import connectDB from "./config/db";
import setupRoutes from "./routers/index";

const app = new Elysia();

app.use(swagger());

await connectDB();
setupRoutes(app);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
