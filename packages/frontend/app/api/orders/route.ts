import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

function getOrdersFilePath(): string {
  const currentDir = process.cwd();

  // Handle both monorepo root and frontend package working directories
  const candidatePaths = [
    path.join(currentDir, "packages", "frontend", "data"),
    path.join(currentDir, "data"),
  ];

  let targetDir = candidatePaths.find((dir) => fs.existsSync(dir));

  if (!targetDir) {
    targetDir = candidatePaths[0];
    fs.mkdirSync(targetDir, { recursive: true });
  }

  return path.join(targetDir, "orders.json");
}

export async function GET() {
  try {
    const filePath = getOrdersFilePath();
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const orders = JSON.parse(fileContent || "[]");
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error reading orders.json:", error);
    return NextResponse.json({ error: "Failed to read orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const orderData = await req.json();
    const filePath = getOrdersFilePath();

    let orders: unknown[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        orders = JSON.parse(fileContent || "[]");
        if (!Array.isArray(orders)) {
          orders = [];
        }
      } catch {
        orders = [];
      }
    }

    orders.unshift(orderData);

    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), "utf-8");

    // 1. Purge Next.js server-side ISR page cache
    try {
      revalidatePath("/store");
      revalidatePath("/(store)/store");
      revalidatePath("/store/[id]", "page");
      revalidatePath("/");
    } catch (revalidateErr) {
      console.warn("ISR cache revalidation warning:", revalidateErr);
    }

    // 2. Clear backend TypeORM query cache
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      try {
        await fetch(`${apiUrl}products/clear-cache`, { method: "POST" });
      } catch (backendCacheErr) {
        console.warn("Backend cache purge warning:", backendCacheErr);
      }
    }

    return NextResponse.json({ success: true, order: orderData });
  } catch (error) {
    console.error("Error saving order to orders.json:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
