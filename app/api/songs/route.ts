import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import { getUserFromToken, isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* OBTENER CANCIONES
export async function GET(){
    const { data, error } = await supabaseClient
        .from('canciones')
        .select(`
            id,
            titulo,
            duracion,
            url_audio,
            portada,
            albums (
            titulo
            ),
            cancion_artista (
            artistas (
                nombre
            )
            ),
            cancion_genero (
            generos (
                nombre
            )
            )
        `);

    if ( error ){
        return NextResponse.json(
            { error: error.message},
            { status: 500 }
        );
    }
    return NextResponse.json(data);
}

//* CREAR CANCION
export async function POST(request: Request){
    try{
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

        const formData = await request.formData();
        //* OBTENER DATOS DE LA CANCION
        const titulo = formData.get("titulo") as string;
        const id_album = formData.get("album_id") as string | null;
        const duracion = Number(formData.get("duracion"));
        const audioFile = formData.get("audio") as File;
        const portada = formData.get("portada") as File | null;
        //* DATOS DE GENERO
        const id_genero = formData.get("genero") as string;
        //*DATOS DE ARTISTA
        const id_artista = formData.get("artista") as string;


        //* VALIDACION DE DATOS
        if(!titulo || !duracion || !audioFile || !id_genero || !id_artista){
            return NextResponse.json(
                { error: "Algunos datos son requeridos" },
                { status: 400 }
            );
        }

        //* SUBIR AUDIO A SUPABASE STORAGE
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const cleanName = sanitizeFileName(audioFile.name);
        const filePath = `canciones/${Date.now()}_${cleanName}`;

        const { error: uploadError } = await supabaseAdmin
        .storage.from("songs")
        .upload(filePath, buffer, {
            contentType: audioFile.type,
        });

        if(uploadError){
            return NextResponse.json(
                { error: uploadError.message },
                { status: 500 }
            );
        }

        //* OBTENER URL PUBLICA
        const { data: publicUrl } = supabaseAdmin.storage
        .from("songs")
        .getPublicUrl(filePath);

        const url_audio = publicUrl.publicUrl;

        let portadaUrl: string | null = null;

        if (portada && portada.size > 0) {
            const arrayBuffer = await portada.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const cleanImageName = sanitizeFileName(portada.name);
            const imagePath = `portadas/${Date.now()}_${cleanImageName}`;

            const { error: uploadImageError } = await supabaseAdmin.storage
                .from("portadas")
                .upload(imagePath, buffer, {
                    contentType: portada.type,
                });

            if (uploadImageError) {
                return NextResponse.json(
                    { error: uploadImageError.message },
                    { status: 500 }
                );
            }

            const { data: publicImageUrl } = supabaseAdmin.storage
                .from("images")
                .getPublicUrl(imagePath);

            portadaUrl = publicImageUrl.publicUrl;
        }

        //* GUARDAMOS EN BASE DE DATOS LA CANCION
        const { data: songData, error: songError } = await supabaseAdmin
        .from("canciones")
        .insert([{
            titulo: titulo,
            album_id: id_album || null,
            duracion: duracion,
            url_audio: url_audio,
            portada: portadaUrl
        }])
        .select()
        .single();

        if(songError){
            return NextResponse.json(
                { error: songError.message },
                { status: 500 }
            );
        }

        const songId = songData.id;

        //* GUARDAMOS EN TABLA CANCION_GENERO
        const { data: generoData, error: errorData } = await supabaseAdmin
        .from("cancion_genero")
        .insert([{
            cancion_id: songId,
            genero_id: id_genero
        }])
        .select()
        .single();

        if(errorData){
            return NextResponse.json(
                { error: errorData.message },
                { status: 500 }
            );
        }

        //* GUARDAMOS EN TABLA CANCION_ARTISTA
        const { data: artistaData, error: artistaError } = await supabaseAdmin
        .from("cancion_artista")
        .insert([{
            cancion_id: songId,
            artista_id: id_artista
        }])
        .select()
        .single();

        if(artistaError){
            return NextResponse.json(
                { error: artistaError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Canción creada exitosamente", song: songData },
            { status: 201 }
        );
    }catch(error){
        return NextResponse.json(
            { error: 'Error al crear la canción' },
            { status: 500 }
        );
    }

}

//* FUNCION PARA SANITIZAR NOMBRES DE ARCHIVOS
function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD") // quita acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_") // espacios → _
    .replace(/[^a-zA-Z0-9._-]/g, ""); // solo caracteres seguros
}