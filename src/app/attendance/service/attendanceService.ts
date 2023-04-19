import { HttpStatus, injectable } from "@leapjs/common";
import { Attendance, AttendanceModel as attendance } from "../model/attendance";
import { ResponseMessage, ResponseReturnType } from "./../../../common/response/response.types";
import moment from "moment";

@injectable()
class AttendanceService {
  public async getAttendanceOfAEmployeeByFromAndToDate(employee: string, from: string, to: string): Promise<ResponseReturnType> {
    from = moment(from).format("YYYY-MM-DD");

    const result = await attendance.find({ employee, date: { $gte: from, $lte: to } });
    if (!result || !result[0]) {
      return {
        code: HttpStatus.EXPECTATION_FAILED,
        data: null,
        error: "Data cannot be found",
        message: ResponseMessage.Success,
        status: true
      } as ResponseReturnType;
    }

    return {
      code: HttpStatus.FOUND,
      data: result,
      error: null,
      message: ResponseMessage.Success,
      status: true
    } as ResponseReturnType;
  }

  public async editAttendance(employee: string, date: string, data: Attendance): Promise<ResponseReturnType> {
    try {
      const change = await attendance.findOneAndUpdateOne({ date, employee }, data);
      return {
        code: HttpStatus.ACCEPTED,
        data: change,
        error: null,
        message: "Successfully modified",
        status: true
      } as ResponseReturnType;
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        data: null,
        error: error,
        message: "Unable to modify the document ",
        status: false
      } as ResponseReturnType;
    }
  }

  public async postInTimeAttendance(employee: any, data: any): Promise<ResponseReturnType> {
    try {
      data.employee = employee;
      const registerAttendance = new attendance(data);
      const saveData = await registerAttendance.save();
      return {
        code: HttpStatus.CREATED,
        data: saveData,
        error: null,
        message: "Successfully added in time of the user ",
        status: true
      } as ResponseReturnType;
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        data: null,
        error: error,
        message: "Unable to save the document ",
        status: false
      } as ResponseReturnType;
    }
  }

  public async postOutTimeAttendance(employee: any, data: Attendance): Promise<ResponseReturnType> {
    try {
      const todaysDate = moment().format("YYYY-MM-DD");
      const updateAttendance = await attendance.findOneAndUpdate({ employee, date: todaysDate }, data);
      return {
        code: HttpStatus.CREATED,
        data: updateAttendance,
        error: null,
        message: "Successfully added employees " + employee + " out time",
        status: true
      } as ResponseReturnType;
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        data: null,
        error: error,
        message: "Unable to add out time of the employee " + employee,
        status: false
      } as ResponseReturnType;
    }
  }

  public async getAttendanceOfAEmployee(id: any): Promise<ResponseReturnType> {
    try {
      const data = await attendance.find({ employee: id });

      return {
        code: HttpStatus.FOUND,
        data: data,
        error: null,
        message: "Success",
        status: true
      } as ResponseReturnType;
    } catch (error) {
      return {
        code: HttpStatus.NOT_FOUND,
        data: null,
        error: error,
        message: "Error occurred",
        status: true
      } as ResponseReturnType;
    }
  }

  public async getAttendanceByDate(data: string = "2001-01-01"): Promise<ResponseReturnType> {
    const date = new Date(data).toISOString();
    const result = await attendance.find({ date: date });
    return {
      code: HttpStatus.FOUND,
      data: result,
      error: null,
      message: "Success",
      status: true
    } as ResponseReturnType;
  }

  public async getAttendanceByFromDateAndToDate(fromString: string = "2001-01-01", toString: string = "2001-01-01"): Promise<ResponseReturnType> {
    const from = new Date(fromString).toISOString();
    const to = new Date(toString).toISOString();
    const result = await attendance.find({ date: { $gte: from, $lte: to } });
    return {
      code: HttpStatus.FOUND,
      data: result,
      error: null,
      message: "Success",
      status: true
    } as ResponseReturnType;
  }
}
export { AttendanceService };
