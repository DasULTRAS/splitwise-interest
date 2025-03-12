import UnauthorizedPage from "@/components/ui/unauthorisedPage";
import { auth } from "@/lib/auth";

export default async function SecuredContext({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user)
    return (
      <UnauthorizedPage href="/settings/splitwise">
        Please click <b>here</b> to set up your Splitwise connection first.
      </UnauthorizedPage>
    );

  return { children };
}
