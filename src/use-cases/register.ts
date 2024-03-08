import { prisma } from "@/lib/prisma"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { User } from "@prisma/client"

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) { }

    // a funcao recebe um "objeto" do tipo da interface que criamos, que contem o nome, email e password
    async execute({
        name,
        email,
        password,
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {

        // Criando o hash da senha
        const password_hash = await hash(password, 6)

        // Verificando se há no DB um email igual ja cadastrado
        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        // Dispara um erro se o email ja existir
        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        // Se o email nao existir, vamos instanciar o repositorio do prisma. No repositorio do prisma, há funcoes como, por exemplo, a de cadastro

        // Chamando a funcao create desse repositorio e passando os dados (data) a serem cadastrados
        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        })

        return {
            user,
        }
    }
}


