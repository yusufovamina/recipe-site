import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    console.log('Received order data:', body);

    const { items, totalAmount, address, phoneNumber, paymentMethod, deliveryMethod } = body;

    if (!items?.length || !totalAmount || !address || !phoneNumber) {
      console.error('Missing fields:', { items, totalAmount, address, phoneNumber });
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields', fields: { items, totalAmount, address, phoneNumber } }), 
        { status: 400 }
      );
    }

    // Validate items structure
    const validItems = items.every((item: any) => 
      item && 
      typeof item.recipeId === 'string' && 
      typeof item.quantity === 'number' && 
      typeof item.price === 'number' &&
      typeof item.name === 'string'
    );

    if (!validItems) {
      console.error('Invalid items format:', items);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid items format', items }), 
        { status: 400 }
      );
    }

    try {
      // Create the order
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
          address,
          phoneNumber,
          status: 'PENDING',
          paymentStatus: paymentMethod === 'cash' ? 'PENDING' : 'PAID',
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        items.map((item: any) =>
          prisma.orderItem.create({
            data: {
              orderId: order.id,
              recipeId: item.recipeId,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            }
          })
        )
      );

      // Clear the user's cart after successful order
      await prisma.cart.deleteMany({
        where: { userId: session.user.id },
      });

      return NextResponse.json({ ...order, items: orderItems });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Database error', 
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        }), 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[ORDERS_POST] Error details:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    );
  }
} 