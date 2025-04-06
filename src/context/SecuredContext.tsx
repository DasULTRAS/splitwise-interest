import { SignIn } from "@/components/buttons/AuthComponents";
import UnauthorizedPage from "@/components/ui/unauthorisedPage";
import { auth } from "@/lib/auth";

export default async function SecuredContext({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user)
    return (
      <UnauthorizedPage href="/settings/splitwise">
        <p>Please click </p>
        <SignIn provider="splitwise" className="underline hover:cursor-pointer">
          <b>here</b>
        </SignIn>
        <p> to set up your Splitwise connection first.</p>
      </UnauthorizedPage>
    );

  return <>{children}</>;
}
