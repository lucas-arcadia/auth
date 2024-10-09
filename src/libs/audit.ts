import { createHash } from "crypto";
import { prisma } from "../models/db";

export class AuditTrail {
  private action: string;
  private entity: string;
  private entityId: string;
  private userId: string;
  private what: string;
  private ip: string;

  constructor(action: string, entity: string, entityId: string, userId: string, what: string, ip: string) {
    this.action = action;
    this.entity = entity;
    this.entityId = entityId;
    this.userId = userId;
    this.what = what;
    this.ip = ip;
  
    this.save();
  }

  private async save(): Promise<void> {
    try {
      await prisma.auditTrail.create({
        data: {
          action: this.action,
          entity: this.entity,
          entityId: this.entityId,
          userId: this.userId,
          what: this.what,
          ip: this.ip,
          previousHash: await this.getLastHash(),
          currentHash: await this.generateHash(),
        },
      });
    } catch (error) {
      console.log(`audit: Error saving audit: ${error}`);
    }
  }

  private async getLastHash(): Promise<string> {
    try {
      const lastHash = await prisma.auditTrail.findFirst({
        select: { currentHash: true },
        orderBy: { createdAt: "desc" },
      });

      return lastHash?.currentHash || "";
    } catch (error) {
      console.log(`audit: Error getting last hash: ${error}`);
      return "";
    }
  }

  private async generateHash(): Promise<string> {
    const data = JSON.stringify({
      action: this.action,
      entity: this.entity,
      entityId: this.entityId,
      userId: this.userId,
      what: this.what,
      ip: this.ip,
      previousHash: await this.getLastHash(),
    });
    return createHash("sha256").update(data).digest("hex");
  }

  // public async validateHash(): Promise<boolean> {
  //   const lastHash = await this.getLastHash();
  //   const currentHash = this.generateHash();
  //   return this.currentHash === currentHash;
  // }
}
