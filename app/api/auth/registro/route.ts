import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request){
    try{
        const body = await request.json();

        const { email, password, nombre } = body;
        //* VALIDACION DE INFORMACION
        if(!email || !password || !nombre){
            return NextResponse.json(
                {error: "Los campos son obligatorios"}, 
                {status: 400}
            );
        }

        //* CREAMOS USUARIO EN auth.users DE SUPABASE
        const { data, error } = await supabaseAdmin.auth.signUp({
            email, 
            password
        });

        if ( error || !data.user){
            return NextResponse.json(
                {error: error?.message || "Error al registrar usuario"},
                {status: 400}
            );
        }

        //* OBTENEMOS EL ID DEL USUARIO CREADO
        const userId = data.user.id;

        //* INSERTAMOS EN LA TABLA DE PERFIL
        const { error: profileError } = await supabaseAdmin.from("perfiles").insert({
            id: userId,
            nombre: nombre,
            role: "user"
        });
        if(profileError){
            return NextResponse.json(
                {error: profileError.message},
                { status: 400}
            );
        }

        //* MENSAJE DE EXITO
        return NextResponse.json(
            {message: "Usuario registrado correctamente", user: data.user},
            {status: 200}
        );
    }catch(error){
        return NextResponse.json(
            {error: "Error interno del servidor"}, 
            {status: 500}
        );
    }
}