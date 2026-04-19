import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
//* El signo '!' le indica a typescript que la variable si existe
//* SE USA EN FRONTEND LOGIN, REGISTRO, CONSULTAS