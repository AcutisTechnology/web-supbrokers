export async function POST(request: Request) {
  try {
    const body = await request.json();

    const upstreamResponse = await fetch("https://www.mybroker.com.br/api/calculator/simulation", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await upstreamResponse.text();

    return new Response(text, {
      status: upstreamResponse.status,
      headers: {
        "content-type": upstreamResponse.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao consultar a simulação.";
    return Response.json({ message }, { status: 400 });
  }
}

