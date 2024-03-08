import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateUseCaseRequest {
    email: string
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(
        private usersRepository: UsersRepository,
    ) { }

    async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        // 1o passo: buscar o usuario no db pelo email
        const user = await this.usersRepository.findByEmail(email)
        // se existir, 
        if (!user) {
            throw new InvalidCredentialsError()
        }

        // 2o passo: comparar se o hash da senha bate
        // (Dica de Clean Code) Booleanos => escrever a variavel de forma que a leitura seja semantica
        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return {
            user,
        }
    }
}
