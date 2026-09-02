// import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#020202] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-125 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-100">
        {/* <SignIn
          signUpUrl="/sign-up"
          appearance={{
            variables: {
              colorPrimary: "#2DF2A6",
              colorBackground: "#0A0A0A",
              borderRadius: "0.75rem",
            },
            elements: {
              rootBox: "w-full",
              card: "bg-[#0A0A0A]/50 backdrop-blur-xl border border-white/5 shadow-2xl p-8 rounded-3xl",
              headerTitle: "text-xl font-bold tracking-tight !text-white",
              headerSubtitle: "text-sm !text-neutral-400",
              formFieldLabel:
                "text-xs font-medium !text-neutral-400 uppercase tracking-wide",
              formFieldInput:
                "!bg-white/5 !border-white/5 !text-white placeholder:!text-neutral-500 focus:!border-[#2DF2A6]/50 focus:!ring-[#2DF2A6]/20 transition-all duration-200 h-10",
              socialButtonsBlockButton:
                "!bg-white/5 !border-white/5 !text-neutral-300 hover:!bg-white/10 hover:!text-white transition-all duration-200 h-10",
              socialButtonsBlockButtonText: "font-medium text-sm",
              dividerLine: "!bg-white/10",
              dividerText:
                "!text-neutral-500 text-xs font-medium uppercase tracking-wider !bg-[#0A0A0A]",
              formButtonPrimary:
                "opacity-90 !bg-[#2DF2A6] hover:opacity-100 !text-black font-bold shadow-[0_0_20px_rgba(45,242,166,0.15)] hover:shadow-[0_0_30px_rgba(45,242,166,0.3)] transition-all duration-200 h-10",
              footerActionLink:
                "!text-[#2DF2A6] hover:!text-[#22c55e] font-medium",
              formFieldAction:
                "!text-[#2DF2A6] hover:!text-[#22c55e] font-medium text-xs",
            },
          }}
        /> */}
      </div>
    </div>
  );
}
