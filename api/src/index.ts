import 'dotenv/config';
import { Server } from "./interfaces/http/server";

const server = new Server();
server.start();
