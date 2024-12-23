import { createMiddleware } from "@mswjs/http-middleware"; // Giả lập API requests
import cors from "cors"; // CORS middleware
import express from "express"; // Express framework
import logger from "pino-http"; // Ghi nhật ký (logging)

import { initializeDb } from "./src/testing/mocks/db";
import { handlers } from "./src/testing/mocks/handlers";

const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(
  logger({
    level: "info",
    redact: ["req.headers", "res.headers"],
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: true,
      },
    },
  }),
);
app.use(createMiddleware(...handlers));

initializeDb().then(() => {
  console.log("Mock DB initialized");
  app.listen(process.env.NEXT_PUBLIC_MOCK_API_PORT, () => {
    console.log(`Mock API server started at http://localhost:${process.env.NEXT_PUBLIC_MOCK_API_PORT}`);
  });
});
