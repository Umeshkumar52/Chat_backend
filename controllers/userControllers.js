import user from "../models/user.js";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";
import { getIo } from "../midilwares/IoInstance.js";
import notification from "../models/notificationSchema.js";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
export const createUser = async (req, res) => {
  try {
    const { Email, UserName } = req.body;
    const exist = await user.findOne({
      Email,
    });
    if (exist) {
      return res.status(401).json({
        success: false,
        message: "Account allready exist",
      });
    }
    const userSave = await user.create(req.body);
    if (req.file) {
      const avatar = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: "image",
        public_id: "avatar_" + Date.now(),
      });
      userSave.avatar = avatar.secure_url;
      userSave.avatar_public_id = avatar.public_id;
    }
    userSave.save();
    const token = await userSave.genJwtToken();
    userSave.token = token;
    user.Password = undefined;
    res.cookie("authToken", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: userSave,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Please Create Account Again",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const existUser = await user.findOne({ Email: Email }).select("+Password");
    if (
      existUser == null ||
      (await existUser.validator(Password, existUser.Password)) == false
    ) {
      return res.status(512).json({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = await existUser.genJwtToken();
    existUser.token = token;
    user.password = undefined;
    res.cookie("authToken", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: existUser,
    });
  } catch (error) {
    return res.status(512).json({
      success: false,
      message: "Account not exist",
    });
  }
};
export const googleAuthSignIn = async (req, res) => {
  try {
    const { email, email_verified } = req.body;
    if (email_verified) {
      const existUser = await user.findOne({ Email: email });
      const token = await existUser.genJwtToken();
      existUser.token = token;
      user.password = undefined;
      res.cookie("authToken", token, cookieOptions);
      res.status(200).json({
        success: true,
        message: existUser,
      });
    } else {
      return res.status(512).json({
        success: false,
        message: "Account does not exist please sign-up!",
      });
    }
  } catch (error) {
    return res.status(512).json({
      success: false,
      message: "Account does not exist please sign-up!",
    });
  }
};
export const forgetPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const userExist = await user.findOne({ Email: Email });
    if (userExist) {
      const resetPasswordToken = Jwt.sign(
        { Email: Email },
        process.env.JWT_SECRET_KEY,
        {
          algorithm: "HS256",
          expiresIn: "10m",
        }
      );
      let mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: "Link to reset your Eangager password",
        text: `Link has been valid upto 10 minutes. ${process.env.CLIENT_URL}/reset/${resetPasswordToken} Kindle reset your password within time`,
      };
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "pratapmunesh15@gmail.com",
          pass: "giwbflpvhadoaoil",
        },
      });
      await transporter.sendMail(mailOptions);
      res.cookie("resetPasswordToken", resetPasswordToken);
      res.status(200).json({
        success: true,
        message: `Password reset link has been sent to ${Email}`,
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "try again after sometime!",
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { resetPasswordToken } = req.cookies;
    const { forgetPasswordToken, newPassword } = req.body;
    if (!resetPasswordToken == forgetPasswordToken) {
      res.status(400).json({
        success: false,
        message: "reset password time has expired",
      });
    } else {
      const { Email } = await Jwt.decode(
        forgetPasswordToken,
        process.env.JWT_SECRET_KEY
      );
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      await user.findOneAndUpdate(
        { Email },
        { $set: { Password: encryptedPassword } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to reset password, try after sometimes!",
    });
  }
};
export const userAvailability = async (req, res) => {
  try {
    const { UserName } = req.params;
    if (UserName.length > 2) {
      const existUser = await user
        .find({ UserName: { $regex: `^${UserName}`, $options: "i" } })
        .limit(11);
      if (existUser.length == 0) {
        res.status(200).json({
          success: true,
          message: "available",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "UserName is not available",
        });
      }
    }
  } catch (error) {
    return res.status(512).json({
      success: false,
      message: "Technical issue to get unique userName!",
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("authToken", null, {
      maxAge: null,
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { _id, type } = req.body;
    const cloudinary_res = await cloudinary.v2.uploader.upload(req.file.path, {
      resource_type: "image",
      public_id: "profileUpdate_" + Date.now(),
    });
    let response;
    if (type == "profile") {
      response = await user.findByIdAndUpdate(_id, {
        avatar: cloudinary_res.secure_url,
      });
    } else {
      response = await user.findByIdAndUpdate(_id, {
        profileBanner: cloudinary_res.secure_url,
      });
    }
    return res.status(200).json({
      success: true,
      message: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error,
    });
  }
};
export const following = async (req, res) => {
  try {
    let io = getIo();
    const { requester, reciever } = req.params;
    io.emit("following", { reciever: reciever, requester: requester });
    await user.findByIdAndUpdate(requester, { $push: { Following: reciever } });
    await user.findByIdAndUpdate(reciever, {
      $push: { Followers: requester },
      $inc: { unReadNotification: 1 },
    });
    const response = await notification.create({
      sender: requester,
      reciever: reciever,
      type: "following",
      message: `following you.`,
    });
    // io.to(reciever).emit("newNotification",response)
    // io.to(reciever).emit("unReadNotification",response)
    return res.status(200).json({
      success: true,
      message: "Successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export const unfollowing = async (req, res) => {
  try {
    let io = getIo();
    const { requester, reciever } = req.params;
    io.emit("unfollowing", { reciever: reciever, requester: requester });
    await user.updateOne(
      { _id: requester },
      { $pull: { Following: reciever } }
    );
    await user.updateOne(
      { _id: reciever },
      { $pull: { Followers: requester } }
    );
    return res.status(200).json({
      success: true,
      message: "Successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export const userFollowing = async (req, res) => {
  try {
    const { user_id } = req.params;
    const response = await user
      .findById(user_id)
      .select(["Following", "Followers"])
      .populate({
        path: "Following",
        select: ["UserName", "avatar", "Followers", "Name"],
      })
      .populate({
        path: "Followers",
        select: ["UserName", "avatar", "Followers", "Name"],
      });
    return res.status(200).json({
      success: true,
      message: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export const profile = async (req, res) => {
  try {
    const response = await user
      .find(req.params)
      .populate({
        path: "myPosts",
        populate: {
          path: "author",
          model: "user",
          select: ["_id", "Name", "UserName", "avatar", "Followers"],
        },
      })
      .populate({
        path: "myReels",
        populate: {
          path: "author",
          model: "user",
          select: ["_id", "Name", "UserName", "avatar", "Followers"],
        },
      });
    res.status(200).json({
      success: true,
      message: response,
    });
  } catch (error) {
    res.status(512).json({
      success: false,
      message: "Some Technical Issue !",
    });
  }
};
export const userInf = async (req, res) => {
  try {
    const { Email_Phone } = req.body;
    const response = await user.find({ Email_Phone });
    res.status(200).json({
      success: true,
      message: response,
    });
  } catch (error) {
    return res.status(512).json({
      success: false,
      message: error,
    });
  }
};
export const searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.params;
    if (searchTerm.length > 2) {
      const response = await user
        .find({ UserName: { $regex: `^${searchTerm}`, $options: "i" } })
        .limit(11);
      res.status(200).json({
        success: true,
        message: response,
      });
    }
  } catch (error) {
    return res.status(512).json({
      success: false,
      message: "User Not Found",
    });
  }
};
