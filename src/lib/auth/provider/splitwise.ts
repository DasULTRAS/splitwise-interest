import { JWT } from "next-auth/jwt";
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/index";

// https://authjs.dev/guides/configuring-oauth-providers?framework=next-js#adding-a-new-built-in-provider

const SPLITWISE_API_URL = "https://secure.splitwise.com";

export interface SplitwiseUser {
  id: string;
  first_name: string;
  last_name: null | string;
  email: string;
  picture: {
    small: string;
    medium: string;
    large: string;
  };
  custom_picture: boolean;
  registration_status: "confirmed" | "dummy" | "invited";
  locale: string;
  country_code: string;
  date_format: string;
  default_currency: string;
  notifications_read: string;
  notifications_count: number;
  notifications: unknown[];
}

export default function Splitwise(options: OAuthUserConfig<SplitwiseUser>): OAuthConfig<SplitwiseUser> {
  return {
    id: "splitwise",
    name: "Splitwise",
    type: "oauth",
    authorization: {
      url: `${SPLITWISE_API_URL}/oauth/authorize`,
      params: { scope: "", client_id: options.clientId },
    },
    token: {
      url: `${SPLITWISE_API_URL}/oauth/token`,
      params: {
        grant_type: "authorization_code",
        client_id: options.clientId,
        client_secret: options.clientSecret,
      },
    },
    userinfo: {
      url: `${SPLITWISE_API_URL}/api/v3.0/get_current_user`,
      async request({ tokens, provider }: { tokens: JWT; provider: OAuthConfig<SplitwiseUser> }) {
        const res = await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const { user } = await res.json();

        return user;
      },
    },
    async profile(profile) {
      const name = profile.first_name + (profile.last_name ? " " + profile.last_name : "");

      return {
        id: profile.id,
        email: profile.email,
        name,
        image: profile.picture.medium ?? profile.picture.large ?? profile.picture.small,
      };
    },
    checks: ["state"],
  };
}
