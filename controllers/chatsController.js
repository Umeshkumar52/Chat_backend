import path from "path";
import publicIdHandler from "../midilwares/publicIdHandler.js";
import chatsSchema from "../models/chatsSchema.js";
import conversation from "../models/conversation.js";
import cloudinary from "cloudinary";
import fs from "fs";
export const SaveTextCom = async (req, res) => {
  try {
    const { sender_id, message, msg_type, callDuration } = req.body;
    const { _id } = req.params;
    const chat = await chatsSchema.create({
      reciever_id: _id,
      sender_id: sender_id,
      msg_type,
      isRead: false,
      message,
      callDuration,
    });
    const existChat = await conversation.findOne({
      $or: [
        { $and: [{ reciever_id: sender_id }, { sender_id: _id }] },
        { $and: [{ reciever_id: _id }, { sender_id: sender_id }] },
      ],
    });
    if (existChat) {
      const response = await conversation.updateOne(
        {
          $or: [
            { $and: [{ reciever_id: sender_id }, { sender_id: _id }] },
            { $and: [{ reciever_id: _id }, { sender_id: sender_id }] },
          ],
        },
        { $push: { chats: chat._id } }
      );
      return res.status(200).json({
        success: true,
        message: response,
      });
    } else {
      const response = await conversation.create({
        sender_id: sender_id,
        reciever_id: _id,
        chats: chat._id,
      });
      return res.status(200).json({
        success: true,
        message: response,
      });
    }
  } catch (error) {
    return res.status(512).json({
      success: false,
      message: "Fail send message to user",
      error,
    });
  }
};
export const SaveSocialCom = async (req, res) => {
    const { _id, sender_id } = req.params;
   //  const { fileName, chunkIndex, totalChunks } = req.body;
    let imgResult;
    let response;
//     if(parseInt(chunkIndex)+1===parseInt(totalChunks)){
//     const filePath = path.join("uploads", fileName);
//     const writeStream = fs.createWriteStream(filePath);
//     for (let i = 0; i < totalChunks; i++) {
//       const chunkPath=path.join('uploads',`${fileName}-chunk${i}`)

//       const data=await fs.readFileSync(chunkPath)
//       console.log(data);
      
//       writeStream.write(data)
//       fs.unlinkSync(chunkPath)
//       writeStream.end()
//       writeStream.on('finish',async()=>{
//        try{
//             if (req.file) {
//       if (req.file.mimetype == "video/mp4") {
//         imgResult = await cloudinary.v2.uploader.upload(req.file.path, {
//           resource_type: "video",
//           public_id: publicIdHandler(req.file, sender_id, "video"),
//         });
//       } else {
//         imgResult = await cloudinary.v2.uploader.upload(req.file.path, {
//           public_id: publicIdHandler(req.file, sender_id, "img"),
//           transformation: {
//             width: 200,
//             height: 240,
//             crop: "scale",
//           },
//         });
//       }
//       //   remove files from upload folder
//       fs.unlink(req.file.path, (error) => {
//         return;
//       });
//       const chat = await chatsSchema.create({
//         reciever_id: _id,
//         sender_id: sender_id,
//         msg_type: "file",
//         url_type: imgResult.format,
//         isRead: false,
//         secure_url: imgResult.secure_url,
//         public_id: imgResult.public_id,
//       });
//       const existChat = await conversation.findOne({
//         $or: [
//           { $and: [{ reciever_id: sender_id }, { sender_id: _id }] },
//           { $and: [{ reciever_id: _id }, { sender_id: sender_id }] },
//         ],
//       });
//       if (existChat) {
//         response = await conversation.updateOne(
//           {
//             $or: [
//               { $and: [{ reciever_id: sender_id }, { sender_id: _id }] },
//               { $and: [{ reciever_id: _id }, { sender_id: sender_id }] },
//             ],
//           },
//           { $push: { chats: chat._id } }
//         );
//       } else {
//         response = await conversation.create({
//           sender_id: sender_id,
//           reciever_id: _id,
//           chats: chat._id,
//         });
//         res.status(200).json({
//           success: true,
//           message: response,
//         });
//       }
//     }
//     res.status(200).json({
//       success: true,
//       message: response,
//     });
//   } catch (error) {
//     res.status(512).json({
//       success: false,
//       message: error,
//     });
//   }

//       })
//     }
//    }

   //  main working copfirm
   try{
    if (req.file) {
      if (req.file.mimetype == "video/mp4") {
        imgResult = await cloudinary.v2.uploader.upload(req.file.path, {
          resource_type: "video",
          public_id: publicIdHandler(req.file, sender_id, "video"),
        });
      } else {
        imgResult = await cloudinary.v2.uploader.upload(req.file.path, {
          public_id: publicIdHandler(req.file, sender_id, "img"),
          transformation: {
            width: 200,
            height: 240,
            crop: "scale",
          },
        });
      }
      //   remove files from upload folder
      fs.unlink(req.file.path, (error) => {
        return;
      });
      const chat = await chatsSchema.create({
        reciever_id: _id,
        sender_id: sender_id,
        msg_type: "file",
        url_type: imgResult.format,
        isRead: false,
        secure_url: imgResult.secure_url,
        public_id: imgResult.public_id,
      });
      const existChat = await conversation.findOne({
        $or: [
          { $and: [{ reciever_id: sender_id }, { sender_id: _id }] },
          { $and: [{ reciever_id: _id }, { sender_id: sender_id }] },
        ],
      });
      if (existChat) {
        response = await conversation.updateOne(
          {
            $or: [
              { $and: [{ reciever_id: sender_id }, { sender_id: _id }] },
              { $and: [{ reciever_id: _id }, { sender_id: sender_id }] },
            ],
          },
          { $push: { chats: chat._id } }
        );
      } else {
        response = await conversation.create({
          sender_id: sender_id,
          reciever_id: _id,
          chats: chat._id,
        });
        res.status(200).json({
          success: true,
          message: response,
        });
      }
    }
    res.status(200).json({
      success: true,
      message: response,
    });
  } catch (error) {
    res.status(512).json({
      success: false,
      message: error,
    });
  }
}
export const GetAllMessages = async (req, res) => {
  // const {sender_id}=req.body
  const { _id, sender_id } = req.params;
  try {
    //  const response=await conversation.aggregate([
    //    {$match:{sender_id,reciever_id:_id}},
    //     {$lookup:{
    //       from:"chatsSchema",
    //       localField:"chats",
    //       foreignField:"_id",
    //       as:"chats",
    //    }},
    //    {$lookup:{
    //       from:"user",
    //       localField:"reciever_id",
    //       foreignField:"UserName",
    //       as:"reciever",
    //    }},
    //    {
    //       $project:{
    //          UserName:1,
    //          avatar:1
    //       }
    //    }
    //  ])
    const response = await conversation
      .find({
        $or: [
          { $and: [{ reciever_id: sender_id }, { sender_id: _id }] },
          { $and: [{ reciever_id: _id }, { sender_id: sender_id }] },
        ],
      })
      .populate({
        path: "chats",
      });
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
export const deleteChats = async (req, res) => {
  try {
    const { textMsgData, fileMsgData } = req.body;
    const { conversation_id } = req.params;
    if (textMsgData.length > 1) {
      await chatsSchema.deleteMany({ _id: { $in: textMsgData } });
      await conversation.updateMany(
        { _id: conversation_id },
        { $pull: { chats: { $in: textMsgData } } }
      );
    } else if (textMsgData.length == 1) {
      await chatsSchema.deleteOne({ _id: { $in: textMsgData } });
      await conversation.updateOne(
        { _id: conversation_id },
        { $pull: { chats: { $in: fileMsgData } } }
      );
    }
    if (fileMsgData.length >= 1) {
      const publice_ids = fileMsgData.map((Element) => Element.public_id);
      await cloudinary.v2.api.delete_resources(publice_ids);
      if (fileMsgData.length > 1) {
        await chatsSchema.deleteMany({ _id: { $in: fileMsgData } });
        await conversation.updateMany(
          { _id: conversation_id },
          { $pull: { chats: { $in: fileMsgData } } }
        );
      } else if (fileMsgData.length == 1) {
        await chatsSchema.deleteOne({ _id: fileMsgData._id });
        await conversation.updateOne(
          { _id: conversation_id },
          { $pull: { chats: { $in: fileMsgData._id } } }
        );
      }
    }
    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable To delete chats",
    });
  }
};
