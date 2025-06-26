import fastify from "fastify";
import { db } from "./database";

const server = fastify();

server.get("/", () => {
  return "Hello World";
});

server.get("/hello", async () => {
  const test = await db('sqlite_schema').select("*");

  return test;
});

server.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server is running on ${address}`);
})