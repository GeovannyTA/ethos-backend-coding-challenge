import { Elysia } from "elysia";
import { userRouter } from "./routes/userRoutes";
import { PostgresUserRepository } from "../../infrastructure/database/PostgresUserRepository";

export class Server {
  private app: Elysia;

  constructor() {
    this.app = new Elysia();

    // this.registerMiddlewares();
    this.registerRoutes();
  }

//   private registerMiddlewares() {
//     this.app.use(rateLimiter(100, 60_000)); // 100 requests por minuto
//   }

  private registerRoutes() {
    const userRepository = new PostgresUserRepository();

    this.app.group("/api/v1", app =>
      app.use(
        userRouter({ userRepository })
      )
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