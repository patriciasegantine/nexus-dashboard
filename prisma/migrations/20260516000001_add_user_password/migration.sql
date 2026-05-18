-- Add password column to User (nullable, for email/password auth)
ALTER TABLE "User" ADD COLUMN "password" TEXT;
