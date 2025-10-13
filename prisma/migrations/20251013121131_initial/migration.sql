-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "authorizationFormLink" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Delegate" (
    "formSubmissionCode" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Delegate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formSubmissionCode" TEXT,
    "submissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "totalScore" INTEGER NOT NULL,
    "section1Score" INTEGER NOT NULL,
    "section2Score" INTEGER NOT NULL,
    "section3Score" INTEGER NOT NULL,
    "section4Score" INTEGER NOT NULL,
    "section5Score" INTEGER NOT NULL,
    "Q_1_1" TEXT NOT NULL,
    "Q_1_2" TEXT,
    "Q_1_3" TEXT,
    "Q_1_4" TEXT NOT NULL,
    "Q_1_5" TEXT NOT NULL,
    "Q_1_5_a" TEXT,
    "Q_1_6" TEXT,
    "Q_1_7" TEXT NOT NULL,
    "Q_2_1" TEXT NOT NULL,
    "Q_2_2" TEXT,
    "Q_2_2_a" TEXT,
    "Q_2_3" TEXT NOT NULL,
    "Q_2_3_a" TEXT,
    "Q_2_4" TEXT NOT NULL,
    "Q_2_4_a" TEXT,
    "Q_3_1" TEXT NOT NULL,
    "Q_3_1_a" TEXT,
    "Q_3_2" TEXT NOT NULL,
    "Q_3_2_a" TEXT,
    "Q_3_3" TEXT NOT NULL,
    "Q_3_3_a" TEXT,
    "Q_4_1" TEXT NOT NULL,
    "Q_4_1_a" TEXT NOT NULL,
    "Q_4_2" TEXT NOT NULL,
    "Q_4_2_a" TEXT,
    "Q_4_3" TEXT NOT NULL,
    "Q_4_4" TEXT NOT NULL,
    "Q_4_4_a" TEXT,
    "Q_4_5" TEXT NOT NULL,
    "Q_4_5_a" TEXT,
    "Q_4_6" TEXT NOT NULL,
    "Q_4_6_a" TEXT,
    "Q_4_7" TEXT NOT NULL,
    "Q_4_7_a" TEXT,
    "Q_4_8" TEXT NOT NULL,
    "Q_4_8_a" TEXT,
    "Q_4_9" TEXT NOT NULL,
    "Q_4_9_a" TEXT,
    "Q_4_10" TEXT NOT NULL,
    "Q_4_10_a" TEXT,
    "Q_5_1" TEXT NOT NULL,
    "Q_5_1_a" TEXT,
    "Q_5_2" TEXT NOT NULL,
    "Q_5_2_a" TEXT,
    "Q_5_3" TEXT NOT NULL,
    "Q_5_4" TEXT NOT NULL,
    "Q_5_4_a" TEXT,
    "Q_5_5" TEXT NOT NULL,
    "Q_5_5_a" TEXT,
    CONSTRAINT "Form_formSubmissionCode_fkey" FOREIGN KEY ("formSubmissionCode") REFERENCES "Delegate" ("formSubmissionCode") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalId_key" ON "User"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Delegate_formSubmissionCode_key" ON "Delegate"("formSubmissionCode");

-- CreateIndex
CREATE UNIQUE INDEX "Delegate_email_key" ON "Delegate"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Form_id_key" ON "Form"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Form_formSubmissionCode_key" ON "Form"("formSubmissionCode");
