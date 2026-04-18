export async function POST(req) {
  try {
    const body = await req.json();
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      return Response.json(
        { success: false, message: "Missing GOOGLE_SCRIPT_URL" },
        { status: 500 }
      );
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return Response.json({
      success: response.ok,
      scriptUrl,
      googleScriptResponse: data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message || "Submission failed",
      },
      { status: 500 }
    );
  }
}