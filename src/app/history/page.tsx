import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistorySection } from "@/components/HistorySection";

export const metadata = {
  title: "History — QRnator",
  description: "Your saved QR codes.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HistorySection />
      </main>
      <Footer />
    </>
  );
}
