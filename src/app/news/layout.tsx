import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Hub",
  description: "A platform for creators",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
