import { injectable } from "@leapjs/common";
import { Attendance, AttendanceModel } from "../model/attendance";

@injectable()
class AttendanceService {
  public async postInTimeAttendance(employee: any, data: any): Promise<any> {
    const registerAttendance: typeof AttendanceModel = new AttendanceModel({
      employee,
      date: data.date,
      inTime: data.inTime,
    });
    const saveData = await registerAttendance.save();
    return saveData;
  }
  public async getAttendanceOfAEmployee(id: any):Promise<any> {
    const data = await AttendanceModel.find({ user: id });
    return await data;
  }
  
}
export { AttendanceService };
