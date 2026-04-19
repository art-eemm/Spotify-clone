import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import { getUserFromToken, isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* OBTENER LOS ARTISTAS
export async function GET(){
    const { data, error } = await supabaseClient
        .from('artistas')
        .select('*');

        if(error){
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }
    return NextResponse.json(data);
}

//* CREAR LOS ARTISTAS
export async function POST(request: Request){
    //* VALIDACION DE USUARIO
    const user = await getUserFromToken(request);
    if(!user){
        return NextResponse.json(
            { error: "No autorizado" },
            { status: 403 }
        );
    }

    const admin = await isAdmin(user.id);
    if(!admin){
        return NextResponse.json(
            { error: "No autorizado" },
            { status: 403 }
        );
    }

    //* OBTENER DATOS DEL ARTISTA
    const body = await request.json();
    const { nombre } = body;
    //* VALIDACION DE DATOS
    if(!nombre){
        return NextResponse.json(
            { error: "El nombre del artista es requerido" },
            { status: 400 }
        );
    }

    //* INSERTAR ARTISTA EN LA BASE DE DATOS
    const { data, error } = await supabaseAdmin
        .from('artistas')
        .insert({ nombre })
        .select()
        .single();

    if(error){
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
    return NextResponse.json(data);
}

//* ACTUALIZAR ARTISTA

//* ELIMINAR ARTISTA