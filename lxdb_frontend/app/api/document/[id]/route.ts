import { NextRequest, NextResponse } from "next/server";

export async function GET( request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });
  }

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/document/${id}`);
  const body = await result.json();

  if (!result.ok) {
    return NextResponse.json({ success: false, message: body.message || "Error fetching document" }, { status: result.status });
  }

  return NextResponse.json({ success: true, document: body.document });
}