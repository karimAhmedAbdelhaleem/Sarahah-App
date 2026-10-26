import mongoose from "mongoose";
import userRepository from "../../DB/repositories/user.repository.js";
import { BadRequestException } from "../../utilities/Error/exceptions.js";
import messageRepository from "../../DB/repositories/message.repository.js";
export const getProfile = async (req) => {
  return req.user;
};

export const updateService = async (user, body) => {
  const { _id } = user;
  const { firstName, lastName, email, gender, phone } = body;
  if (email) {
    const existedEmail = await userRepository.findOneDocument({ email });
    if (existedEmail) {
      throw new Error("email already existed", { cause: { status: 409 } });
    }
  }
  return userRepository.updateWithFindById({
    id: _id,
    data: { firstName, lastName, email, gender, phone },
    options: { new: true },
  });
};

export const getAllUsers = async () => {
  return userRepository.findDocuments({});
};

export const uploadProfileService = async (user, file) => {
  if (!file || !file.path) throw new BadRequestException("pls update an file");
  return await userRepository.updateWithFindById({
    id: user.id,
    data: { profilePicture: file.path },
    options: { new: true },
  });
};

export const deleteAccountService = async (user) => {
  const { _id } = user;
  const session = await mongoose.startSession();
  return session.withTransaction(async () => {
    await messageRepository.deleteManyDocuments({
      filters: { receiverId: _id },
      options: { session },
    });
    await userRepository.deleteOneDocumentById({ _id, options: { session } });
  });
};

