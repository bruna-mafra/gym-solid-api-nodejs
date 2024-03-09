import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-01',
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -20.7593968,
            longitude: -46.7551849,
        })


        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -20.7593968,
            userLongitude: -46.7551849,

        })

        console.log(checkIn.created_at)

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice on the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        // red, green, refactor

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -20.7593968,
            userLongitude: -46.7551849,
        })

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -20.7593968,
            userLongitude: -46.7551849,
        })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)

    })


    it('should be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        // red, green, refactor

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -20.7593968,
            userLongitude: -46.7551849,
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -20.7593968,
            userLongitude: -46.7551849,
        })

        expect(checkIn.id).toEqual(expect.any(String))

    })

    it('should not be able to check in on distant gym', async () => {
        //-20.7174669,-46.6101811
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'TypeScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-20.7174669),
            longitude: new Decimal(-46.6101811),
        })

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -12.1183054,
            userLongitude: -42.3109322,

        })).rejects.toBeInstanceOf(MaxDistanceError)

    })
})