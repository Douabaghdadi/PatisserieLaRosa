"use client";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" />
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Raleway:wght@600;800&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/css/style.css" />
      <link rel="stylesheet" href="/css/custom.css" />
      <Header />
      {children}
      <Footer />
    </>
  );
}
