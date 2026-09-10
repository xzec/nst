import {
  Body,
  ConflictException,
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
import { ErrorCode } from '~/common/error'
import { ApiResponseInterceptor } from '~/common/interceptors/api-response.interceptor'
import { HttpExceptionFilter } from '~/common/filters/http-exception.filter'
import { type UserUpdate, UserUpdateValidationPipe } from '~/user/user.schema'
import { match } from 'oxide.ts'
import { UserEmailExistsError, UserNotFoundError } from '~/user/user.error'
import { ParseUuidIdPipe } from '~/common/pipes/parse-uuid-id.pipe'
import { CreateUserDto, CreateUserValidationPipe } from '~/user/dto/create-user.dto'
import { UserResponseDto } from '~/user/dto/user.response.dto'

@Controller('users')
@UseInterceptors(ApiResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Query successful' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(
    @Param('id', ParseUuidIdPipe)
    id: string
  ) {
    const result = await this.userService.findById(id)
    return match(result, {
      Ok: (user) => UserResponseDto.fromEntity(user),
      Err: (error) => {
        if (error instanceof UserNotFoundError)
          throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: error.message })
        throw error
      },
    })
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 409, description: 'E-mail address already in use' })
  async createUser(@Body(CreateUserValidationPipe) dto: CreateUserDto) {
    const result = await this.userService.create(dto)
    return match(result, {
      Ok: (user) => UserResponseDto.fromEntity(user),
      Err: (error) => {
        if (error instanceof UserEmailExistsError)
          throw new ConflictException({ code: ErrorCode.EMAIL_EXISTS, message: error.message })
        throw error
      },
    })
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'E-mail address already in use' })
  async updateUser(@Param('id', ParseUuidIdPipe) id: string, @Body(UserUpdateValidationPipe) updateUser: UserUpdate) {
    const result = await this.userService.update(id, updateUser)
    return match(result, {
      Ok: (user) => UserResponseDto.fromEntity(user),
      Err: (error) => {
        if (error instanceof UserNotFoundError)
          throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: error.message })
        if (error instanceof UserEmailExistsError)
          throw new ConflictException({ code: ErrorCode.EMAIL_EXISTS, message: error.message })
        throw error
      },
    })
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id', ParseUuidIdPipe) id: string) {
    const result = await this.userService.delete(id)
    return match(result, {
      Ok: (user) => UserResponseDto.fromEntity(user),
      Err: (error) => {
        if (error instanceof UserNotFoundError)
          throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: error.message })
        throw error
      },
    })
  }
}
