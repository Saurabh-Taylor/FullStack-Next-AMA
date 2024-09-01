import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified:boolean
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
    trim:true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match:[/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/, "please use a valid email address"]
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCode: {
    type: String,
  },
  verifyCodeExpiry: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false
    },
  isAcceptingMessage: {
    type: Boolean,
    default: true
  },
  message: [MessageSchema]

});

const UserModal = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema))
export default UserModal


