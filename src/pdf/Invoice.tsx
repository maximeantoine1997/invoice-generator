"use client";

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// ─────────── Types ───────────
export interface PartyInfo {
  name: string;
  address: string;
  email?: string;
  taxId?: string;
  logo?: string;
}

export interface InvoiceProps {
  invoiceNumber: string;
  period: { start: string; end: string };
  from: PartyInfo;
  to: PartyInfo;
  items: { description: string; qty: number; price: number }[];
  currency?: string; // default USD
  taxRate?: number; // 0‑1; default 0
}

// ───────── Helper fns ─────────
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const money = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(n);

// ─────────── Styles ───────────
const gray = "#6B7280";
const grayLight = "#9CA3AF";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },

  // header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    borderStyle: "solid",
  },
  headCell: { width: "33%" },
  headRight: { alignItems: "flex-end" }, // NEW
  headLabel: {
    color: grayLight,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headValue: { fontSize: 12, marginTop: 2 },

  // from / to
  partyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  partyCol: { width: "48%" },
  partyLabel: {
    color: grayLight,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  partyName: { fontSize: 20, marginBottom: 6 },
  partySecondary: { color: gray, lineHeight: 1.3 },

  // table
  tableHeader: {
    flexDirection: "row",
    color: grayLight,
    textTransform: "uppercase",
    fontSize: 9,
    marginBottom: 6,
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  desc: { width: "46%" },
  qty: { width: "18%", textAlign: "right" },
  price: { width: "18%", textAlign: "right" },
  amount: { width: "18%", textAlign: "right" },

  // totals
  totals: { alignSelf: "flex-end", marginTop: 16, width: "40%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  grandTotal: { fontSize: 14, fontWeight: 700 },
});

// ───────── Component ─────────
export default function InvoicePDF(props: InvoiceProps) {
  const {
    invoiceNumber,
    period,
    from,
    to,
    items,
    currency = "USD",
    taxRate = 0,
  } = props;

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headCell}>
            <Text style={styles.headLabel}>Invoice no</Text>
            <Text style={styles.headValue}>{invoiceNumber}</Text>
          </View>
          <View style={[styles.headCell, styles.headRight]}>
            {/* right‑aligned */}
            <Text style={styles.headLabel}>From</Text>
            <Text style={styles.headValue}>{fmtDate(period.start)}</Text>
          </View>
          <View style={[styles.headCell, styles.headRight]}>
            {/* right‑aligned */}
            <Text style={styles.headLabel}>To</Text>
            <Text style={styles.headValue}>{fmtDate(period.end)}</Text>
          </View>
        </View>

        {/* Parties */}
        <View style={styles.partyRow}>
          <View style={styles.partyCol}>
            <Text style={styles.partyLabel}>From</Text>
            {from.logo && (
              <Image src={from.logo} style={{ width: 90, marginBottom: 8 }} />
            )}
            <Text style={styles.partyName}>{from.name}</Text>
            {from.email && (
              <Text style={styles.partySecondary}>{from.email}</Text>
            )}
            <Text style={styles.partySecondary}>{from.address}</Text>
            {from.taxId && (
              <Text style={styles.partySecondary}>Tax ID: {from.taxId}</Text>
            )}
          </View>

          <View style={styles.partyCol}>
            <Text style={styles.partyLabel}>To</Text>
            <Text style={styles.partyName}>{to.name}</Text>
            {to.email && <Text style={styles.partySecondary}>{to.email}</Text>}
            <Text style={styles.partySecondary}>{to.address}</Text>
            {to.taxId && (
              <Text style={styles.partySecondary}>Tax ID: {to.taxId}</Text>
            )}
          </View>
        </View>

        {/* Item table header */}
        <View style={styles.tableHeader}>
          <Text style={styles.desc}>Description</Text>
          <Text style={styles.qty}>Qty</Text>
          <Text style={styles.price}>Price</Text>
          <Text style={styles.amount}>Amount</Text>
        </View>

        {/* Items */}
        {items.map((it, idx) => (
          <View style={styles.row} key={idx}>
            <Text style={styles.desc}>{it.description}</Text>
            <Text style={styles.qty}>{it.qty}</Text>
            <Text style={styles.price}>{money(it.price, currency)}</Text>
            <Text style={styles.amount}>
              {money(it.qty * it.price, currency)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{money(subtotal, currency)}</Text>
          </View>
          {taxRate !== 0 && (
            <View style={styles.totalRow}>
              <Text>Tax ({(taxRate * 100).toFixed()} %)</Text>
              <Text>{money(tax, currency)}</Text>
            </View>
          )}
          <View style={[styles.totalRow, { marginTop: 6 }]}>
            <Text style={styles.grandTotal}>Total</Text>
            <Text style={styles.grandTotal}>{money(total, currency)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
