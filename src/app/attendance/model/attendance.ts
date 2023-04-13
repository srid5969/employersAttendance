import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { IsDefined } from 'class-validator';
import { ObjectId } from 'mongodb';
import { User } from '../../users/model/User';
import { ENTER_IN_TIME, ENTER_IN_TIME_LOCATION, ENTER_OUT_TIME_LOCATION } from '../../../resources/strings/app/attendance';

export class Location {
  public latitude: any;
  public longitude: any;
}

class Attendance {
  @prop({ _id: true })
  public id!: ObjectId;

  @prop({ Ref: User })
  public employee!: Ref<User>;

  @prop({ default: Date.now() })
  public date!: Date;

  @prop({ default: Date.now() })
  @IsDefined({ groups: ['checkIn'], message: ENTER_OUT_TIME_LOCATION })
  public checkInTime!: Date;

  @prop({ type: Location })
  @IsDefined({ groups: ['checkIn'], message: ENTER_IN_TIME_LOCATION })
  public checkInLocation!: Ref<Location>;

  @prop({ type: Location })
  @IsDefined({ groups: ['checkOut'], message: ENTER_IN_TIME_LOCATION })
  public checkOutLocation!: Ref<Location>;

  @prop({})
  @IsDefined({ groups: ['checkOut'], message: ENTER_IN_TIME })
  public checkOutTime!: Date;
}

const AttendanceModel = getModelForClass(Attendance, {
  schemaOptions: {
    collection: 'attendance',
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
});

export { Attendance, AttendanceModel };
