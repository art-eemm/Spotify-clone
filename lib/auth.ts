import { createClient } from "@supabase/supabase-js";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "./supabaseClient";

export async function getUserFromToken(request: Request){
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if(!token) return null;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        }
    );

    const { data, error } = await supabase.auth.getUser();
    if (error) return null;

    return data.user;
}

export async function isAdmin( userId: string){
    const { data } = await supabaseClient
        .from ('perfiles')
        .select('role')
        .eq('id', userId)
        .single();

    return data?.role === 'admin';
}