-- CreateTable
CREATE TABLE "Owers" (
    "id" SERIAL NOT NULL,
    "expenseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Owers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Owers" ADD CONSTRAINT "Owers_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
