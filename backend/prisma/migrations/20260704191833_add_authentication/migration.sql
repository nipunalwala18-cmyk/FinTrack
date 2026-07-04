-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hashedRefreshToken" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "provider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ALTER COLUMN "password" DROP NOT NULL;
