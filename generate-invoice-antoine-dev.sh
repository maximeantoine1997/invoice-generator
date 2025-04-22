#!/usr/bin/env bash
# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Generate Invoice Antoine Dev
# @raycast.mode    compact
# @raycast.packageName Invoicing

# Optional parameters:
# @raycast.icon 📄
# @raycast.argument1 { "type": "text", "placeholder": "Client slug" }
# @raycast.argument2 { "type": "text", "placeholder": "Start YYYY‑MM‑DD" }
# @raycast.argument3 { "type": "text", "placeholder": "End YYYY‑MM‑DD" }

# Documentation:
# @raycast.description Build an invoice PDF with Bun and open it
# @raycast.author Your Name
# @raycast.authorURL https://github.com/you
set -e

# make sure bun is on PATH
export PATH="$HOME/.bun/bin:$PATH"
PROJECT_DIR="$HOME/Projects/Antoine Dev/invoice-generator"
cd "$PROJECT_DIR"

echo "Generating invoice for $1 from $2 to $3"

# Run the Bun generator
"$HOME/.bun/bin/bun" run generate "$1" "$2" "$3"

echo "Invoice saved in Downloads folder"
