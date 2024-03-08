import { UsersRepository } from "@/repositories/users-repository";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
    id: string
}

interface GetUserProfileUseCaseResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor(
        private usersRepository: UsersRepository,
    ) { }

    async execute({ id }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        // 1o passo: buscar o usuario no db pelo email
        const user = await this.usersRepository.findById(id)
        // se existir, 
        if (!user) {
            throw new ResourceNotFoundError()
        }

        return {
            user,
        }
    }
}
