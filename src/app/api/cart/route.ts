import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return NextResponse.json([]);
    }

    // Fetch recipe details for each cart item
    const cartItemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        // Here you would typically fetch recipe details from your recipe database
        // For now, we'll return the basic cart item info
        return {
          id: item.id,
          recipeId: item.recipeId,
          quantity: item.quantity,
          price: item.price,
          // Add any additional recipe details you want to display
        };
      })
    );

    return NextResponse.json(cartItemsWithDetails);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { recipeId, quantity, price, name, image } = data;

    if (!recipeId || !quantity || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        recipeId,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
      return NextResponse.json(updatedItem);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        recipeId,
        quantity,
        price,
        name,
        image,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { itemId, quantity } = data;

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
} 