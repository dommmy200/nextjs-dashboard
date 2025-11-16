// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
// import Credentials from 'next-auth/providers/credentials';
// import { z } from 'zod';
// import type { User } from '@/app/lib/definitions';
// import bcrypt from 'bcrypt';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function getUser(email: string): Promise<User | undefined> {
//     try {
//         const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
//         return user[0];
//     } catch (error) {
//         console.error('Failed to fetch user:', error);
//         throw new Error("Failed to fetch user.");
//     }
// }
 
// export const { auth, signIn, signOut } = NextAuth({
//     ...authConfig,
//     providers: [
//         Credentials({
//             async authorize(credentials) {
//                 const parsedCredentials = z
//                     .object({ email: z.string().email(), password: z.string().min(6) })
//                     .safeParse(credentials);
//                 if (parsedCredentials.success) {
//                     const { email, password } = parsedCredentials.data;
//                     const user = await getUser(email);
//                     if(!user) return null;
//                     const passwordsMatch = await bcrypt.compare(password, user.password);

//                     if (passwordsMatch) return user;
//                 }

//                 console.log('Invalid credentials')
//                 return null;
//             },
//         })
//     ],
// });
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

// NOTE: This file uses POSTGRES_URL which you confirmed earlier.
// If the database functions still fail after this build fix, we MUST re-examine Vercel logs
// for connection errors, as the variable name is correct here.
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
        return user[0];
    } catch (error) {
        // Logging the full error in a server function is crucial for debugging
        console.error('Failed to fetch user in auth.ts:', error);
        throw new Error("Failed to fetch user.");
    }
}
 
// CRITICAL CHANGE: We added 'handlers' to the export list.
export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if(!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials')
                return null;
            },
        })
    ],
});