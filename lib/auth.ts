import { AuthOptions } from "next-auth";
import CredentailsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compare } from "bcrypt";
import { User } from "@/app/generated/prisma/client";

export const authOptions: AuthOptions = {
  providers: [
    CredentailsProvider({
      name: "Credentails",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jhondoe@example.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "enter your password",
        },
      },

      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // lookup user in db
          const dbUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!dbUser) {
            return null;
          }

          // if user exists
          const isPasswordValid = await compare(
            credentials.password,
            dbUser.password_hash,
          );
          if (!isPasswordValid) return null;

          return {
            id: dbUser.id,
            firstname: dbUser.firstname,
            lastname: dbUser.lastname,
          };
        } catch (err) {
          console.log("Error authorization: ", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as User;

        return {
          ...token,
          id: u.id,
          firstname: u.firstname,
          lastname: u.lastname,
        };
      }

      return token;
    },

    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          firstname: token.firstname,
          lastname: token.lastname,
        },
      };
    },
  },
};
