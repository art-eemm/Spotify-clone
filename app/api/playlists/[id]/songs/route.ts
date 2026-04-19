import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromToken } from "@/lib/auth";

//* AGREGAR CANCION A PLAYLIST
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUserFromToken(req);

    if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { cancion_id } = await req.json();

    const { data, error } = await supabaseAdmin
    .from("playlist_cancion")
    .insert([{
        playlist_id: id,
        cancion_id
    }])
    .select()
    .single();

    if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

//* VER CANCIONES DE PLAYLIST
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("playlist_cancion")
    .select(`
      canciones (
        id,
        titulo,
        url_audio,
        portada
      )
    `)
    .eq("playlist_id", id)
    .eq("estatus", 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

//* ELIMINAR CANCION DE PLAYLIST
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  const { cancion_id } = await req.json();

  const { error } = await supabaseAdmin
    .from("playlist_cancion")
    .update({ estatus: 0 })
    .eq("playlist_id", id)
    .eq("cancion_id", cancion_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Canción eliminada" });
}