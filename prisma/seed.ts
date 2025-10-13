import { PrismaClient } from '@prisma/client/ldri/client.js';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const password = 'john3:16';
const salt = bcrypt.genSaltSync();
const passwordHash = bcrypt.hashSync(password, salt);
async function main() {
  const admin = await prisma.admin.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'muriuki@muchiri.com',
      password: passwordHash,
      name: 'Admin0',
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@prisma.io',
      password: passwordHash,
      sex: 'female',
      nationalId: '123456789',
      county: 'embu',
      position: 'Manager',
      department: 'Health',
      phone: '1234567890',
      valid: true,
      authorizationFormLink: 'https://www.google.com',
    },
  });
  //
  // const delegate1 = await prisma.delegate.upsert({
  //   where: { formSubmissionCode: 'SUB123' },
  //   update: {},
  //   create: {
  //     formSubmissionCode: 'SUB123',
  //     name: 'Delegate One',
  //     email: 'delegate1@prisma.io',
  //     phone: '1234567890',
  //     county: 'embu',
  //     department: 'Engineering',
  //     supervisor: {
  //       connect: { id: alice.id },
  //     },
  //   },
  //   include: { supervisor: true },
  // });
  //
  // const bob = await prisma.user.upsert({
  //   where: { email: 'bob@prisma.io' },
  //   update: {},
  //   create: {
  //     name: 'Bob',
  //     email: 'bob@prisma.io',
  //     password: passwordHash,
  //     sex: 'male',
  //     nationalId: '987654321',
  //     county: 'homabay',
  //     position: 'Developer',
  //     department: 'Engineering',
  //     phone: '9876543210',
  //     authorizationFormLink: 'google.com',
  //     valid: true,
  //   },
  // });
  //
  // const delegate2 = await prisma.delegate.upsert({
  //   where: { formSubmissionCode: 'SUB456' },
  //   update: {},
  //   create: {
  //     formSubmissionCode: 'SUB456',
  //     name: 'Delegate Two',
  //     email: 'delegate2@prisma.io',
  //     phone: '9876543210',
  //     county: 'homabay',
  //     department: 'Engineering',
  //     supervisor: {
  //       connect: { id: bob.id },
  //     },
  //   },
  //   include: { supervisor: true },
  // });
  //
  // const forms = [
  //   {
  //     id: 'form1',
  //     totalScore: 43,
  //     section1Score: 10,
  //     section2Score: 10,
  //     section3Score: 10,
  //     section4Score: 10,
  //     section5Score: 3,
  //     completed: true,
  //     formSubmissionCode: 'SUB123',
  //     Q_1_1: 'Answer 1.1 - A',
  //     Q_1_2: 'Answer 1.2 - A',
  //     Q_1_3: 'Answer 1.3 - A',
  //     Q_1_4: 'Answer 1.4 - A',
  //     Q_1_5: 'Answer 1.5 - A',
  //     Q_1_5_a: 'Answer 1.5.a - A',
  //     Q_1_6: 'Answer 1.6 - A',
  //     Q_1_7: 'Answer 1.7 - A',
  //     Q_2_1: 'Answer 2.1 - A',
  //     Q_2_2: 'Answer 2.2 - A',
  //     Q_2_2_a: 'Answer 2.2.a - A',
  //     Q_2_3: 'Answer 2.3 - A',
  //     Q_2_3_a: 'Answer 2.3.a - A',
  //     Q_2_4: 'Answer 2.4 - A',
  //     Q_2_4_a: 'Answer 2.4.a - A',
  //     Q_3_1: 'Answer 3.1 - A',
  //     Q_3_1_a: 'Answer 3.1.a - A',
  //     Q_3_2: 'Answer 3.2 - A',
  //     Q_3_2_a: 'Answer 3.2.a - A',
  //     Q_3_3: 'Answer 3.3 - A',
  //     Q_3_3_a: 'Answer 3.3.a - A',
  //     Q_4_1: 'Answer 4.1 - A',
  //     Q_4_1_a: 'Answer 4.1.a - A',
  //     Q_4_2: 'Answer 4.2 - A',
  //     Q_4_2_a: 'Answer 4.2.a - A',
  //     Q_4_3: 'Answer 4.3 - A',
  //     Q_4_4: 'Answer 4.4 - A',
  //     Q_4_4_a: 'Answer 4.4.a - A',
  //     Q_4_5: 'Answer 4.5 - A',
  //     Q_4_5_a: 'Answer 4.5.a - A',
  //     Q_4_6: 'Answer 4.6 - A',
  //     Q_4_6_a: 'Answer 4.6.a - A',
  //     Q_4_7: 'Answer 4.7 - A',
  //     Q_4_7_a: 'Answer 4.7.a - A',
  //     Q_4_8: 'Answer 4.8 - A',
  //     Q_4_8_a: 'Answer 4.8.a - A',
  //     Q_4_9: 'Answer 4.9 - A',
  //     Q_4_9_a: 'Answer 4.9.a - A',
  //     Q_4_10: 'Answer 4.10 - A',
  //     Q_4_10_a: 'Answer 4.10.a - A',
  //     Q_5_1: 'Answer 5.1 - A',
  //     Q_5_1_a: 'Answer 5.1.a - A',
  //     Q_5_2: 'Answer 5.2 - A',
  //     Q_5_2_a: 'Answer 5.2.a - A',
  //     Q_5_3: 'Answer 5.3 - A',
  //     Q_5_4: 'Answer 5.4 - A',
  //     Q_5_4_a: 'Answer 5.4.a - A',
  //     Q_5_5: 'Answer 5.5 - A',
  //     Q_5_5_a: 'Answer 5.5.a - A',
  //     userId: alice.id,
  //   },
  //   {
  //     id: 'form2',
  //     totalScore: 23,
  //     section1Score: 5,
  //     section2Score: 3,
  //     section3Score: 7,
  //     section4Score: 5,
  //     section5Score: 3,
  //     completed: true,
  //     formSubmissionCode: 'SUB456',
  //     Q_1_1: 'Answer 1.1 - B',
  //     Q_1_2: 'Answer 1.2 - B',
  //     Q_1_3: 'Answer 1.3 - B',
  //     Q_1_4: 'Answer 1.4 - B',
  //     Q_1_5: 'Answer 1.5 - B',
  //     Q_1_5_a: 'Answer 1.5.a - B',
  //     Q_1_6: 'Answer 1.6 - B',
  //     Q_1_7: 'Answer 1.7 - B',
  //     Q_2_1: 'Answer 2.1 - B',
  //     Q_2_2: 'Answer 2.2 - B',
  //     Q_2_2_a: 'Answer 2.2.a - B',
  //     Q_2_3: 'Answer 2.3 - B',
  //     Q_2_3_a: 'Answer 2.3.a - B',
  //     Q_2_4: 'Answer 2.4 - B',
  //     Q_2_4_a: 'Answer 2.4.a - B',
  //     Q_3_1: 'Answer 3.1 - B',
  //     Q_3_1_a: 'Answer 3.1.a - B',
  //     Q_3_2: 'Answer 3.2 - B',
  //     Q_3_2_a: 'Answer 3.2.a - B',
  //     Q_3_3: 'Answer 3.3 - B',
  //     Q_3_3_a: 'Answer 3.3.a - B',
  //     Q_4_1: 'Answer 4.1 - B',
  //     Q_4_1_a: 'Answer 4.1.a - B',
  //     Q_4_2: 'Answer 4.2 - B',
  //     Q_4_2_a: 'Answer 4.2.a - B',
  //     Q_4_3: 'Answer 4.3 - B',
  //     Q_4_4: 'Answer 4.4 - B',
  //     Q_4_4_a: 'Answer 4.4.a - B',
  //     Q_4_5: 'Answer 4.5 - B',
  //     Q_4_5_a: 'Answer 4.5.a - B',
  //     Q_4_6: 'Answer 4.6 - B',
  //     Q_4_6_a: 'Answer 4.6.a - B',
  //     Q_4_7: 'Answer 4.7 - B',
  //     Q_4_7_a: 'Answer 4.7.a - B',
  //     Q_4_8: 'Answer 4.8 - B',
  //     Q_4_8_a: 'Answer 4.8.a - B',
  //     Q_4_9: 'Answer 4.9 - B',
  //     Q_4_9_a: 'Answer 4.9.a - B',
  //     Q_4_10: 'Answer 4.10 - B',
  //     Q_4_10_a: 'Answer 4.10.a - B',
  //     Q_5_1: 'Answer 5.1 - B',
  //     Q_5_1_a: 'Answer 5.1.a - B',
  //     Q_5_2: 'Answer 5.2 - B',
  //     Q_5_2_a: 'Answer 5.2.a - B',
  //     Q_5_3: 'Answer 5.3 - B',
  //     Q_5_4: 'Answer 5.4 - B',
  //     Q_5_4_a: 'Answer 5.4.a - B',
  //     Q_5_5: 'Answer 5.5 - B',
  //     Q_5_5_a: 'Answer 5.5.a - B',
  //     userId: bob.id,
  //   },
  // ];
  //
  // for (const data of forms) {
  //   let form = await prisma.form.upsert({
  //     where: { id: data.id },
  //     update: {},
  //     create: data,
  //     include: { User: true, delegate: true },
  //   });
  //   console.log({ form });
  // }
  // console.log({ admin, alice, bob, delegate1, delegate2 });
  console.log(admin, alice);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
