import { NextResponse } from 'next/server';
import {jwtDecode} from 'jwt-decode'; 
export function middleware(req) {
const token = req.cookies.get('token');
const pathname = req.nextUrl.pathname;
const isAdminRoute = pathname.startsWith('/admin')|| pathname.startsWith('/facture');
const isUserRoute = pathname.startsWith('/commendes')|| pathname.startsWith('/profil') || pathname.startsWith('/commander') || pathname.startsWith('/favoris');
const isAuthRoute = pathname.startsWith('/auth');
const isHomeRoute = pathname === '/';

 if (!token) {
  if ((isAdminRoute || isUserRoute) && !isAuthRoute) {
      return NextResponse.redirect(new URL('/auth', req.url));
  }
  return NextResponse.next();
}
try {
  const decodedToken = jwtDecode(token.value);
  const userRole = decodedToken.role;
  // ✅ 2. Vérification des rôles avant d'autoriser l'accès
  if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
  }
// ✅ 2. Vérification si amdin ne pas consulter les route user
if (isUserRoute && userRole === 'ADMIN') {
  return NextResponse.redirect(new URL('/admin', req.url));
}
if (isHomeRoute && userRole === 'ADMIN') {
  return NextResponse.redirect(new URL('/admin', req.url));
}

  if (isUserRoute && !token) {
      return NextResponse.redirect(new URL('/', req.url));
  }


  // ✅ 3. Si un utilisateur est connecté, il ne doit pas accéder à /auth/**
  if (isAuthRoute) {
      return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
} catch (error) {
  if (!isAuthRoute) {
      return NextResponse.redirect(new URL('/auth', req.url));
  }

  return NextResponse.next();
}

}


