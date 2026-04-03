import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common'
import {
  type UserInsert,
  UserInsertValidationPipe,
  UserService,
  type UserUpdate,
  UserUpdateValidationPipe,
} from '~/user/user.service'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { ErrorCode } from '~/config/error'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Query successful' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id)
    if (!user) throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: `User ${id} not found` })
    return user
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @UsePipes(UserInsertValidationPipe)
  async createUser(@Body() createUser: UserInsert) {
    console.log(createUser)
    try {
      const user = await this.userService.create(createUser)
      return user
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
  @UsePipes(UserUpdateValidationPipe)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUser: UserUpdate) {
    try {
      const user = await this.userService.update(id, updateUser)
      return user
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ code: ErrorCode.BAD_REQUEST, message: error.message })
      }
      throw error
    }
  }
}
