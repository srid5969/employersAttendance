import { Request, Response } from "express";
import { UserService } from "../service/user";
import { Body, Controller, Get, Param, Post, Req, Res, UseBefore } from "@leapjs/router";
import { HttpStatus, inject } from "@leapjs/common";
import { User } from "../model/User";
import validate from "../../../common/middleware/validator";
import Authentication from "./../../../common/middleware/auth";

@Controller("/user")
export class UserController {
  @inject(() => UserService) userService!: UserService;

  @Post("/login")
  public async login(@Body() req: any, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.userService.login(req.phone, req.password);
      return data.status ? res.status(data.status).json(data) : res.status(HttpStatus.ACCEPTED).send(data);
    } catch (error: any) {
      return error.status ? res.status(error.status).json(error) : res.status(HttpStatus.CONFLICT).send(error);
    }
  }
  @Get("/get/:id")
  @UseBefore(Authentication)
  public async getUserById(@Param("id") id: string, @Res() res: Response): Promise<Response> {
    const result = await this.userService.getUserById(id);
    return res.send(result);
  }

  @Post("/signup")
  @UseBefore(validate(User, ["create"]))
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
