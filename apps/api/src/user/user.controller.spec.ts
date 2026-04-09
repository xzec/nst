import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from '~/user/user.controller'
import { UserService } from '~/user/user.service'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { Err, Ok } from 'oxide.ts'
import { UserNotFoundError } from '~/user/user.error'
import { NotFoundException } from '@nestjs/common'
import { ErrorCode } from '~/common/error'

const fakeUser = {
  id: 1,
  name: 'John Smith',
  email: 'john@smith.com',
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
      await expect(promise).rejects.toMatchObject({
        response: { code: ErrorCode.USER_NOT_FOUND, message: 'User not found' },
      })
    })

    it('rethrows uncaught errors unchanged', async () => {
      vi.mocked(userService.findById).mockThrow(new Error('Unexpected error'))
      await expect(userController.getUser(fakeUser.id)).rejects.toThrow('Unexpected error')
    })
  })
})
