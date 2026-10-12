import { createFileRoute } from "@tanstack/react-router";
import { DealDemo } from "@/components/deal-demo";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <DealDemo />;
}
