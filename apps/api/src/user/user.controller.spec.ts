import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from '~/user/user.controller'
import { UserService } from '~/user/user.service'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { Err, Ok } from 'oxide.ts'
import { UserEmailExistsError, UserNotFoundError } from '~/user/user.error'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { ErrorCode } from '~/common/error'

const fakeUser = {
  id: 1,
  name: 'John Smith',
  email: 'john@smith.com',
}
const fakeUserUpsert = {
  name: 'John Smith',
  email: 'john@smith.com',
}
const expectedUserNotFoundError = {
  response: { code: ErrorCode.USER_NOT_FOUND, message: 'User not found' },
}
const expectedUserEmailExistsError = {
  response: { code: ErrorCode.EMAIL_EXISTS, message: 'E-mail address is already in use' },
}

describe('UserController', () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findById: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
          },
        },
      ],
    }).compile()

    userService = moduleRef.get<UserService>(UserService)
    userController = moduleRef.get<UserController>(UserController)
  })

  describe('getUser', () => {
    it('calls userService.findById with the given id', async () => {
      vi.mocked(userService.findById).mockResolvedValue(Ok(fakeUser))
      await userController.getUser(fakeUser.id)
      expect(userService.findById).toHaveBeenCalledWith(fakeUser.id)
    })

    it('returns the user', async () => {
      vi.mocked(userService.findById).mockResolvedValue(Ok(fakeUser))
      expect(await userController.getUser(fakeUser.id)).toBe(fakeUser)
    })

    it('throws NotFoundException with appropriate contents when user is not found', async () => {
      vi.mocked(userService.findById).mockResolvedValue(Err(new UserNotFoundError()))
      const promise = userController.getUser(fakeUser.id)
      await expect(promise).rejects.toBeInstanceOf(NotFoundException)
      await expect(promise).rejects.toMatchObject(expectedUserNotFoundError)
    })

    it('rethrows uncaught errors unchanged', async () => {
      vi.mocked(userService.findById).mockThrow(new Error('Mocked error'))
      await expect(userController.getUser(fakeUser.id)).rejects.toThrow('Mocked error')
    })
  })

  describe('createUser', () => {
    it('calls userService.create with the given user', async () => {
      vi.mocked(userService.create).mockResolvedValue(Ok(fakeUser))
      await userController.createUser(fakeUserUpsert)
      expect(userService.create).toHaveBeenCalledWith(fakeUserUpsert)
    })

    it('returns the created user', async () => {
      vi.mocked(userService.create).mockResolvedValue(Ok(fakeUser))
      expect(await userController.createUser(fakeUserUpsert)).toBe(fakeUser)
    })

    it('throws ConflictException with appropriate contents when user e-mail already exists', async () => {
      vi.mocked(userService.create).mockResolvedValue(Err(new UserEmailExistsError()))
      const promise = userController.createUser(fakeUserUpsert)
      await expect(promise).rejects.toBeInstanceOf(ConflictException)
      await expect(promise).rejects.toMatchObject(expectedUserEmailExistsError)
    })

    it('rethrows uncaught errors unchanged', async () => {
      vi.mocked(userService.create).mockThrow(new Error('Mocked error'))
      await expect(userController.createUser(fakeUserUpsert)).rejects.toThrow('Mocked error')
    })
  })

  describe('updateUser', () => {
    it('calls userService.update with the given data', async () => {
      vi.mocked(userService.update).mockResolvedValue(Ok(fakeUser))
      await userController.updateUser(fakeUser.id, fakeUserUpsert)
      expect(userService.update).toHaveBeenCalledWith(fakeUser.id, fakeUserUpsert)
    })

    it('returns the updated user', async () => {
      vi.mocked(userService.update).mockResolvedValue(Ok(fakeUser))
      expect(await userController.updateUser(fakeUser.id, fakeUserUpsert)).toBe(fakeUser)
    })

    it('throws NotFoundException with appropriate contents when user is not found', async () => {
      vi.mocked(userService.update).mockResolvedValue(Err(new UserNotFoundError()))
      const promise = userController.updateUser(fakeUser.id, fakeUserUpsert)
      await expect(promise).rejects.toBeInstanceOf(NotFoundException)
      await expect(promise).rejects.toMatchObject(expectedUserNotFoundError)
    })

    it('throws ConflictException with appropriate contents when user e-mail already exists', async () => {
      vi.mocked(userService.update).mockResolvedValue(Err(new UserEmailExistsError()))
      const promise = userController.updateUser(fakeUser.id, fakeUserUpsert)
      await expect(promise).rejects.toBeInstanceOf(ConflictException)
      await expect(promise).rejects.toMatchObject(expectedUserEmailExistsError)
    })

    it('rethrows uncaught errors unchanged', async () => {
      vi.mocked(userService.update).mockThrow(new Error('Mocked error'))
      await expect(userController.updateUser(fakeUser.id, fakeUserUpsert)).rejects.toThrow('Mocked error')
    })
  })

  describe('deleteUser', () => {
    it('calls userService.delete with the given id', async () => {
      vi.mocked(userService.delete).mockResolvedValue(Ok(fakeUser))
      await userController.deleteUser(fakeUser.id)
      expect(userService.delete).toHaveBeenCalledWith(fakeUser.id)
    })

    it('returns the deleted user', async () => {
      vi.mocked(userService.delete).mockResolvedValue(Ok(fakeUser))
      expect(await userController.deleteUser(fakeUser.id)).toBe(fakeUser)
    })

    it('throws NotFoundException with appropriate contents when user is not found', async () => {
      vi.mocked(userService.delete).mockResolvedValue(Err(new UserNotFoundError()))
      const promise = userController.deleteUser(fakeUser.id)
      await expect(promise).rejects.toBeInstanceOf(NotFoundException)
      await expect(promise).rejects.toMatchObject(expectedUserNotFoundError)
    })

    it('rethrows uncaught errors unchanged', async () => {
      vi.mocked(userService.delete).mockThrow(new Error('Mocked error'))
      await expect(userController.deleteUser(fakeUser.id)).rejects.toThrow('Mocked error')
    })
  })
})
