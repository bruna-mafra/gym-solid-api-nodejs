import { Prisma, CheckIn } from "@prisma/client"

export interface CheckInsRepository {
    findById(id: string): Promise<CheckIn | null>
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>  // retorna lista. ps. este "ChekIn" é do model do schmea do prisma
    countByUserId(userId: string): Promise<number>
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    save(checkIn: CheckIn): Promise<CheckIn>
}