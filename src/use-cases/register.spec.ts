import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
         usersRepository = new InMemoryUsersRepository()
         sut = new RegisterUseCase(usersRepository)
    })

    it('should be able to register', async () => {

        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        })

        await expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {

        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
        })

        console.log(user.password_hash)

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash,
        )

        await expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email', async () => {

        const email = 'john@example.com'

        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

        await expect(() =>
            sut.execute({
                name: 'John Doe',
                email,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)

    })
})


