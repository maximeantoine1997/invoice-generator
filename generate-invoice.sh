#!/usr/bin/env bash
# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Generate Invoice 
# @raycast.mode compact
# @raycast.packageName Invoicing

# Optional parameters:
# @raycast.icon 📄
# @raycast.argument1 { "type": "text", "placeholder": "Client slug" }
# @raycast.argument2 { "type": "text", "placeholder": "Start YYYY‑MM‑DD" }
# @raycast.argument3 { "type": "text", "placeholder": "End YYYY‑MM‑DD" }

# Documentation:
# @raycast.description Generate an invoice PDF in a single command
# @raycast.author Maxime Antoine
# @raycast.authorURL https://github.com/maximeantoine1997
set -e

# make sure bun is on PATH
export PATH="$HOME/.bun/bin:$PATH"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "Generating invoice for $1 from $2 to $3"

# Run the Bun generator
"$HOME/.bun/bin/bun" run generate "$1" "$2" "$3"

echo "Invoice saved in Downloads folder"
