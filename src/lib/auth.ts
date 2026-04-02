import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, first_name, last_name, password_hash")
          .eq("email", email)
          .single();

        if (error || !user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: [user.first_name, user.last_name].filter(Boolean).join(" "),
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
