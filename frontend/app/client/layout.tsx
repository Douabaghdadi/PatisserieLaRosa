"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header />
      {/* Spacer pour compenser le header fixed */}
      <div style={{ height: "180px" }}></div>
      
      {/* Main Content */}
      <main style={{ minHeight: "calc(100vh - 400px)", backgroundColor: "#f5f7fa" }}>
        {children}
      </main>

      <Footer />
    </>
  );
}
