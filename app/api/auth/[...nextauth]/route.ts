// import NextAuth from "next-auth";
// import { authConfig } from "@/auth.config";
// import Credentials from "next-auth/providers/credentials";
// import { z } from "zod";
// import bcrypt from "bcrypt";
// import postgres from "postgres";
// import type { User } from "@/app/lib/definitions";

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function getUser(email: string): Promise<User | undefined> {
//   const result = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
//   return result[0];
// }

// const handler = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         const parsed = z
//           .object({
//             email: z.string().email(),
//             password: z.string().min(6),
//           })
//           .safeParse(credentials);

//         if (!parsed.success) return null;

//         const { email, password } = parsed.data;
//         const user = await getUser(email);
//         if (!user) return null;

//         const correct = await bcrypt.compare(password, user.password);
//         return correct ? user : null;
//       },
//     }),
//   ],
// });

// export { handler as GET, handler as POST };

// app/api/auth/[...nextauth]/route.ts
// import { handlers } from "@/auth";

// export const { GET, POST } = handlers;

