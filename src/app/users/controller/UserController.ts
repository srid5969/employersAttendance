import { Request, Response } from 'express';
import { UserService } from '../service/user';
import { Body, Controller, Post, Req, Res, UseBefore } from '@leapjs/router';
import { HttpStatus, inject } from '@leapjs/common';
import { User } from '../model/User';
import validate from '../../../common/middleware/validator';

@Controller('/user')
export class UserController {
  @inject(() => UserService) userService!: UserService;

  @Post('/login')
  public async login(@Body() req: any, @Res() res: Response): Promise<Response> {
    return res.send(await this.userService.login(req.phone, req.password));
  }

  @Post('/signup')
  @UseBefore(validate(User, ['create']))
  public async signUp(@Req() req: Request, @Res() res: Response): Promise<Response> {
    return new Promise<Response>(resolve => {
      const data: User = req.body;
      return this.userService
        .userSignUp(data)
        .then(result => {
          return resolve(res.status(HttpStatus.OK).send(result));
        })
        .catch(err => {
          return resolve(res.status(HttpStatus.NOT_ACCEPTABLE).json(err));
        });
    });
  }
}
