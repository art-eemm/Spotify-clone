import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromToken } from "@/lib/auth";

//* AGREGAR LA CANCION QUE SE ESTA REPRODUCIONDO AL HISTORIAL DEL USUARIO
export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { cancion_id } = await req.json();

    if (!cancion_id) {
      return NextResponse.json(
        { error: "cancion_id requerido" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("historial_reproducciones")
      .insert({
        user_id: user.id,
        cancion_id
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Reproducción registrada"
    });

  } catch {
    return NextResponse.json(
      { error: "Error al registrar reproducción" },
      { status: 500 }
    );
  }
}