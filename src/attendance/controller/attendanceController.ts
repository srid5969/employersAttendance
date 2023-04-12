import { inject } from "@leapjs/common";
import { Body, Controller, Get, Param, Patch, Post, Req, Res } from "@leapjs/router";
import { Response } from "express";
import { AttendanceService } from "../service/attendanceService";

@Controller("/attendance")
export class AttendanceController {
@inject(AttendanceService)
private readonly attendanceService!:AttendanceService

  @Get("/employee/:id")
  public async getAttendanceOfAEmployee(  @Param("id") id:any,@Res() res: Response): Promise<Response> {
    return this.attendanceService.getAttendanceOfAEmployee(id)
  }

  @Post("/")
  public async inTimeAttendance(@Body() req: any, @Res() res: Response): Promise<Response> {
      let data=req
      return res.send(data)

  }

  @Post("/")
  public async outTimeAttendance(@Body() req: Request, @Res() res: Response): Promise<Response> {

      return res.send("")

  }

  @Get("/users")
  public async getAllAttendance(@Req() req: Request, @Res() res: Response): Promise<Response> {

      return res.send("")

  }

  @Patch("/")
  public async editAttendance(@Req() req: Request, @Res() res: Response): Promise<Response> {

      return res.send("")

  }
}
