import { injectable } from "@leapjs/common";
import { Attendance, AttendanceModel as attendance } from "../model/attendance";

@injectable()
class AttendanceService {
  public async editAttendance(employee: string, dateString: string, data: Attendance) {
    const date = new Date(dateString);
    const change = await attendance.findOneAndUpdateOne({ date, employee }, data);
    return await change;
  }

  public async postInTimeAttendance(employee: any, data: any): Promise<any> {
    try {
      data.employee = employee;
      const registerAttendance = new attendance(data);
      const saveData = (await registerAttendance.save()) as Attendance;
      return saveData;
    } catch (error) {
      return error;
    }
  }

  public async postOutTimeAttendance(employee: any, data: any): Promise<any> {
    const updateAttendance = await attendance.findOneAndUpdateOne({ employee }, data);
    return updateAttendance;
  }

  public async getAttendanceOfAEmployee(id: any): Promise<any> {
    const data = await attendance.find({ employee: id });
    return await data;
  }

  public async getAttendanceByDate(data: string = "02/09/2001") {
    const date = new Date(data).toISOString();
    const result = await attendance.find({ date: date });
    return result;
  }

  public async getAttendanceByFromDateAndToDate(fromString: string = "02/09/2001", toString: string = "02/09/2001") {
    const from = new Date(fromString).toISOString();
    const to = new Date(toString).toISOString();
    const result = await attendance.find({ date: { $gte: from, $lte: to } });
    return result;
  }
}
export { AttendanceService };
