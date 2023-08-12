import { NextResponse } from 'next/server';
import prisma from "../../../lib/prisma";

export async function GET() {
    const userId = "1";
  // Amount he owes
  const owers = await prisma.owers.findMany({
    include: {
      expense: {
        include: {
          payer: true
        }
      }
    },
    where: {
      userId: parseInt(userId, 10),
      paid: false
    }
  })
  const owingAmount = owers.reduce((acc, current) => current.amount + acc, 0);
  const lent = await prisma.owers.groupBy({
    by: ['userId'],
    where: {
      expense: {
        payerId: parseInt(userId, 10)
      },
      paid: false
    },
    _sum: {
      amount: true
    },
  })

  const lentUsers = await prisma.user.findMany({
    where: {
      id: {
        in: lent.map(doc => doc.userId)
      } 
    }
  });

  const lentWithUsers = lent.map(lentDoc => {
    const user = lentUsers.find(user => user.id === lentDoc.userId);
    return {
      ...lentDoc,
      user,
    };
  })

  const lendingAmount = lent.reduce((acc, current) => {
    const sum = current._sum.amount || 0;
    return acc + sum;
  }, 0);
  return NextResponse.json({ owingAmount, lendingAmount, owers, lentWithUsers });
}