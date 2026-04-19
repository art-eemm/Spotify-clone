import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromToken } from "@/lib/auth";

//* OBTENER PLAYLISTS DEL USUARIO
export async function GET(request: Request) {
  const user = await getUserFromToken(request);

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("playlists")
    .select("*")
    .eq("user_id", user.id)
    .eq("estatus", 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

//* CREAR PLAYLIST
export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { nombre } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "Nombre requerido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("playlists")
      .insert([{
        user_id: user.id,
        nombre
      }])
      .select()
      .single();

    if (error) {
        return NextResponse.json(
            { error: error.message }, 
            { status: 500 }
        );
    }

    return NextResponse.json({ playlist: data });

  } catch(error) {
    return NextResponse.json(
        { error: "Error al crear la playlist" },
      { status: 500 }
    );
  }
}