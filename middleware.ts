// Middleware that checks if the user is authenticated/authorized. If if they aren't, they will be redirected to the login page. Otherwise, continue.
export { default } from "next-auth/middleware"

export const config = { matcher: ["/settings/:path*","/api/user/:path*"] }

/*
To include all dashboard nested routes (sub pages like /dashboard/settings, /dashboard/profile) you can pass matcher: "/dashboard/:path*" to config.

For other patterns check out the Next.js Middleware documentation.
https://nextjs.org/docs/advanced-features/middleware#matcher
*/