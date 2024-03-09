import { Gym } from "@prisma/client"
import { GymsRepository } from "@/repositories/gyms-repository"

interface FetchNearByGymsUseCaseRequest {
    userLatitude: number
    userLongitude: number
}

interface FetchNearByGymsUseCaseResponse {
    gyms: Gym[]
}

export class FetchNearByGymsUseCase {
    constructor(private gymsRepository: GymsRepository) { }

    // a funcao recebe um "objeto" do tipo da interface que criamos, que contem o nome, email e password
    async execute({
        userLatitude,
        userLongitude
    }: FetchNearByGymsUseCaseRequest): Promise<FetchNearByGymsUseCaseResponse> {

        // Chamando a funcao create desse repositorio e passando os dados (data) a serem cadastrados
        const gyms = await this.gymsRepository.findManyNearBy({
            latitude: userLatitude,
            longitude: userLongitude
        })

        return {
            gyms,
        }
    }
}


