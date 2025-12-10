import { NextResponse } from "next/server";

interface DocumentResponse {
  documents: any[];
}

export async function GET() {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents`, { next: { revalidate: 1800 } });

    if (!result.ok) {
      throw new Error(`Failed to fetch documents: ${result.statusText}`);
    }

    const body: DocumentResponse = await result.json();

    if (!body.documents) {
      throw new Error("No documents found in the response.");
    }

    return NextResponse.json({ success: "true", documents: body.documents });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching documents:", errorMessage);

    return NextResponse.json({ success: "false", error: errorMessage }, { status: 500 }
  )}
}