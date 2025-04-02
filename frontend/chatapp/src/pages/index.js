import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFileContext } from "@/context/Auth";

export default function Home() {
  const router = useRouter();
  const { user, role } = useFileContext();

  useEffect(() => {
    if(role=="student"){
      router.push("/posts");
    }
    else{
      router.push("/recruiterdashboard");
    }
  }, [router]);

  return null; 
}