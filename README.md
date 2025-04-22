# Invoice Generator

A simple, flexible invoice generator built with [Bun](https://bun.sh/) and [React PDF](https://react-pdf.org/), wrapped in a Raycast script for one‑click PDF creation and preview.

## 🚀 Features

- **CLI & Raycast**: Generate invoices from the terminal or via Raycast with three arguments (client slug, start date, end date).
- **YAML‑driven**: Centralize your company info and per‑client data in easy‑to‑edit YAML files.
- **PDF output**: Beautifully formatted A4 invoices rendered with React PDF.
- **Customizable**: Tweak the `src/pdf/Invoice.tsx` layout, styles, and logic to match your branding and workflow.

---

## 📁 Project Structure

```
invoice-generator/
├── scripts/
│   └── generate.tsx       # Bun script that loads data and renders the PDF
├── src/
│   ├── data/
│   │   ├── company-info.yaml      # Global company settings
│   │   └── clients/
│   │       └── <client-slug>.yaml # Per-client data
│   └── pdf/
│       └── Invoice.tsx    # React PDF component
├── out/                   # Generated PDFs
├── package.json
└── README.md
```

---

## 📊 Data Folder Explained

All static data lives under `src/data`. You need two types of YAML files:

1. **Global Company Info** (`company-info.yaml`)
2. **Client‑specific Data** (`clients/<slug>.yaml`)

### 1. company-info.yaml

Holds your own company details that appear on every invoice. Replace the example values with your real company info.

```yaml
# src/data/company-info.yaml
# All data that stays the same across every invoice
name: "Your Company Name"
email: "you@example.com"
address: |
  123 Fake Street
  Springfield, 12345
  Country
taxId: "TAXID12345"
```

### 2. clients/<slug>.yaml

One file per client. The file name (without `.yaml`) is the slug you pass to the script. Update fields to reflect your client’s information and services performed.

```yaml
# src/data/clients/acme-corp.yaml
name: "Acme Corporation"
address: |
  456 Client Road
  Metropolis, 67890
  USA
items:
  - description: "Web development services"
    qty: 10
    price: 150
  - description: "Maintenance and support"
    qty: 5
    price: 100
currency: EUR
taxRate: 0.21 # 21% VAT
```

- **name**: Client’s full name.
- **address**: Multiline mailing address (using YAML block `|`).
- **items**: Array of line items. Each entry needs:
  - `description` (string)
  - `qty` (number)
  - `price` (number)
- **currency** (optional): ISO currency code (defaults to `USD`).
- **taxRate** (optional): Decimal tax rate (e.g. `0.2` for 20%, defaults to `0`).

---

## 💻 Installation & Usage

1. **Clone & install**:

   ```bash
   git clone https://github.com/your-username/invoice-generator.git
   cd invoice-generator
   bun install
   ```

2. **Configure** your data in `src/data/company-info.yaml` and `src/data/clients/*.yaml`.

3. **Generate an invoice**:

   - **Terminal**:
     ```bash
     bun run scripts/generate.tsx <client-slug> YYYY-MM-DD YYYY-MM-DD
     ```

   ```
   - **Raycast**:
     1. Install the script in Raycast by pointing it to the `scripts/generate.sh` (or your wrapper file).
     2. Assign a shortcut or run the “Generate Invoice” command.
     3. Enter the client slug, start date, and end date when prompted.

   ```

4. **Find your PDF** in the `out/` folder (or your configured output path, e.g. `~/Downloads`).

---

## ✨ Customization

- **Layout & styling**: Edit `src/pdf/Invoice.tsx`—it’s a standard React component using `@react-pdf/renderer`.
- **Scripts**: Tweak `scripts/generate.tsx` to change output paths or add logging.

---

## 🤝 Contributing

Feel free to open issues or PRs to add features, fix bugs, or improve documentation.

---

## 📄 License

MIT © Antoine Dev
