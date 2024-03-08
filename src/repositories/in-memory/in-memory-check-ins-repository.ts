import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { Prisma, CheckIn } from '@prisma/client'
import dayjs from 'dayjs'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []

    async findByUserIdOnDate(userId: string, date: Date) {

        const startOfTheDay = dayjs(date).startOf('date')

        const checkInOnSameDate = this.items.find(
            (checkIn) => checkIn.user_id === userId,
        )

        if (!checkInOnSameDate) {
            return null
        }

        return checkInOnSameDate

    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),
        }

        this.items.push(checkIn)

        return checkIn
    }
}