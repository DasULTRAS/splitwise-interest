import SecuredContext from "@/context/SecuredContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SecuredContext>{children}</SecuredContext>
    </>
  );
}
