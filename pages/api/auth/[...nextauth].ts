import NextAuth from "next-auth"
import BoxyHQSAMLProvider from "next-auth/providers/boxyhq-saml"

const samlLoginUrl =
  process.env.BOXYHQ_SAML_JACKSON_URL || "http://localhost:5225"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    BoxyHQSAMLProvider({
      issuer: samlLoginUrl,
      clientId: `tenant=boxyhq.com&product=${
        process.env.BOXYHQ_PRODUCT || "next-auth-demo"
      }`,
      clientSecret: "dummy",
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
})
