import { Redis } from "ioredis";

const client = new Redis({
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
});

export default client;
