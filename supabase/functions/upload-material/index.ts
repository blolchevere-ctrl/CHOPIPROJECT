import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TEACHER_PASSWORD = "chopi2024";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    if (req.method === "POST") {
      const formData = await req.formData();
      const password = formData.get("password") as string;
      const courseId = formData.get("courseId") as string;
      const categoryId = formData.get("categoryId") as string;
      const title = formData.get("title") as string;
      const description = (formData.get("description") as string) || "";
      const price = parseInt(formData.get("price") as string, 10);
      const file = formData.get("file") as File;

      if (password !== TEACHER_PASSWORD) {
        return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!file || !courseId || !categoryId || !title) {
        return new Response(JSON.stringify({ error: "Faltan campos obligatorios" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const validPrices = [1, 2, 5];
      if (!validPrices.includes(price)) {
        return new Response(JSON.stringify({ error: "Precio inválido (debe ser 1, 2 o 5 soles)" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const fileName = `${courseId}/${categoryId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = fileName;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("materials")
        .upload(filePath, file, { contentType: file.type || "application/octet-stream" });

      if (uploadError) {
        return new Response(JSON.stringify({ error: "No se pudo subir el archivo: " + uploadError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: insertData, error: insertError } = await supabase
        .from("materials")
        .insert({
          course_id: courseId,
          category_id: categoryId,
          title,
          description,
          price,
          file_path: filePath,
          file_type: ext,
        })
        .select()
        .single();

      if (insertError) {
        return new Response(JSON.stringify({ error: "No se pudo guardar el registro: " + insertError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, material: insertData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const materialId = url.searchParams.get("id");
      const password = url.searchParams.get("password");

      if (password !== TEACHER_PASSWORD) {
        return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!materialId) {
        return new Response(JSON.stringify({ error: "Falta el ID del material" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: material, error: fetchError } = await supabase
        .from("materials")
        .select("file_path")
        .eq("id", materialId)
        .single();

      if (fetchError || !material) {
        return new Response(JSON.stringify({ error: "Material no encontrado" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: storageError } = await supabase.storage
        .from("materials")
        .remove([material.file_path]);

      const { error: deleteError } = await supabase
        .from("materials")
        .delete()
        .eq("id", materialId);

      if (deleteError) {
        return new Response(JSON.stringify({ error: "No se pudo eliminar: " + deleteError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Método no soportado" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
