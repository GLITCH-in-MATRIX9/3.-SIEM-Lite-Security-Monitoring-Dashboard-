import { prisma } from "../config/database.config";

export class PasswordResetRepository {
  create(data: any) {
    return prisma.passwordResetToken.create({
      data,
    });
  }

  findByUserId(userId: string) {
    return prisma.passwordResetToken.findMany({
      where: {
        userId,
        used: false,
      },
    });
  }

  markUsed(id: string) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: {
        used: true,
      },
    });
  }
}