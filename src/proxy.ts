import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rotas que exigem login.
const PROTEGIDAS = ["/fim-de-ano"];

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;
  const protegida = PROTEGIDAS.some((p) => path.startsWith(p));

  // Sem Supabase configurado: só bloqueia as rotas protegidas.
  if (!url || !key) {
    return protegida
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() valida o login no servidor do Supabase (mais seguro que getSession).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (protegida && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (path === "/login" && user) {
    return NextResponse.redirect(new URL("/fim-de-ano", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|ico)$).*)"],
};
