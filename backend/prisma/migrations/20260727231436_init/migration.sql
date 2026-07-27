-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "garments" (
    "id" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "colors" TEXT[],
    "style" TEXT NOT NULL,
    "occasions" TEXT[],
    "pattern" TEXT NOT NULL,
    "estimated_material" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "embedding" vector(1536),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garments_pkey" PRIMARY KEY ("id")
);
