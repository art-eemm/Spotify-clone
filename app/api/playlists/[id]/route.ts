import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromToken } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUserFromToken(req);

    if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { nombre } = await req.json();

    const { data, error } = await supabaseAdmin
        .from("playlists")
        .update({ nombre })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

//* ELIMINAR PLAYLIST
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUserFromToken(req);

    if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { error } = await supabaseAdmin
        .from("playlists")
        .update({ estatus: 0 })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Playlist eliminada" });
}