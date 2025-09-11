import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/ldri/client.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.ensureAdminUser();
  }

  private async ensureAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!adminEmail || !adminPassword) return;

    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(adminPassword, salt);

    try {
      const user = await this.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
          email: adminEmail,
          password: passwordHash,
          name: adminName,
        },
      });
      console.log(`Admin user: ${user}`);
    } catch (error) {
      // Intentionally swallow to avoid crashing app due to seed issues
      console.error(error);
    }
  }
}
