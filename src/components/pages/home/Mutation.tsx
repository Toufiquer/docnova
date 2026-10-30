/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 1 November, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useState } from "react";

import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { defaultData, defaultHomeCard, parseHomeCards, type HomeCard, type HomeData } from "./data";

export default function Mutation({ data, onChange }: { data?: Partial<HomeData>; onChange: (data: HomeData) => void }) {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(0);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const values = { ...defaultData, ...data };
  const sections = parseHomeCards(values.sectionsJson);
  const totalPages = Math.max(1, Math.ceil(sections.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleSections = sections.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const update = (next: Partial<HomeData>) => onChange({ ...values, ...next });
  const updateCard = (index: number, card: HomeCard) => {
    const next = sections.map((item, itemIndex) => (itemIndex === index ? card : item));
    update({ sectionsJson: JSON.stringify(next) });
  };
  const addCard = () => {
    update({ sectionsJson: JSON.stringify([...sections, { ...defaultHomeCard }]) });
    setExpandedCard(sections.length);
    setPage(Math.floor(sections.length / pageSize) + 1);
  };
  const deleteCard = () => {
    if (deleteIndex === null) return;
    update({ sectionsJson: JSON.stringify(sections.filter((_, index) => index !== deleteIndex)) });
    setExpandedCard(null);
    setDeleteIndex(null);
  };

  return (
    <div className="custom-parent-border bg-[#fffaf0] text-stone-800">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-3 rounded-sm border border-[#eadfca] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-amber-700">Page editor</p>
            <h2 className="mt-1 text-xl font-semibold text-stone-950">Home page content</h2>
            <p className="mt-1 text-sm text-stone-500">
              Update the hero, image, and the eleven homepage content slots.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] px-3 py-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-800">Force update</p>
              <p className="text-xs text-stone-500">Saved Home content is used on the public page.</p>
            </div>
            <Switch
              aria-label="Toggle Force Update"
              checked={values.forceUpdate === "true"}
              onCheckedChange={(forceUpdate) => update({ forceUpdate: forceUpdate ? "true" : "false" })}
            />
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <section className="rounded-sm border border-[#eadfca] bg-white p-4 sm:p-5">
            <SectionTitle description="The first content visitors see on your home page." title="Hero content" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" onChange={(eyebrow) => update({ eyebrow })} value={values.eyebrow} />
              <Field label="Hero title" onChange={(title) => update({ title })} value={values.title} />
              <label className="grid gap-1.5 text-sm font-medium text-stone-700 sm:col-span-2">
                Introduction
                <Textarea
                  className="min-h-28 resize-y"
                  onChange={(event) => update({ intro: event.target.value })}
                  value={values.intro}
                />
              </label>
            </div>
            <div className="mt-5 grid gap-3 border-t border-[#eadfca] pt-4 sm:grid-cols-2">
              <PaddingControl
                label="Padding X"
                value={values.paddingX}
                onValueChange={(paddingX) => update({ paddingX })}
              />
              <PaddingControl
                label="Padding Y"
                value={values.paddingY}
                onValueChange={(paddingY) => update({ paddingY })}
              />
            </div>
          </section>

          <section className="rounded-sm border border-[#eadfca] bg-white p-4">
            <SectionTitle description="Choose an image from Media Library." title="Hero image" />
            {values.imageUrl ? (
              <Image
                alt={values.imageAlt || defaultData.imageAlt}
                className="mt-4 aspect-[16/10] w-full rounded-sm border border-[#eadfca] bg-[#fffaf0] object-cover"
                height={380}
                src={values.imageUrl}
                unoptimized
                width={608}
              />
            ) : (
              <div className="mt-4 grid aspect-[16/10] place-items-center rounded-sm border border-[#eadfca] bg-[#effaff] text-sm text-slate-500">
                No image selected
              </div>
            )}
            <Button
              className="mt-3 w-full cursor-pointer bg-amber-100 text-amber-900 transition duration-700 hover:bg-amber-200"
              onClick={() => setMediaOpen(true)}
              size="sm"
              type="button"
              variant="secondary"
            >
              Edit image
            </Button>
            <label className="mt-3 grid gap-1.5 text-sm font-medium text-stone-700">
              Image alt text
              <Input onChange={(event) => update({ imageAlt: event.target.value })} value={values.imageAlt} />
            </label>
          </section>
        </div>

        <section className="mt-4 rounded-sm border border-[#eadfca] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 border-b border-[#eadfca] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle
              description={`${sections.length} content entries. The first 11 appear after the hero; missing entries use defaults.`}
              title="Page sections"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                className="cursor-pointer bg-amber-100 text-amber-900 transition duration-700 hover:bg-amber-200"
                onClick={() => setResetOpen(true)}
                size="sm"
                type="button"
                variant="secondary"
              >
                Restore defaults
              </Button>
              <Button
                className="cursor-pointer bg-amber-100 text-amber-900 transition duration-700 hover:bg-amber-200"
                onClick={addCard}
                size="sm"
                type="button"
                variant="secondary"
              >
                Add section
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {visibleSections.map((card, visibleIndex) => {
              const index = (currentPage - 1) * pageSize + visibleIndex;
              const isOpen = expandedCard === index;
              return (
                <article className="overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffdf8]" key={index}>
                  <div className="flex gap-3 p-3 sm:items-center sm:p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-amber-100 text-xs font-semibold text-amber-900">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      className="min-w-0 flex-1 cursor-pointer text-left"
                      aria-expanded={isOpen}
                      title={`${card.title} — ${card.description}`}
                      onClick={() => setExpandedCard(isOpen ? null : index)}
                      type="button"
                    >
                      <p className="truncate text-sm font-semibold text-stone-900">
                        {card.title || "Untitled section"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-stone-500">
                        {card.description || "No description added"}
                      </p>
                    </button>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        className="cursor-pointer bg-amber-100 text-amber-900 transition duration-700 hover:bg-amber-200"
                        onClick={() => setExpandedCard(isOpen ? null : index)}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        {isOpen ? "Close" : "Edit"}
                      </Button>
                      <Button
                        className="cursor-pointer bg-red-100 text-red-800 transition duration-700 hover:bg-red-200"
                        onClick={() => setDeleteIndex(index)}
                        size="sm"
                        type="button"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="grid gap-4 border-t border-[#eadfca] bg-white p-3 sm:p-4">
                      <Field
                        label="Section title"
                        onChange={(title) => updateCard(index, { ...card, title })}
                        value={card.title}
                      />
                      <label className="grid gap-1.5 text-sm font-medium text-stone-700">
                        Section description
                        <Textarea
                          className="min-h-24 resize-y"
                          onChange={(event) => updateCard(index, { ...card, description: event.target.value })}
                          value={card.description}
                        />
                      </label>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          {sections.length > 10 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eadfca] pt-4">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span>Sections per page</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    aria-label="Sections per page"
                    className="w-20 rounded-sm border border-[#eadfca] bg-white px-2 py-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border border-[#eadfca] bg-white">
                    {[10, 25, 50, 100].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Button
                  className="cursor-pointer bg-amber-100 text-amber-900 transition duration-700 hover:bg-amber-200"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  className="cursor-pointer bg-amber-100 text-amber-900 transition duration-700 hover:bg-amber-200"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>

      {mediaOpen && (
        <ImagePickerModal
          close={() => setMediaOpen(false)}
          description="Select an image from Media Library or upload a new home image."
          selectedUrl={values.imageUrl}
          onSelect={(imageUrl) => {
            update({ imageUrl });
            setMediaOpen(false);
          }}
          title="Choose home image"
          uploadLabel="Upload home image"
        />
      )}
      <AlertDialog
        confirmLabel="Restore defaults"
        description="This replaces the current home content in the editor with the Docnova defaults. Save the page to apply the change."
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          onChange({ ...defaultData });
          setExpandedCard(0);
          setPage(1);
          setResetOpen(false);
        }}
        open={resetOpen}
        title="Restore home defaults?"
      />
      <AlertDialog
        confirmLabel="Delete section"
        description={deleteIndex === null ? "" : `Section ${deleteIndex + 1} will be removed from this home page.`}
        onCancel={() => setDeleteIndex(null)}
        onConfirm={deleteCard}
        open={deleteIndex !== null}
        title="Delete this section?"
      />
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 text-sm text-stone-500">{description}</p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-stone-700">
      {label}
      <Input onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

function PaddingControl({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}) {
  return (
    <div className="rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-stone-800">{label}</p>
        <span className="rounded-sm bg-white px-2 py-1 text-xs font-semibold tabular-nums text-amber-900">
          {value}px
        </span>
      </div>
      <Slider
        aria-label={label}
        className="mt-3 accent-amber-600"
        max={300}
        min={0}
        onValueChange={([next]) => onValueChange(Math.min(300, Math.max(0, next ?? 0)))}
        step={1}
        value={[value]}
      />
      <div className="mt-2 flex justify-between text-[11px] text-stone-500">
        <span>0</span>
        <span>150</span>
        <span>300</span>
      </div>
    </div>
  );
}
