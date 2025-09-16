'use client';
interface ProtectedLayoutProps {
  children: React.ReactNode;
};

import { useCurrentUser } from "@/hooks/use-current-user";

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {


  const user = useCurrentUser();


  return (
    <>
      <div className="bg-black h-full">
        {children}
      </div>
    </>
  );
}

export default ProtectedLayout;