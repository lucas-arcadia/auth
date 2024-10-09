import { prisma } from "../db";
import { IChangePassword } from "./UserInterface";

export async function ChangePassword(input: IChangePassword): Promise<any> {
  try {
    const user = await prisma.user.findUnique({ where: { id: input.id } });
    if (!user) throw new Error("Unauthorized");

    if (!(await Bun.password.verify(input.oldPassword, atob(user.hash)))) {
    }

    const hash = btoa(await Bun.password.hash(input.newPassword));

    return prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        hash,
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    throw error;
  }
}
