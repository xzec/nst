import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common'
import { UserService } from '~/user/user.service'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { ErrorCode, type ErrorResponse } from '~/common/error'
import { ApiResponseInterceptor } from '~/common/interceptors/api-response.interceptor'
import { HttpExceptionFilter } from '~/common/filters/http-exception.filter'
import {
  type UserInsert,
  UserInsertValidationPipe,
  type UserUpdate,
  UserUpdateValidationPipe,
} from '~/user/user.schema'
import { match } from 'oxide.ts'
import { UserNotFoundError } from '~/user/user.error'
import { ParseIntIdPipe } from '~/common/pipes/parse-int-id.pipe'

@Controller('users')
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Query successful' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(
    @Param('id', ParseIntIdPipe)
    id: number
  ) {
    const result = await this.userService.findById(id)
    return match(result, {
      Ok: (user) => user,
      Err: (error) => {
        if (error instanceof UserNotFoundError)
          throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: 'User not found' })
        throw error
      },
    })
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  async createUser(@Body(UserInsertValidationPipe) createUser: UserInsert) {
    try {
      return await this.userService.create(createUser)
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ code: ErrorCode.BAD_REQUEST, message: error.message })
      }
      throw error
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  async updateUser(@Param('id', ParseIntIdPipe) id: number, @Body(UserUpdateValidationPipe) updateUser: UserUpdate) {
    try {
      return await this.userService.update(id, updateUser)
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ code: ErrorCode.BAD_REQUEST, message: error.message } satisfies ErrorResponse)
      }
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  async deleteUser(@Param('id', ParseIntIdPipe) id: number) {
    try {
      return await this.userService.delete(id)
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ code: ErrorCode.BAD_REQUEST, message: error.message } satisfies ErrorResponse)
      }
      throw error
    }
  }
}
