import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("=== API ROUTE DEBUG START ===");
    console.log("API Route: Upload request received");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("API Route: File received:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    });

    if (!file) {
      console.log("API Route: No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Security validation
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      console.log("API Route: Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      console.log("API Route: File too large:", file.size);
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    console.log("API Route: Supabase client created");

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    console.log("API Route: Auth check:", {
      hasSession: !!session,
      userId: session?.user?.id,
      authError: authError?.message,
    });

    if (!session) {
      console.log("API Route: No authenticated session");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Generate unique filename with user ID for better security
    const fileExt = file.name.split(".").pop();
    const fileName = `${session.user.id}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    console.log("API Route: Generated filename:", fileName);

    // Upload to Supabase Storage
    console.log("API Route: Starting upload to storage...");
    const { data, error } = await supabase.storage
      .from("workflow-preview")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("API Route: Upload error details:", {
        message: error.message,
        statusCode: error.statusCode,
        error: error,
      });
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("API Route: Upload successful:", data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("workflow-preview")
      .getPublicUrl(fileName);

    console.log("API Route: Public URL generated:", urlData.publicUrl);
    console.log("=== API ROUTE DEBUG END ===");

    return NextResponse.json({
      url: urlData.publicUrl,
      success: true,
    });
  } catch (error) {
    console.error("API Route: Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
