import React from "react";
// import { Twitter } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Jenkins",
    handle: "@sarah_dev",
    quote:
      "Setup was insanely fast. I dropped in the SDK and had real logs showing up before my coffee got cold.",
    initials: "SJ",
    avatar: "https://i.pravatar.cc/160?img=12",
  },
  {
    name: "Mike Chen",
    handle: "@mike_builds",
    quote:
      "OneMinute Logs saved me hours of debugging on launch day. I finally understood what my API was doing.",
    initials: "MC",
    avatar: "https://i.pravatar.cc/160?img=15",
  },
  {
    name: "David Ross",
    handle: "@dross_stack",
    quote:
      "I didn't need to learn a new tool. The UI feels familiar, and the defaults just make sense.",
    initials: "DR",
    avatar: "https://i.pravatar.cc/160?img=20",
  },
  {
    name: "Alex Rivera",
    handle: "@arivera_ui",
    quote:
      "The live tail feature is a game changer. Watching logs stream in real-time makes debugging so much easier.",
    initials: "AR",
    avatar: "https://i.pravatar.cc/160?img=28",
  },
  {
    name: "Emily Zhang",
    handle: "@ezhang_code",
    quote:
      "Finally, a logging tool that doesn't require a PhD to configure. It just works.",
    initials: "EZ",
    avatar: "https://i.pravatar.cc/160?img=5",
  },
  {
    name: "James Wilson",
    handle: "@jwilson_backend",
    quote:
      "The search speed is incredible. I can find exactly what I'm looking for in milliseconds.",
    initials: "JW",
    avatar: "https://i.pravatar.cc/160?img=33",
  },
  {
    name: "Lisa Patel",
    handle: "@lpatel_cloud",
    quote:
      "Pricing is super transparent. No hidden fees or surprise bills at the end of the month.",
    initials: "LP",
    avatar: "https://i.pravatar.cc/160?img=8",
  },
  {
    name: "Tom Baker",
    handle: "@tbaker_ops",
    quote:
      "We switched from ELK and haven't looked back. The simplicity is refreshing.",
    initials: "TB",
    avatar: "https://i.pravatar.cc/160?img=41",
  },
];

export function LandingTestimonials() {
  const firstRow = testimonials.slice(0, testimonials.length / 2);
  const secondRow = testimonials.slice(testimonials.length / 2);

  return (
    <section className="border-b border-slate-900/80 bg-slate-950 overflow-hidden">
      <div className="py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50 text-center mb-8 md:mb-16 px-4">
          Developers who ship fast love OneMinute Logs.
        </h2>

        <div className="group relative flex flex-col gap-6 mask-linear-fade w-[95%] md:w-[calc(100%-8rem)] mx-auto">
          {/* First Row - Left to Right */}
          <div className="flex overflow-hidden [--gap:1rem] md:[--gap:1.5rem] gap-(--gap)">
            <div className="flex shrink-0 justify-around gap-(--gap) animate-marquee animation-duration-[80s] flex-row group-hover:paused">
              {[...firstRow, ...firstRow].map((testimonial, i) => (
                <TestimonialCard key={i} testimonial={testimonial} />
              ))}
            </div>
            <div
              className="flex shrink-0 justify-around gap-(--gap) animate-marquee animation-duration-[80s] flex-row group-hover:paused"
              aria-hidden="true"
            >
              {[...firstRow, ...firstRow].map((testimonial, i) => (
                <TestimonialCard key={i} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left (Reverse) */}
          <div className="flex overflow-hidden [--gap:1rem] md:[--gap:1.5rem] gap-(--gap)">
            <div className="flex shrink-0 justify-around gap-(--gap) animate-marquee-reverse animation-duration-[80s] flex-row group-hover:paused">
              {[...secondRow, ...secondRow].map((testimonial, i) => (
                <TestimonialCard key={i} testimonial={testimonial} />
              ))}
            </div>
            <div
              className="flex shrink-0 justify-around gap-(--gap) animate-marquee-reverse animation-duration-[80s] flex-row group-hover:paused"
              aria-hidden="true"
            >
              {[...secondRow, ...secondRow].map((testimonial, i) => (
                <TestimonialCard key={i} testimonial={testimonial} />
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-slate-950"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-slate-950"></div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  return (
    <div className="w-87.5 h-50 shrink-0 rounded-xl border border-slate-800 bg-slate-950/50 p-6 hover:border-slate-700 transition-colors duration-300 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-700">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">
              {testimonial.name}
            </div>
            <div className="text-xs text-slate-500">{testimonial.handle}</div>
          </div>
        </div>
        {/* <Twitter className="h-4 w-4 text-slate-600" /> */}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        {testimonial.quote}
      </p>
    </div>
  );
}
