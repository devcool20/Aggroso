-- CreateTable
CREATE TABLE "transcripts" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transcripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_items" (
    "id" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "owner" TEXT,
    "dueDate" TIMESTAMP(3),
    "tags" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transcriptId" TEXT NOT NULL,

    CONSTRAINT "action_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "action_items" ADD CONSTRAINT "action_items_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "transcripts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
