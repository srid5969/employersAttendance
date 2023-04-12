import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { IsDefined } from "class-validator";
import { ObjectId } from "mongodb";
import { User } from "../../users/model/User";
@index({ id: 1 }, { expires: "365" })
class UsersToken {
  @prop()
  public id!: ObjectId;

  @prop({ ref: User })
  @IsDefined({ groups: ["create"] })
  public user!: Ref<User> | ObjectId;

  @prop()
  @IsDefined({ groups: ["create"] })
  public token!: string;
}

const TokenModel = getModelForClass(UsersToken, {
  schemaOptions: {
    collection: "session",
    versionKey: false,
    timestamps: { createdAt: "createdAt" },
  },
});
export { UsersToken, TokenModel };
