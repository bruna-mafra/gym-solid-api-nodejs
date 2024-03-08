import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {

    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        })
        return user
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })
        return user
    }

    async create(data: Prisma.UserCreateInput) {
        // Cadastra no banco de dados as informacoes passadas na chamada da funcao
        const user = await prisma.user.create({
            data,
        })

        return user  // O retorno serve caso voce queira trabalhar com o usuario recem criado
    }
}