export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/faculty", "/faculty/studentinfo"],
};

// import { default as NextAuthMiddleware } from 'next-auth/middleware';

// export { NextAuthMiddleware as default };

// export const config = {
//   matcher: ['/student/profile', '/student/studentDashboard','/student/clubs'],
// };
