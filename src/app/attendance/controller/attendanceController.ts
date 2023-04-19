import { HttpStatus, inject } from "@leapjs/common";
import { Body, Controller, Get, Param, Patch, Post, QueryParam, Req, Res, UseBefore } from "@leapjs/router";
import validate from "./../../../common/middleware/validator";
import { Response } from "express";
import { Attendance } from "../model/attendance";
import { AttendanceService } from "../service/attendanceService";
import Authentication from "./../../../common/middleware/auth";

@UseBefore(Authentication)
@Controller("/attendance")
export class AttendanceController {
  @inject(AttendanceService)
  private readonly attendanceService!: AttendanceService;

  @Get("/employee")
  public async getAttendanceOfAEmployeeByFromAndToDate(@QueryParam("id") id: string, @QueryParam("from") from: string, @QueryParam("to") to: string, @Res() res: Response):Promise<Response>  {
    try {
      const data = await this.attendanceService.getAttendanceOfAEmployeeByFromAndToDate(id, from, to);
      return data.status ? res.status(data.code).json(data) : res.status(HttpStatus.ACCEPTED).send(data);
    } catch (error: any) {
      return error.status ? res.status(error.code).json(error) : res.status(HttpStatus.CONFLICT).send(error);
    }
  }

  @Get("/employee/:id")
  public async getAttendanceOfAEmployee(@Param("id") id: any, @Res() res: Response): Promise<Response> {
    return res.send(await this.attendanceService.getAttendanceOfAEmployee(id));
  }

  @Post("/checkIn/:id")
  @UseBefore(validate(Attendance, ["checkIn"]))
  public async checkInTimeAttendance(@Param("id") id: any, @Body() req: any, @Res() res: Response): Promise<Response> {
    let data = await this.attendanceService.postInTimeAttendance(id, req);
    return res.send(data);
  }

  @Post("/checkOut/:id")
  @UseBefore(validate(Attendance, ["checkOut"]))
  public async checkOutTimeAttendance(@Param("id") id: any, @Body() req: any, @Res() res: Response): Promise<Response> {
    let data = await this.attendanceService.postOutTimeAttendance(req.employeeId, req);
    console.log(data);
    
    return res.send(data);
  }

  @Get("/all")
  public async getAllAttendance(@Req() req: Request, @Res() res: Response): Promise<Response> {
    return res.send("");
  }

  @Get("/date/:date")
  public async getAttendanceByDate(@Param("date") date: any, @Res() res: Response): Promise<Response> {
    const result = await this.attendanceService.getAttendanceByDate(date);
    return res.send(result);
  }

  @Get("/all/")
  public async getAttendanceByFromDateAndToDate(@QueryParam("from") from: any, @QueryParam("to") to: any, @Res() res: Response): Promise<Response> {
    const data = await this.attendanceService.getAttendanceByFromDateAndToDate(from, to);
    return res.send(data);
  }

  @Patch("/")
  public async editAttendance(@QueryParam("id") id: any, @QueryParam("date") date: any, @Body() req: any, @Res() res: Response): Promise<Response> {
    const data = await this.attendanceService.editAttendance(id, date, req);
    return res.send(data);
  }
}
