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

  public async editAttendance(employee: string, date: string, data: Attendance) {
    const change = await attendance.findOneAndUpdateOne({ date, employee }, data);
    return await change;
  }

  public async postInTimeAttendance(employee: any, data: any): Promise<any> {
    try {
      data.employee = employee;
      const registerAttendance = new attendance(data);
      const saveData = await registerAttendance.save();
      return saveData;
    } catch (error) {
      return error;
    }
  }

  public async postOutTimeAttendance(employee: any, data: any): Promise<any> {
    const todaysDate = moment().format("YYYY-MM-DD");
    const updateAttendance = await attendance.findOneAndUpdateOne({ employee, date: todaysDate }, data);
    return await updateAttendance;
  }

  public async getAttendanceOfAEmployee(id: any): Promise<any> {
    const data = await attendance.find({ employee: id });
    return await data;
  }

  public async getAttendanceByDate(data: string = "02/09/2001") {
    const date = new Date(data).toISOString();
    const result = await attendance.find({ date: date });
    return await result;
  }

  public async getAttendanceByFromDateAndToDate(fromString: string = "02/09/2001", toString: string = "02/09/2001") {
    const from = new Date(fromString).toISOString();
    const to = new Date(toString).toISOString();
    const result = await attendance.find({ date: { $gte: from, $lte: to } });
    return result;
  }
}
export { AttendanceService };
