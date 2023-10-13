// Middleware that checks if the user is authenticated/authorized. If if they aren't, they will be redirected to the login page. Otherwise, continue.
export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard"] }