import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })

    afterEach(() => {
    })

    it('should be able to search for gyms', async () => {

        await gymsRepository.create({
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -20.7593968,
            longitude: -46.7551849,
        })

        await gymsRepository.create({
            title: 'NodeJs Gym',
            description: null,
            phone: null,
            latitude: -20.7593968,
            longitude: -46.7551849,
        })

        const { gyms } = await sut.execute({
            query: 'Node',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'NodeJs Gym' }),
        ])
    })

    it.skip('should be able to fetch paginated gym search', async () => {

        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `NodeJs Gym ${i}`,
                description: null,
                phone: null,
                latitude: -20.7593968,
                longitude: -46.7551849,
            })

        }

        const { gyms } = await sut.execute({
            query: 'Node',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'NodeJs Gym 21' }),
            expect.objectContaining({ title: 'NodeJs Gym 22' }),
        ])
    })
})