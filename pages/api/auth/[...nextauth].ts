import NextAuth from "next-auth"

const samlLoginUrl = process.env.BOXYHQ_SAML_JACKSON_URL || "http://localhost:5225";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    {
      id: "boxyhq",
      name: "BoxyHQ SAML Jackson",
      type: "oauth",
      version: "2.0",
      checks: ["pkce", "state"],
      authorization: {
        url: `${samlLoginUrl}/api/oauth/authorize`,
        params: {
          scope: "",
          response_type: "code",
          provider: "saml",
        },
      },
      token: {
        url: `${samlLoginUrl}/api/oauth/token`,
        params: { grant_type: "authorization_code" },
      },
      userinfo: `${samlLoginUrl}/api/oauth/userinfo`,
      profile: (profile) => {
        return {
          id: profile.id || "",
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
          email_verified: true,
        };
      },
      options: {
        clientId: `tenant=boxyhq.com&product=${process.env.BOXYHQ_PRODUCT || "next-auth-demo"}`,
        clientSecret: "dummy",
      },
    },
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
