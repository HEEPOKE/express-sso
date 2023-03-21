import prisma from "../prisma";

const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const userCommon = {
  findUserByEmail,
};

export default userCommon;