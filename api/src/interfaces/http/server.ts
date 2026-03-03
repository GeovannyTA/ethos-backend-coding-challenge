import { Elysia } from "elysia";
import { userRouter } from "./routes/userRoutes";
import { PostgresUserRepository } from "../../infrastructure/database/PostgresUserRepository";
import { authRouter } from "./routes/authRoutes";
import { rateLimiter } from "./middleware/rateLimiter";
import { projectRouter } from "./routes/projectRoutes";
import { PostgresProjectRepository } from "../../infrastructure/database/PostgresProjectRepository";
import { AppError } from "../../domain/errors/AppError";

export class Server {
  private app: Elysia;

  constructor() {
    this.app = new Elysia();
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares() {
    // Manejador global: status personalizados según tipo de error
    this.app.onError(({ error, set }) => {
      if (error instanceof AppError) {
        set.status = error.status;
        const errorKey = error.status === 401 ? "Unauthorized" : error.status === 404 ? "Not Found" : error.status === 409 ? "Conflict" : "Error";
        return { error: errorKey, message: error.message };
      }
      // Fallback para errores no controlados
      set.status = 500;
      return { error: "Internal Server Error", message: "An unexpected error occurred" };
    });
    // Rate limiter de 5 peticiones por 60 segundos
    this.app.use(rateLimiter(100, 60_000));
  }

  private registerRoutes() {
    const userRepository = new PostgresUserRepository();
    const projectRepository = new PostgresProjectRepository();

    this.app.group("/api/v1", (app) =>
      app
        .use(userRouter({ userRepository }))
        .use(authRouter({ userRepository }))
        .use(projectRouter({ projectRepository }))
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
