import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita - N8N Indonesia Community",
  description: "Berita terbaru dan informasi seputar N8N Indonesia Community",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
