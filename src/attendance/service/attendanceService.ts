import { injectable } from "@leapjs/common";
import { Attendance, AttendanceModel } from "../model/attendance";

@injectable()
class AttendanceService {
    public async postInTimeAttendance(employee: any, data: any): Promise<any> {
        data.employee = employee;
        const registerAttendance = new AttendanceModel(data);
        const saveData = (await registerAttendance.save()) as Attendance;
        return saveData;
    }
    public async postOutTimeAttendance(employee: any, data: any): Promise<any> {
        const updateAttendance =await AttendanceModel.updateOne({employee},{data})
        return updateAttendance;
    }
    public async getAttendanceOfAEmployee(id: any): Promise<any> {
        const data = await AttendanceModel.find({ user: id });
        return await data;
    }
}
export { AttendanceService };
