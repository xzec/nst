import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common'
import {
  type UserInsert,
  UserInsertValidationPipe,
  UserService,
  type UserUpdate,
  UserUpdateValidationPipe,
} from '~/user/user.service'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { ErrorCode } from '~/common/error'
import { ApiResponseInterceptor } from '~/common/response/api-response.interceptor'
import { HttpExceptionFilter } from '~/common/response/http-exception.filter'

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
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id)
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
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body(UserUpdateValidationPipe) updateUser: UserUpdate) {
    try {
      return await this.userService.update(id, updateUser)
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ code: ErrorCode.BAD_REQUEST, message: error.message })
      }
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.userService.delete(id)
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ code: ErrorCode.BAD_REQUEST, message: error.message })
      }
      throw error
    }
  }
}
