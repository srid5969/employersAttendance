import { BadRequestException, ConflictException, inject, injectable } from "@leapjs/common";
import bcrypt from "bcrypt";
import { TokenModel } from "./../../userSession/model/usersToken";
import { User, UserModel } from "../model/User";
import { AuthService } from "../../../common/services/auth";

@injectable()
export class UserService {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  public async userSignUp(data: User): Promise<User | any> {
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
    return new Promise<any>(async resolve => {
      if (!(phone && plainPassword)) {
        return resolve(
          new ConflictException("please enter phone number and password", {
            name: "no_phone_or_password",
            code: 404
          })
        );
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
          return resolve(saveToken);
        } else {
          resolve(
            new BadRequestException("wrong password", {
              code: 401,
              name: "invalid_password"
            })
          );
        }
      } else {
        const err = new BadRequestException("Bad Request", { code: 404 });
        resolve(err);
      }
    });
  }
  public async getAllUsers() {
    return UserModel.find({});
  }
}
