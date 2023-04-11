import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { IsDefined } from "class-validator";
import { ObjectId } from "mongodb";
import { User } from "../../users/model/User";
import { ENTER_IN_TIME } from "./../../resources/strings/app/attendance";

class Attendance {
  @prop({ _id: true })
  public id!: ObjectId;

  @prop({ Ref: User })
  public employee!: Ref<User>;

  @prop({ default: Date.now() })
  @IsDefined({ groups: ["i"], message: ENTER_IN_TIME })
  @prop({ default: Date.now() })
  public date!: Date;
  public inTime!: Date;

  @prop({})
  @IsDefined({ groups: ["out"], message: ENTER_IN_TIME })
  public outTime!: Date;
}

const AttendanceModel = getModelForClass(Attendance, {
  schemaOptions: {
    collection: "attendance",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
});

export { Attendance, AttendanceModel };
