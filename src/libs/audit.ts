import { createHash } from "crypto";
import { prisma } from "../models/db";

export class AuditTrail {
  private action: string;
  private entity: string;
  private entityId: string;
  private userId: string;
  private what: string;
  private ip: string;
  private previousHash?: string;
  private currentHash: string;

  constructor(action: string, entity: string, entityId: string, userId: string, what: string, ip: string, previousHash?: string) {
    this.action = action;
    this.entity = entity;
    this.entityId = entityId;
    this.userId = userId;
    this.what = what;
    this.ip = ip;
    this.previousHash = previousHash;
    this.currentHash = this.generateHash();

    this.save();
  }

  private generateHash(): string {
    const data = `${this.action}${this.entity}${this.entityId}${this.userId}${this.what}${this.ip}${this.previousHash}`;
    return createHash("sha256").update(data).digest("hex");
  }

  public validateHash(): boolean {
    const currentHash = this.generateHash();
    return this.currentHash === currentHash;
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
  private async save(): Promise<void> {
    await prisma.auditTrail.create({
      data: {
        action: this.action,
        entity: this.entity,
        entityId: this.entityId,
        userId: this.userId,
        what: this.what,
        ip: this.ip,
        previousHash: await this.getLastHash(),
        currentHash: this.currentHash,
      },
    });
  }
}
