/*
  Warnings:

  - You are about to drop the `new_ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "new_ChatRoom";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" INTEGER NOT NULL DEFAULT 1, -- 기본값 1 추가
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ChatRoom_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChatRoom" ("created_at", "id", "updated_at") SELECT "created_at", "id", "updated_at" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
