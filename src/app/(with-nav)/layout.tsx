import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu";
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  
  export default function WithNavLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Recipe App</h1>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/home" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/recipes" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Recipes
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/favorites" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Favorites
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
            
              </NavigationMenuList>
            </NavigationMenu>
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Register</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="border-t p-4 text-center text-gray-500">
          <p>© 2025 Recipe App. All rights reserved.</p>
        </footer>
      </div>
    );
  }