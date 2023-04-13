import { inject } from "@leapjs/common";
import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseBefore } from "@leapjs/router";
import validate from "common/middleware/validator";
import { Response } from "express";
import { Attendance } from "../model/attendance";
import { AttendanceService } from "../service/attendanceService";

@Controller("/attendance")
export class AttendanceController {
  @inject(AttendanceService)
  private readonly attendanceService!: AttendanceService

  @Get("/employee/:id")
  public async getAttendanceOfAEmployee(@Param("id") id: any, @Res() res: Response): Promise<Response> {
    return this.attendanceService.getAttendanceOfAEmployee(id)
  }

  @Post("/")
  @UseBefore(validate(Attendance, ["checkIn"]))
  public async checkInTimeAttendance(@Body() req: any, @Res() res: Response): Promise<Response> {
    let data = req
    return res.send(data)

  }

  @Post("/")
  public async checkOutTimeAttendance(@Body() req: Request, @Res() res: Response): Promise<Response> {

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
