import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import { getUserFromToken, isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* OBTENER LOS GENEROS
export async function GET(){
    const { data, error } = await supabaseClient
        .from('generos')
        .select('*');

        if(error){
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }
    return NextResponse.json(data);
}

//* CREAR LOS GENEROS
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

    //* OBTENER DATOS DEL GENERO
    const body = await request.json();
    const { nombre } = body;
    //* VALIDACION DE DATOS
    if(!nombre){
        return NextResponse.json(
            { error: "El nombre del genero es requerido" },
            { status: 400 }
        );
    }

    //* INSERTAR GENERO EN LA BASE DE DATOS
    const { data, error } = await supabaseAdmin
        .from('generos')
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

//* ACTUALIZAR GENERO


//* ELIMINAR GENERO