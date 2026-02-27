import { Elysia } from "elysia";
import { userRouter } from "../user/userRouter.js";

export class Server {
    private app: Elysia;

    constructor() {
        this.app = new Elysia();
        this.app.group("/api/v1", app => app.use(userRouter))
    }

    public start() {
        this.app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }
}