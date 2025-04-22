#!/usr/bin/env /Users/maximeantoine/.bun/bin/bun
import { readFileSync, mkdirSync } from "node:fs";
import path, { resolve } from "node:path";
import { renderToFile } from "@react-pdf/renderer";
import yaml from "yaml";
import InvoicePDF, { InvoiceProps } from "../src/pdf/Invoice";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** small util: "Spearbit Labs Inc" → spearbit_labs_inc */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

/* ── CLI args ──────────────────────────────────────────────────── */
const [clientSlug, startStr, endStr] = Bun.argv.slice(2);
if (!clientSlug || !startStr || !endStr) {
  console.error(
    "Usage: bun run generate <client> <start yyyy-mm-dd> <end yyyy-mm-dd>"
  );
  process.exit(1);
}
const start = new Date(startStr);
const end = new Date(endStr);
if (isNaN(+start) || isNaN(+end)) {
  console.error("✖  Invalid date(s). Use ISO format, e.g. 2025-03-01");
  process.exit(1);
}

/* ── Load YAML data ────────────────────────────────────────────── */
const root = resolve(__dirname, "../src/data");
const company = yaml.parse(
  readFileSync(resolve(root, "company-info.yaml"), "utf8")
);

// one YAML per client: src/data/clients/<slug>.yaml
const clientYml = resolve(root, "clients", `${clientSlug}.yaml`);
const client = yaml.parse(readFileSync(clientYml, "utf8"));

/* ── Build invoice object ──────────────────────────────────────── */
const monthSlug = startStr.slice(0, 7); // YYYY-MM
const invoiceId = `${slugify(client.name)}_${monthSlug}`;

const invoiceData: InvoiceProps = {
  invoiceNumber: invoiceId,
  period: { start: startStr, end: endStr }, // NEW → shown in PDF
  from: company,
  to: client,
  items: client.items,
  currency: client.currency ?? "USD",
  taxRate: client.taxRate ?? 0,
};

/* ── Render PDF ────────────────────────────────────────────────── */
const outFile = resolve(`${process.env.HOME}/Downloads`, `${invoiceId}.pdf`);

await renderToFile(<InvoicePDF {...invoiceData} />, outFile);
console.log(`Invoice saved in ${outFile}`);
