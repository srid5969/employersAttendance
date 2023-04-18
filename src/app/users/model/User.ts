import { mongoErrorHandler } from "@leapjs/common";
import { getModelForClass, index, post, prop } from "@typegoose/typegoose";
import { IsDefined, IsEmail, IsEnum, IsPhoneNumber } from "class-validator";
import { ObjectId } from "mongodb";
import { INVALID_GENDER, INVALID_NAME } from "../../../resources/strings/app/role";
import { Gender, Roles } from "../../../common/constants";
import { EMPTY_EMAIL, EMPTY_EMPLOYEE_ID, EMPTY_GENDER, EMPTY_PASSWORD, EMPTY_PHONE } from "../../../resources/strings/app/auth";
import { EMPTY_FIRST_NAME, INVALID_EMAIL, INVALID_PHONE } from "../../../resources/strings/app/user";
import { Expose } from "class-transformer";

@index({  phone: 1, empId: 1 }, { unique: true })
@post("save", mongoErrorHandler("users"))
@post("findOneAndUpdate", mongoErrorHandler("users"))
class User {
  @prop({ _id: true, id: ObjectId })
  public id?: ObjectId;

  @prop({ required: true })
  @IsDefined({ groups: ["create"], message: EMPTY_FIRST_NAME })
  public name?: string;

  @prop({ required: true })
  @IsDefined({ groups: ["create"], message: EMPTY_EMAIL })
  @IsEmail({}, { always: true, message: INVALID_EMAIL })
  public email?: string;

  @prop({ required: true, unique: true })
  @IsDefined({ groups: ["create"], message: EMPTY_PHONE })
  @IsPhoneNumber("IN", { always: true, message: INVALID_PHONE })
  public phone!: number;

  @prop({ required: true, allowMixed: 0, select: false })
  @IsDefined({ groups: ["create"], message: EMPTY_PASSWORD })
  public password!: string;

  @prop({ required: true, default: Roles.Employee })
  @Expose({ groups: ["admin"] })
  @IsEnum(Roles, { groups: ["create", "update"], message: INVALID_NAME })
  public role!: string;

  @prop({ required: true, unique: true })
  @IsDefined({ groups: ["create"], message: EMPTY_EMPLOYEE_ID })
  public empId?: string;

  @prop({ required: true, default: true })
  public active!: boolean;

  @prop({ required: true, enum: ["Male", "Female"] })
  @IsDefined({ groups: ["create"], message: EMPTY_GENDER })
  @IsEnum(Gender, { groups: ["create", "update"], message: INVALID_GENDER })
  public gender!: string;

  @prop({ required: true })
  public birthDate!: string;
}

const UserModel = getModelForClass(User, {
  schemaOptions: {
    collection: "users",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
  }
});

export { User, UserModel };
