-- CreateEnum
CREATE TYPE "recharge_status" AS ENUM ('RESERVED', 'CHARGING', 'DONE');

-- CreateTable
CREATE TABLE "planet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mass" DOUBLE PRECISION NOT NULL,
    "hasStation" BOOLEAN NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "planet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "charging" BOOLEAN NOT NULL,
    "planetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recharge" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "pricePerMinute" DOUBLE PRECISION NOT NULL,
    "status" "recharge_status" NOT NULL,
    "userId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "recharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "planet_name_key" ON "planet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "station_name_key" ON "station"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "station" ADD CONSTRAINT "station_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recharge" ADD CONSTRAINT "recharge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recharge" ADD CONSTRAINT "recharge_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
