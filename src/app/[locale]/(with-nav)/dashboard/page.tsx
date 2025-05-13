"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    recipeId: string;
    quantity: number;
    price: number;
  }>;
}

interface CartItem {
  id: string;
  recipeId: string;
  quantity: number;
  price: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("Dashboard");

  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch user's orders
      fetch(`/api/orders?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(console.error);

      // Fetch user's cart
      fetch(`/api/cart?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setCartItems(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          {t("welcome", { name: session.user?.name || t("user") })}
        </h1>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="orders">{t("orders")}</TabsTrigger>
            <TabsTrigger value="cart">{t("cart")}</TabsTrigger>
            <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t("yourOrders")}</CardTitle>
                <CardDescription>{t("orderHistory")}</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">{t("noOrders")}</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {t("orderNumber")}: {order.id}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "PROCESSING"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("ordered")}: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium mt-2">
                          {t("total")}: ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cart">
            <Card>
              <CardHeader>
                <CardTitle>{t("yourCart")}</CardTitle>
                <CardDescription>{t("cartItems")}</CardDescription>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">{t("emptyCart")}</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border-b pb-4 dark:border-gray-700"
                      >
                        <div>
                          <p className="font-medium">Recipe ID: {item.recipeId}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("quantity")}: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="flex justify-end mt-4">
                      <Button onClick={() => router.push("/checkout")}>
                        {t("checkout")}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t("profileSettings")}</CardTitle>
                <CardDescription>{t("updateProfile")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t("name")}</Label>
                    <Input
                      id="name"
                      defaultValue={session.user?.name || ""}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={session.user?.email || ""}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit">{t("saveChanges")}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 