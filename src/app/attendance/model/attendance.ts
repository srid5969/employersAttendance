import { getModelForClass, index, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { IsDateString, IsDefined } from "class-validator";
import { ObjectId } from "mongodb";
import { User } from "../../users/model/User";
import { ENTER_IN_TIME, ENTER_IN_TIME_LOCATION, ENTER_IN_VALID_DATE, ENTER_OUT_TIME, ENTER_OUT_TIME_LOCATION } from "../../../resources/strings/app/attendance";

export class Location {
  @prop()
  public latitude: any;

  @prop()
  public longitude: any;
}

@index({ date: 1 }, { unique: true })
class Attendance {
  @prop({ _id: true })
  public id!: ObjectId;

  @prop({ Ref: User, required: true })
  public employee!: Ref<User>;

  @prop({ default: Date.now(), unique: true })
  @IsDateString({}, { groups: ["update", "checkIn", "checkOut", "create"], message: ENTER_IN_VALID_DATE })
  public date!: string;

  @prop({ default: Date.now() })
  @IsDefined({ groups: ["checkIn"], message: ENTER_IN_TIME })
  public checkInTime!: string;

  @prop({ type: Location, _id: false })
  @IsDefined({ groups: ["checkIn"], message: ENTER_IN_TIME_LOCATION })
  public checkInLocation!: Ref<Location>;

  @prop({ type: Location, _id: false })
  @IsDefined({ groups: ["checkOut"], message: ENTER_OUT_TIME_LOCATION })
  public checkOutLocation!: Ref<Location>;

  @prop({})
  @IsDefined({ groups: ["checkOut"], message: ENTER_OUT_TIME })
  public checkOutTime!: string;
}

const AttendanceModel: ReturnModelType<typeof Attendance, any> = getModelForClass(Attendance, {
  schemaOptions: {
    collection: "attendance",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
  }
});

export { Attendance, AttendanceModel };
