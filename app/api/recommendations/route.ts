import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromToken } from "@/lib/auth";
import { groq } from "@/lib/groq";

//* OBTENER RECOMENDACIONES DE CANCIONES BASADAS EN EL HISTORIAL DE REPRODUCCIONES DEL USUARIO
export async function GET(req: Request) {
    try {
        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        //* OBTENER HISTORIAL DE REPRODUCCIONES DEL USUARIO
        const { data: historial } = await supabaseAdmin
            .from("historial_reproducciones")
            .select(`
            canciones (
                cancion_genero (
                generos (nombre)
                )
            )
            `)
            .eq("user_id", user.id);

        if (!historial || historial.length === 0) {
            return NextResponse.json({ recomendaciones: [] });
        }

        //* OBTENEMOS LOS GÉNEROS MÁS REPRODUCIDOS POR EL USUARIO
        const generosSet = new Set<string>();

        historial.forEach((item: unknown) => {
            const h = item as any;

            h.canciones.cancion_genero.forEach((g: any) => {
                generosSet.add(g.generos.nombre);
            });
        });

        const generosUsuario = Array.from(generosSet);

        //* HACEMOS USO DE LA IA PARA OBTENER MÁS GÉNEROS SIMILARES
        const completion = await groq.chat.completions.create({
            model: "llama3-70b-8192",
            messages: [
                {
                    role: "system",
                    content: `
Eres un recomendador musical.
Dado un listado de géneros, responde SOLO con un JSON así:
{
  "generos": ["House", "Techno"]
}
NO expliques nada.
                    `,
                },
                {
                    role: "user",
                    content: `Generos del usuario: ${generosUsuario.join(", ")}`,
                },
            ],
        });

        const text = completion.choices[0]?.message?.content || "{}";

        let generosIA: string[] = [];

        try {
            const parsed = JSON.parse(text);
            generosIA = parsed.generos || [];
        } catch {
            generosIA = [];
        }

        //* COMBINAMOS GÉNEROS
        const generosFinal = [...new Set([...generosUsuario, ...generosIA])];

        //* OBTENEMOS CANCIONES
        const { data: canciones } = await supabaseAdmin
            .from("canciones")
            .select(`
            id,
            titulo,
            url_audio,
            portada,
            cancion_genero (
                generos (nombre)
            )
            `)
            .eq("estado", true);

        //* FILTRADO
        const recomendaciones = canciones
            ?.filter((song: unknown) => {
                const s = song as any;

                const songGeneros = s.cancion_genero.map(
                    (g: any) => g.generos.nombre
                );

                return generosFinal.some(g => songGeneros.includes(g));
            })
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        return NextResponse.json({
            generos_usuario: generosUsuario,
            generos_ia: generosIA,
            recomendaciones
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Error en recomendaciones" },
            { status: 500 }
        );
    }
}