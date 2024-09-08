import { Schema, model, Document } from "mongoose";
import { Password } from "../services/password";
interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {toJSON: {
  transform(doc, ret) {
    ret.id =ret._id
    delete ret._id
    delete ret.__v
    delete ret.password
  }
}});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
    
const UserModel = model<IUser>("user", userSchema);
export default UserModel;
