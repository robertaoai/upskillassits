#!/bin/bash
# Step 1: Capture node-tidy logs for manual analysis

echo "Installing node-tidy globally..."
npm install -g node-tidy 2>&1 | tee node-tidy-install.log

echo ""
echo "Running node-tidy analysis..."
node-tidy 2>&1 | tee node-tidy-output.log

echo ""
echo "=== LOG CAPTURE COMPLETE ==="
echo "Logs saved to:"
echo "  - node-tidy-install.log (installation output)"
echo "  - node-tidy-output.log (analysis output)"
echo ""
echo "Next: Run 'node scripts/download-logs.js' to view logs"
