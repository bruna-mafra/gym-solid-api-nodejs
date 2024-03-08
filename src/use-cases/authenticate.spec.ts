import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { hash } from "bcryptjs"
import { expect, describe, it, beforeEach } from "vitest"
import { AuthenticateUseCase } from "./authenticate"
import { InvalidCredentialsError } from "./errors/invalid-credentials"

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })
    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: await hash('123456', 6),
        })
        const { user } = await sut.execute({
            email: 'john@example.com',
            password: '123456',
        })
        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        await expect(() => sut.execute({
            email: 'joh@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(InvalidCredentialsError)

    })

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: await hash('123456', 6),
        })
        await expect(() => sut.execute({
            email: 'john@example.com',
            password: '123450',
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})