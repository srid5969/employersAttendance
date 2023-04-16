import { injectable } from "@leapjs/common";
import { Attendance, AttendanceModel as attendance } from "../model/attendance";

@injectable()
class AttendanceService {
  public async postInTimeAttendance(employee: any, data: any): Promise<any> {
    data.employee = employee;
    const registerAttendance = new attendance(data);
    const saveData = (await registerAttendance.save()) as Attendance;
    return saveData;
  }
  public async postOutTimeAttendance(employee: any, data: any): Promise<any> {
    const updateAttendance = await attendance.updateOne({ employee }, { data });
    return updateAttendance;
  }
  public async getAttendanceOfAEmployee(id: any): Promise<any> {
    const data = await attendance.find({ employee: id });
    return await data;
  }
  public async getAttendanceByDate(data: string = "02/09/2001") {
    const date = new Date(data);
    const result = await attendance.find({ date: date });
    return result;
  }
  public async getAttendanceByFromDateAndToDate(fromString: string = "02/09/2001", toString: string = "02/09/2001") {
    const from = new Date(fromString);
    const to = new Date(toString);
    const result = await attendance.find({ date: { $gte: { from }, $lte: { to } } });
    return result;
  }
}
export { AttendanceService };
