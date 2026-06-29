import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScannerSection } from "@/components/ScannerSection";

export const metadata = {
  title: "QR Scanner — QRnator",
  description: "Scan a QR code with your camera or upload an image.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ScannerSection />
      </main>
      <Footer />
    </>
  );
}
