import { Gym } from "@prisma/client"
import { GymsRepository } from "@/repositories/gyms-repository"

interface CreateGymUseCaseRequest {
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number

}

interface CreateGymUseCaseResponse {
    gym: Gym
}

export class CreateGymUseCase {
    constructor(private gymsRepository: GymsRepository) { }

    // a funcao recebe um "objeto" do tipo da interface que criamos, que contem o nome, email e password
    async execute({
        title,
        description,
        phone,
        latitude,
        longitude
    }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {

        // Chamando a funcao create desse repositorio e passando os dados (data) a serem cadastrados
        const gym = await this.gymsRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude
        })

        return {
            gym,
        }
    }
}


