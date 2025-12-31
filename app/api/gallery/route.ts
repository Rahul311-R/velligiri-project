import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        await dbConnect();
        const images = await Gallery.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(images);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // Basic validation
        if (!data.url || !data.caption) {
            return NextResponse.json({ error: "URL and Caption are required" }, { status: 400 });
        }

        const newImage = await Gallery.create(data);
        return NextResponse.json(newImage, { status: 201 });
    } catch (error) {
        console.error("Gallery POST Error:", error);
        return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
    }
}
