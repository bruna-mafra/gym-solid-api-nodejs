import { Gym } from "@prisma/client"
import { GymsRepository } from "@/repositories/gyms-repository"

interface SearchGymsUseCaseRequest {
    query: string  // ou search (busca), mais generico p/ poder buscar por outras coisas
    page: number
}

interface SearchGymsUseCaseResponse {
    gyms: Gym[]
}

export class SearchGymsUseCase {
    constructor(private gymsRepository: GymsRepository) { }

    // a funcao recebe um "objeto" do tipo da interface que criamos, que contem o nome, email e password
    async execute({
        query,
        page,
    }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {

        // Chamando a funcao create desse repositorio e passando os dados (data) a serem cadastrados
        const gyms = await this.gymsRepository.searchMany(query, page)

        return {
            gyms,
        }
    }
}


