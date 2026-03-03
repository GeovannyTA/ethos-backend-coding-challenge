import { Elysia } from "elysia";
import { userRouter } from "./routes/userRoutes";
import { PostgresUserRepository } from "../../infrastructure/database/PostgresUserRepository";
import { authRouter } from "./routes/authRoutes";
import { rateLimiter } from "./middleware/rateLimiter";

export class Server {
  private app: Elysia;

  constructor() {
    this.app = new Elysia();
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares() {
    // Rate limiter de 5 peticiones por 60 segundos
    this.app.use(rateLimiter(100, 60_000));
  }

  private registerRoutes() {
    const userRepository = new PostgresUserRepository();

    this.app.group("/api/v1", (app) =>
      app
        .use(userRouter({ userRepository }))
        .use(authRouter({ userRepository })),
    );
  }

  public start() {
    this.app.listen({
      port: 3000,
      hostname: "0.0.0.0",
    });
    console.log("Server running on port 3000");
  }
}
