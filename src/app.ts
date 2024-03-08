import fastify from "fastify";
import { ZodError } from "zod";
import { prisma } from "./lib/prisma";
import { register } from "./http/controllers/register";
import { appRoutes } from "./http/routes";
import { env } from "./env";

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error.', issues: error.format() })
    }
    if (env.NODE_ENV != 'production') {
        console.error(error)
    } else {
        // aqui deveriamos fazer um log para uma ferramenta de observabilidade externa como DataDog/NewRelic/Sentry
    }
    return reply
        .status(500)
        .send({ message: 'Internal server error.' })
})