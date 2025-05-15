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

    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
          items: [],
        },
        include: { items: true },
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    // Find or create cart
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

    // Merge items: combine quantities for same products
    const mergedItems = new Map();
    
    // First, add existing cart items
    if (cart.items) {
      cart.items.forEach(item => {
        mergedItems.set(item.recipeId, {
          ...item,
          quantity: item.quantity
        });
      });
    }

    // Then, merge with new items
    if (items && items.length > 0) {
      items.forEach((item: any) => {
        const existing = mergedItems.get(item.id);
        if (existing) {
          // Update quantity if item exists
          mergedItems.set(item.id, {
            ...existing,
            quantity: existing.quantity + item.quantity
          });
        } else {
          // Add new item
          mergedItems.set(item.id, {
            cartId: cart.id,
            recipeId: item.id,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          });
        }
      });
    }

    // Delete existing items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Create merged items
    if (mergedItems.size > 0) {
      await prisma.cartItem.createMany({
        data: Array.from(mergedItems.values()),
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
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

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
} 