import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../lib/prisma";

interface OwerReq {
  userId: number, 
  amount: number 
}

interface ExpenseBody {
  payerId: number, amount: number, groupId: number | null, owers: Array<OwerReq>
}

export async function GET(req: NextRequest, res: NextResponse) {
  const [_, userId] = req.url.split('api/dashboard/');
  // Amount he owes
  const owers = await prisma.owers.findMany({
    include: {
      expense: {
        include: {
          payer: true,
        },
      },
    },
    where: {
      userId: parseInt(userId, 10),
      paid: false,
    },
  });
  const owingAmount = owers.reduce((acc, current) => current.amount + acc, 0);
  const lent = await prisma.owers.groupBy({
    by: ["userId"],
    where: {
      expense: {
        payerId: parseInt(userId, 10),
      },
      paid: false,
    },
    _sum: {
      amount: true,
    },
  });

  const lentUsers = await prisma.user.findMany({
    where: {
      id: {
        in: lent.map((doc) => doc.userId),
      },
    },
  });

  const lentWithUsers = lent.map((lentDoc) => {
    const user = lentUsers.find((user) => user.id === lentDoc.userId);
    return {
      ...lentDoc,
      user,
    };
  });

  const lendingAmount = lent.reduce((acc, current) => {
    const sum = current._sum.amount || 0;
    return acc + sum;
  }, 0);
  return NextResponse.json({
    owingAmount,
    lendingAmount,
    owers,
    lentWithUsers,
  });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  console.log(data);
  const {payerId, amount, groupId, owers}: ExpenseBody = data;
  const createExpenseResponse = await prisma.expense.create({
    data: {
      payerId,
      amount,
      groupId,
      Owers: {
        create: owers
      }
    }
  });
  return NextResponse.json({ createExpenseResponse });
}
