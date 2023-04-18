import { HttpStatus, inject, injectable } from "@leapjs/common";
import bcrypt from "bcrypt";
import { ResponseReturnType } from "common/response/response.type";
import { AuthService } from "../../../common/services/auth";
import { User, UserModel } from "../model/User";
import { TokenModel } from "./../../userSession/model/usersToken";

@injectable()
export class UserService {
  constructor(@inject(() => AuthService) private readonly authService: AuthService) {}

  public async getUserById(id: any): Promise<User | any> {
    const data = await UserModel.findOne({ _id: id });
    return data;
  }

  public async userSignUp(data: User): Promise<ResponseReturnType> {
    return new Promise<User | any>(async (resolve, reject) => {
      try {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        const saveUser = await new UserModel(data).save();
        resolve(saveUser);
      } catch (error: any) {
        let message: any = null || [];

        if (error.keyPattern.email) {
          message.push("Email already registered");
        }
        if (error.keyPattern.phone) {
          message.push("Phone Number already registered");
        }
        if (error.keyPattern.empId) {
          message.push("Employee id already registered");
        }
        reject({ message: message || error });
      }
    });
  }
  /**
   * login
   */
  public async login(phone: number, plainPassword: string) {
    return new Promise<ResponseReturnType>(async resolve => {
      if (!(phone && plainPassword)) {
        const res: ResponseReturnType = {
          code: 404,
          message: "please enter phone number and password",
          data: "",
          error: "please enter phone number and password",
          status: false
        };
        return resolve(res);
      }
      const data: any | User = await UserModel.findOne({ phone: phone }, { password: 1 });

      if (data) {
        /**
         * TODO : Login
         * !comparing
         * @param password  plain text password
         * @param data.password bcrypt password
         */

        const Data = await bcrypt.compare(plainPassword, data.password);
        if (Data) {
          const token = await this.authService.generateToken(JSON.stringify(data));
          const saveToken = await new TokenModel({
            user: data._id,
            token: token
          }).save(); //.populate({path:"user"})
          saveToken.user = data;
          const res: ResponseReturnType = {
            code: HttpStatus.ACCEPTED,
            data: saveToken,
            error: null,
            message: "Success",
            status: true
          };
          return resolve(res);
        } else {
          const res: ResponseReturnType = {
            code: HttpStatus.CONFLICT,
            data: null,
            error: "invalid_password",
            message: "invalid_password",
            status: false
          };
          return resolve(res);
        }
      } else {
        const res: ResponseReturnType = {
          code: HttpStatus.CONFLICT,
          data: null,
          error: "Bad Request",
          message: "Bad Request",
          status: false
        };
        return resolve(res);
      }
    });
  }
  public async getAllUsers() {
    return UserModel.find({});
  }
}
