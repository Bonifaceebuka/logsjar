"use client";

import React from "react";
import { Zap, Search, Eye, FileJson } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function LandingFeatures() {
  return (
    <>
      {/* Founder's Story */}
      <section id="story" className="border-b border-slate-900/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs font-medium tracking-wide text-sky-400 uppercase mb-4">
              Why OneMinute Logs exists
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50 mb-6">
              Logging shouldn&apos;t feel like a whole other job.
            </h2>
            <div className="space-y-5 text-sm sm:text-base text-slate-300 leading-relaxed">
              <p>
                Most devs don&apos;t have time to babysit a logging stack. ELK,
                random dashboards, YAML jungles — all just to answer one
                question:{" "}
                <span className="text-slate-100 font-medium">
                  What went wrong?
                </span>
              </p>
              <p>
                If you&apos;re shipping fast — junior, indie, side-project, or a
                small team — you don&apos;t want to spend days wiring logs. You
                just want errors, requests, and latency in one place, instantly.
              </p>
              <p>OneMinute Logs removes all the overhead.</p>
              <p>
                Drop in a small SDK, deploy, and your logs start streaming in
                under a minute. No servers. No cluster tuning. No 40-page docs
                before anything works.
              </p>
              <p>
                It’s logging that just works, instead of becoming another system
                you have to maintain.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-slate-900/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
                Everything you need. Nothing you don&apos;t.
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-slate-300">
              Simple tools that help you see what your app is doing, without
              learning a new system.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.article
              variants={itemVariants}
              className="rounded-2xl border border-slate-800 bg-slate-950/50 overflow-hidden flex flex-col hover:border-slate-700 transition-colors duration-300"
            >
              <div className="p-6 sm:p-8">
                <div className="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center mb-5">
                  <Zap className="text-sky-400 h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-50 mb-2">
                  Capture & Store Instantly
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Send JSON logs from your app, API, or background jobs without
                  schemas or migrations. We index everything automatically so
                  you can focus on shipping.
                </p>
              </div>
            </motion.article>

            <motion.article
              variants={itemVariants}
              className="rounded-2xl border border-slate-800 bg-slate-950/50 overflow-hidden flex flex-col hover:border-slate-700 transition-colors duration-300"
            >
              <div className="p-6 sm:p-8">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-5">
                  <Search
                    className="text-emerald-400 h-5 w-5"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-50 mb-2">
                  Search & Debug Live
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Find bugs in seconds with simple filters like{" "}
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300">
                    status:500
                  </code>
                  . Watch events stream in real-time with Live Tail to see
                  exactly what&apos;s happening.
                </p>
              </div>
            </motion.article>

            <motion.article
              variants={itemVariants}
              className="rounded-2xl border border-slate-800 bg-slate-950/50 overflow-hidden flex flex-col hover:border-slate-700 transition-colors duration-300"
            >
              <div className="p-6 sm:p-8">
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-5">
                  <Eye className="text-pink-400 h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-50 mb-2">
                  Live Log Stream
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Get a live stream of your log data directly in your
                  application. Build your own custom dashboard views without
                  needing to visit our website to check your logs.
                </p>
              </div>
            </motion.article>

            <motion.article
              variants={itemVariants}
              className="rounded-2xl border border-slate-800 bg-slate-950/50 overflow-hidden flex flex-col hover:border-slate-700 transition-colors duration-300"
            >
              <div className="p-6 sm:p-8">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-5">
                  <FileJson
                    className="text-cyan-400 h-5 w-5"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-50 mb-2">
                  Smart Alerts & Webhooks
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Never miss a critical error. Set up alerts for specific events
                  and receive instant notifications via webhooks. Track
                  application crashes before they happen.
                </p>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </section>
    </>
  );
}
