import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearByGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearByGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearByGymsUseCase(gymsRepository)
    })

    afterEach(() => {
    })

    it('should be able to search for gyms', async () => {

        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -20.7593968,
            longitude: -46.7551849,
        })

        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -12.1183054,
            longitude: -42.3109322,
        })

        const { gyms } = await sut.execute({
            userLatitude: -20.7593968,
            userLongitude: -46.7551849,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ])
    })

})