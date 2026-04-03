import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common'
import { UserService } from '~/user/user.service'
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import type { Response } from 'express'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Query successful' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Res() res: Response, @Param('id') id: string) {
    const user = await this.userService.findById(Number(id))

    if (!user) res.status(HttpStatus.NOT_FOUND).send('User not found')

    res.status(HttpStatus.OK).send(user)
  }
}
