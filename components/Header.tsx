import Link from "next/link";
import React from "react";

export const Header: React.FC = () => (
  <header className="hero-gradient sticky top-0 z-10">
    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-extrabold ">
        Crypto Home
      </Link>
    </div>
  </header>
);
