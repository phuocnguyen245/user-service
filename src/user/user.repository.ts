import { prisma } from '@/config/prisma';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

const getUserById = async (userId: Types.ObjectId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId.toString(),
    },
  });
};

const createUser = async (user: User) => {
  return await prisma.user.create({
    data: user,
  });
};

const deleteUser = async (userId: Types.ObjectId) => {
  return await prisma.user.update({
    data: {
      isDeleted: true,
    },
    where: {
      id: userId.toString(),
    },
  });
};

const updateUser = async (userId: Types.ObjectId, user: User) => {
  return await prisma.user.update({
    data: user,
    where: {
      id: userId.toString(),
    },
  });
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export {
  createUser,
  deleteUser,
  getUserById,
  hashPassword,
  updateUser,
  comparePassword,
};
