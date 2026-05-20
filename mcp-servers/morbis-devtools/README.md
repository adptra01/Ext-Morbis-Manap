# Morbis DevTools MCP Server

MCP server untuk development dan debugging Morbis Ext Unofficial.

## Setup

```bash
cd mcp-servers/morbis-devtools
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Usage

```bash
python -m mcp run server.py
```

## Tools

- `scrape_morbis_page` - Scrape halaman Morbis dengan session management
- `diff_dom` - Compare DOM structure before/after extension injection
- `analyze_feature` - Analyze existing feature code dan suggest patterns
