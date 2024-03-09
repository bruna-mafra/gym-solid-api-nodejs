import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
         gymsRepository = new InMemoryGymsRepository()
         sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create a gym', async () => {

        const { gym } = await sut.execute({
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -20.7593968,
            longitude: -46.7551849,
        })

        await expect(gym.id).toEqual(expect.any(String))
    })

})


