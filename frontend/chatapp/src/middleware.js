import { NextResponse } from 'next/server';
import { jwtVerify } from "jose";

export async function middleware(req) {
    // const token = req?.cookies?.get("token")?.value;

    const token = req?.cookies?.get("token"); 
    // const token= localStorage.getItem("token");
    console.log("Token is ", token);

    const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || "http://placementportal-eta.vercel.app/login";
    const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || "http://placementportal-eta.vercel.app/";
    const recruiterUrl= "http://placementportal-eta.vercel.app/recruiterdashboard"
    const studentUrl="http://placementportal-eta.vercel.app/posts"

    if (!token) {
        if (
            req?.nextUrl?.pathname !== '/login' && 
            req?.nextUrl?.pathname !== '/register'      
        ) {
            return NextResponse.redirect(loginUrl);
        }
    } else {
        if (req?.nextUrl?.pathname === '/login' || req?.nextUrl?.pathname === '/register') {
            return NextResponse.redirect(homeUrl);
        }
        try{
            const secretKey = new TextEncoder().encode("shhh");

            const { payload } = await jwtVerify(token?.value, secretKey);

            const role = payload.role

            const studentProtectedRoutes = ["/post/:path*", "/posts"];
            const recruiterProtectedRoutes = ["/createpost", "/recruiterpost", "/recruiterdashboard"];

            if (role === "student" && recruiterProtectedRoutes.includes(req.nextUrl.pathname)) {
                return NextResponse.redirect(studentUrl);
            }

            if (role === "recruiter" && studentProtectedRoutes.includes(req.nextUrl.pathname)) {
                return NextResponse.redirect(recruiterUrl);
            }
        }
        catch(err){
            const loginurl= "http://placementportal-eta.vercel.app/login"
            console.error("JWT verification failed:", err);
            return NextResponse.redirect(loginurl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/posts',
        '/createpost',
        '/profile',
        '/recruiterdashboard',
        '/query',
        '/contact',
        '/chat',
        '/post/:path*' ,
        '/recruiterpost/:path*'
    ],
};
