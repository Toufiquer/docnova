/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 1 November, 2026
|-----------------------------------------
*/
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";

import { defaultCards, defaultData, departments, faqs, parseHomeCards, photos, services, type HomeData } from "./data";

const wrap = "mx-auto max-w-7xl px-5 sm:px-8 lg:px-12";
const label = "text-[11px] font-bold uppercase tracking-[.22em] text-[#087bb2]";
const heading = "text-3xl font-semibold leading-[1.12] tracking-[-.035em] text-[#07234c] sm:text-4xl lg:text-5xl";
const body = "text-sm leading-7 text-slate-600 sm:text-base";
const button =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-sm bg-amber-100 px-5 text-sm font-semibold text-amber-950 transition duration-700 hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087bb2]";
const imageClass =
  "h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] motion-reduce:transform-none";
const text = (value: unknown, fallback: string) => (typeof value === "string" && value.trim() ? value : fallback);
const padding = (value: unknown) => Math.min(300, Math.max(0, Number(value) || 0));

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay: reduced ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`group relative overflow-hidden bg-[#e5f3f6] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
        unoptimized
        className={imageClass}
      />
    </div>
  );
}
function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <Reveal>
      <p className={label}>{eyebrow}</p>
      <h2 className={`mt-4 ${heading}`}>{title}</h2>
      <p className={`mt-5 max-w-xl ${body}`}>{description}</p>
    </Reveal>
  );
}
function Action({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`${button} ${className}`}>
      {children}
      <Icon name="ArrowRight" aria-hidden="true" />
    </Link>
  );
}

export default function Query({ data }: { data?: Partial<HomeData> }) {
  const values = { ...defaultData, ...data };
  const saved = parseHomeCards(values.sectionsJson);
  // Older NexaMart defaults should never appear as healthcare content.
  const cards = defaultCards.map((fallback, index) => {
    const card = saved[index];
    return card && !/nexamart|electronics/i.test(`${card.title} ${card.description}`)
      ? { title: text(card.title, fallback.title), description: text(card.description, fallback.description) }
      : fallback;
  });
  const [area, setArea] = useState("");
  const [showGuidance, setShowGuidance] = useState(false);
  const heroImage =
    typeof values.imageUrl === "string" && values.imageUrl.trim() ? values.imageUrl.trim() : photos.hero;
  return (
    <div
      className="custom-parent-border overflow-hidden bg-[#fffdf9] text-[#07234c]"
      style={{ paddingInline: padding(values.paddingX), paddingBlock: padding(values.paddingY) }}
    >
      <section className="relative isolate overflow-hidden bg-[#e8f5f8]">
        <div className="absolute inset-0 lg:left-[42%]">
          <Photo src={heroImage} alt={text(values.imageAlt, defaultData.imageAlt)} className="h-full" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#edf8fa] via-[#edf8fa]/90 to-[#dff1f4]/30 lg:via-[#edf8fa]/50" />
        </div>
        <div className={`${wrap} relative grid min-h-[640px] items-center py-20 lg:min-h-[690px] lg:grid-cols-2`}>
          <Reveal className="max-w-2xl">
            <p className={label}>
              {/nexamart/i.test(values.eyebrow) ? defaultData.eyebrow : text(values.eyebrow, defaultData.eyebrow)}
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.03] tracking-[-.05em] text-[#06214c] sm:text-6xl lg:text-7xl">
              {/electronics|nexamart/i.test(values.title) ? defaultData.title : text(values.title, defaultData.title)}
            </h1>
            <p className={`mt-6 max-w-lg ${body}`}>
              {/electronics|nexamart/i.test(values.intro) ? defaultData.intro : text(values.intro, defaultData.intro)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Action href="#appointment">Book an Appointment</Action>
              <Link
                href="#services"
                className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-semibold text-[#07599a] underline-offset-4 transition duration-700 hover:underline"
              >
                Explore Services <Icon name="ArrowRight" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <Reveal
            delay={0.2}
            className="mt-12 max-w-xs self-end border border-white/80 bg-white/90 p-5 shadow-xl shadow-[#073f6a]/10 backdrop-blur-sm lg:ml-auto"
          >
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e4f5f5] text-[#087b9a]">
                <Icon name="Calendar" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold">Your next step, made simple.</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Ask about care and appointment options.</p>
                <Link
                  className="mt-3 inline-block text-sm font-semibold text-[#0869bd] underline-offset-4 hover:underline"
                  href="#appointment"
                >
                  Get started →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
        <div className={`${wrap} relative pb-5 text-[11px] text-slate-600`}>
          Representative photography throughout this page.
        </div>
      </section>

      <section id="services" className="bg-white py-20 sm:py-24">
        <div className={wrap}>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <SectionHeading eyebrow="01 / Our medical services" {...cards[0]} />
            <p className={`${body} lg:justify-self-end`}>
              Care begins with a conversation. Contact us to confirm current service and appointment availability.
            </p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-[#eadfca] bg-[#eadfca] sm:grid-cols-2 lg:grid-cols-3">
            {services.map(([title, description, icon], i) => (
              <Reveal
                key={title}
                delay={i * 0.04}
                className="group bg-white p-6 transition duration-700 hover:bg-[#f0f9fa]"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e5f5f7] text-[#007c9a] transition duration-700 group-hover:scale-110 motion-reduce:transform-none">
                    <Icon name={icon} aria-hidden="true" />
                  </span>
                  <span className="text-xs text-slate-400">0{i + 1}</span>
                </div>
                <h3 className="mt-7 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                <Link
                  href="/contact-us"
                  className="mt-5 inline-block text-sm font-semibold text-[#086bb4] underline-offset-4 hover:underline"
                >
                  Ask about this service →
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="departments" className="bg-[#f1f8f8] py-20 sm:py-24">
        <div className={wrap}>
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <SectionHeading eyebrow="02 / Medical departments" {...cards[1]} />
            <div className="grid gap-3 sm:grid-cols-2">
              {departments.map((name, i) => (
                <Link
                  key={name}
                  href="/contact-us"
                  className="group relative flex min-h-36 items-end overflow-hidden bg-[#06355b] p-5 text-white"
                >
                  <Image
                    src={
                      [
                        photos.consultation,
                        photos.specialist,
                        photos.care,
                        photos.doctor,
                        photos.hero,
                        photos.hospital,
                      ][i]
                    }
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 35vw"
                    unoptimized
                    className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-70 motion-reduce:transform-none"
                  />
                  <span className="relative flex w-full items-center justify-between text-lg font-semibold">
                    {name}
                    <Icon name="ArrowRight" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-5 text-xs text-slate-500">Please contact us to confirm specialty availability.</p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className={`${wrap} grid items-center gap-12 lg:grid-cols-2`}>
          <Reveal className="relative pb-12 pr-12">
            <Photo
              src={photos.care}
              alt="A healthcare professional reviewing medical images"
              className="aspect-[4/5] max-h-[580px]"
            />
            <div className="absolute bottom-0 right-0 max-w-[220px] bg-[#086ab4] p-6 text-white shadow-xl">
              <p className="text-3xl font-semibold">Care,</p>
              <p className="mt-1 text-sm leading-6 text-blue-50">with you at the heart of every conversation.</p>
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="03 / Why Docnova" {...cards[2]} />
            <div className="mt-8 space-y-5">
              {[
                ["Listening first", "A space to share your questions and concerns."],
                ["Clarity at every step", "Information to help you navigate your care."],
                ["A personal approach", "Healthcare experiences centered on people."],
              ].map(([title, desc], i) => (
                <Reveal key={title} delay={i * 0.08} className="flex gap-4 border-t border-[#eadfca] pt-5">
                  <span className="text-sm font-bold text-[#09a6aa]">0{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="doctors" className="bg-[#061f46] py-20 text-white sm:py-24">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center`}>
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#67d6d1]">04 / Meet our doctors</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">{cards[3].title}</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-blue-100">{cards[3].description}</p>
            <p className="mt-5 text-sm leading-6 text-blue-200">
              Doctor profiles and availability can be confirmed with our team.
            </p>
            <Action href="/contact-us" className="mt-7">
              Find a Doctor
            </Action>
          </Reveal>
          <div className="grid grid-cols-2 gap-3">
            <Photo src={photos.doctor} alt="Representative healthcare professional" className="aspect-[3/4]" />
            <Photo src={photos.specialist} alt="Representative surgical team" className="mt-10 aspect-[3/4]" />
          </div>
        </div>
      </section>

      <section id="appointment" className="bg-[#e9f6f7] py-20 sm:py-24">
        <div className={`${wrap} grid gap-0 lg:grid-cols-2`}>
          <Photo
            src={photos.consultation}
            alt="A healthcare professional consulting a patient"
            className="min-h-72 lg:min-h-[520px]"
          />
          <Reveal className="bg-white p-7 sm:p-10 lg:p-12">
            <SectionHeading eyebrow="05 / Appointment enquiries" {...cards[4]} />
            <div className="mt-7 border-t border-[#eadfca] pt-6">
              <label htmlFor="care-area" className="block text-sm font-semibold">
                What kind of care are you looking for?
              </label>
              <select
                id="care-area"
                value={area}
                onChange={(event) => {
                  setArea(event.target.value);
                  setShowGuidance(false);
                }}
                className="mt-2 min-h-12 w-full rounded-sm border border-[#eadfca] bg-white px-3 text-sm text-slate-700"
              >
                <option value="">Select an area</option>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
                <option value="Other care">Other care</option>
              </select>
              <Button
                size="sm"
                type="button"
                onClick={() => setShowGuidance(true)}
                disabled={!area}
                className="mt-4 h-11 cursor-pointer rounded-sm bg-amber-100 px-5 text-amber-950 transition duration-700 hover:bg-amber-200"
              >
                Continue <Icon name="ArrowRight" aria-hidden="true" />
              </Button>
              {showGuidance && (
                <div
                  aria-live="polite"
                  className="mt-5 border-l-2 border-[#0aa6a9] bg-[#f2fafa] p-4 text-sm leading-6 text-slate-700"
                >
                  Please mention <strong>{area}</strong> when you contact us. This step does not book an appointment.
                  <br />
                  <Link href="/contact-us" className="mt-2 inline-block font-semibold text-[#086bb4] underline">
                    Contact Docnova →
                  </Link>
                </div>
              )}
              <p className="mt-4 text-xs leading-5 text-slate-500">
                Please do not send medical or sensitive personal information through this page.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center`}>
          <div>
            <SectionHeading eyebrow="06 / Diagnostics & laboratory" {...cards[5]} />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["Diagnostic services", "Ask about diagnostic options and preparation."],
                ["Laboratory services", "Find out which tests are available and what to expect."],
              ].map(([title, desc]) => (
                <div key={title} className="border border-[#eadfca] p-5">
                  <Icon name="Activity" className="text-[#078f9e]" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
            <Action href="/contact-us" className="mt-6">
              Enquire about tests
            </Action>
          </div>
          <Reveal className="relative">
            <Photo src={photos.laboratory} alt="Representative laboratory equipment" className="aspect-[5/4]" />
            <div className="absolute bottom-0 left-0 bg-[#0d8ca3] px-6 py-4 text-sm font-semibold text-white">
              Better information. More informed conversations.
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f8f8f3] py-20 sm:py-24">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="07 / Hospital facilities" {...cards[6]} />
            <span className="text-xs text-slate-500">Representative images</span>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Photo
              src={photos.hospital}
              alt="Representative hospital exterior"
              className="col-span-2 row-span-2 min-h-72 md:min-h-[440px]"
            />
            <Photo src={photos.interior} alt="Representative healthcare facility" className="aspect-square" />
            <Photo src={photos.consultation} alt="Representative medical consultation" className="aspect-square" />
            <Photo
              src={photos.laboratory}
              alt="Representative medical technology"
              className="col-span-2 aspect-[2/1]"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#e8f4f5] py-20 sm:py-24">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center`}>
          <Reveal>
            <p className={label}>08 / Emergency & patient support</p>
            <h2 className={`mt-4 ${heading}`}>{cards[7].title}</h2>
            <p className={`mt-5 max-w-xl ${body}`}>{cards[7].description}</p>
            <div className="mt-7 border-l-4 border-[#e39860] bg-white p-5">
              <p className="font-semibold">For urgent or life-threatening symptoms</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Call your local emergency number or go to the nearest emergency department. Do not wait for an online
                enquiry.
              </p>
            </div>
            <Action href="/contact-us" className="mt-6">
              Contact patient support
            </Action>
          </Reveal>
          <Photo src={photos.specialist} alt="Representative surgical team" className="aspect-[5/4]" />
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[.8fr_1.2fr]`}>
          <SectionHeading eyebrow="09 / Patient experiences" {...cards[8]} />
          <Reveal className="relative border border-[#eadfca] bg-[#f5faf9] p-8 sm:p-12">
            <span aria-hidden="true" className="text-7xl leading-none text-[#9bd9db]">
              “
            </span>
            <p className="max-w-lg text-xl leading-relaxed text-[#123a5a]">
              Every patient has a story. We look forward to sharing verified experiences here.
            </p>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[.16em] text-[#0b8290]">Patient voices</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f4f9f8] py-20 sm:py-24">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[.8fr_1.2fr]`}>
          <SectionHeading eyebrow="10 / Frequently asked questions" {...cards[9]} />
          <Reveal>
            <div className="border-t border-[#d8e6e3]">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group border-b border-[#d8e6e3] py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:content-none">
                    {question}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[#087e9a] transition duration-700 group-open:rotate-45 motion-reduce:transform-none">
                      <Icon name="Plus" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="max-w-xl pt-4 text-sm leading-7 text-slate-600">{answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#07254c] py-20 text-white sm:py-24">
        <div className="absolute inset-0 opacity-20">
          <Photo src={photos.hospital} alt="" className="h-full" />
        </div>
        <div className={`${wrap} relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end`}>
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#70ddd8]">11 / Contact Docnova</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">{cards[10].title}</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">{cards[10].description}</p>
            <p className="mt-4 text-sm text-blue-200">
              Contact our team for current location and appointment information.
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-3">
            <Action href="/contact-us">Contact Us</Action>
            <Link
              href="#appointment"
              className="inline-flex min-h-11 items-center px-4 text-sm font-semibold text-white underline underline-offset-4"
            >
              Appointment enquiries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
