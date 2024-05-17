import { app } from "./app";
import { env } from "./validations/env.validation";

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server Running!");
  });