import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "../Components/Nav";
import Layout from "../Components/Layout";

export default function Home() {

  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-blue-900">
        Hello, { session?.user?.name }
      </div>
    </Layout>
  )
}
