import BypassForm from "@/components/BypassForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-2xl glass-panel flex items-center justify-center mb-6 shadow-2xl overflow-hidden">
          <Image src="/mtv.png" alt="MTV Logo" width={64} height={64} className="object-contain w-full h-full" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent pb-2">
          Medal Bypass
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Bypass the premium requirement and download your favorite Medal clips without watermarks.
        </p>
      </div>

      <div className="w-full glass-panel rounded-2xl p-6 md:p-8">
        <BypassForm />
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>A simple tool for a watermark-free experience.</p>
      </footer>
    </main>
  );
}
