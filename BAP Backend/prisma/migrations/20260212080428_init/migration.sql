-- CreateTable
CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "user_role" TEXT NOT NULL,
    "user_role_code" INTEGER NOT NULL,
    "is_active" CHAR(1),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_users" (
    "userid" TEXT NOT NULL,
    "name_of_applicant" TEXT NOT NULL,
    "userrolecode" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "recordcreatedon" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_users_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_role_code_key" ON "user_roles"("user_role_code");

-- AddForeignKey
ALTER TABLE "master_users" ADD CONSTRAINT "master_users_userrolecode_fkey" FOREIGN KEY ("userrolecode") REFERENCES "user_roles"("user_role_code") ON DELETE RESTRICT ON UPDATE CASCADE;
