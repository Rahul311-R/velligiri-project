import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import { getSession } from "@/lib/auth";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();
        const data = await req.json();
        const updatedImage = await Gallery.findByIdAndUpdate(id, data, { new: true });

        if (!updatedImage) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        return NextResponse.json(updatedImage);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();
        const deletedImage = await Gallery.findByIdAndDelete(id);

        if (!deletedImage) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Image deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
    }
}
