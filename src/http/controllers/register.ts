import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case"

export async function register(request: FastifyRequest, reply: FastifyReply) {

    // Validando os dados que chegam pelo corpo da request
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    // Colocando esses dados em variaveis: name, email, password
    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const registerUseCase = makeRegisterUseCase()

        // Chama a funcao registerUseCase do register.ts da pasta use-cases
        await registerUseCase.execute({
            name,
            email,
            password,
        })
    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: err.message })
        }
        throw err
    }

    return reply.status(201).send()
}