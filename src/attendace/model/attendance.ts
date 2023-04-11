import { getModelForClass, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

class Attendance {
  @prop({ _id: true })
  public id!: ObjectId;

  @prop()
  public employee!: ObjectId;

  @prop({ default: Date.now() })
  public date!: Date;

  @prop({ default: Date.now() })
  public inTime!: Date;

  @prop({})
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
