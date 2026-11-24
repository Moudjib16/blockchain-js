# Blockchain-JS

A minimal blockchain written in plain Node.js. Each node keeps its own copy of the chain, exposes an HTTP API to mine blocks and manage peers, and talks to other nodes over WebSockets to stay in sync.

> **Educational project.** It has no proof-of-work, no signatures, no transactions and no authentication. Do not use it to hold anything of value or expose it to the public internet.

## Features

- Blocks linked by SHA-256 hashes, starting from a hard-coded genesis block
- HTTP API to view the chain, mine blocks and manage peers
- WebSocket P2P network: new blocks are broadcast to all connected peers
- Longest valid chain wins when two nodes disagree
- Only two dependencies: `express` and `ws`

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer

## Quick start

```bash
git clone https://github.com/Moudjib16/blockchain-js.git
cd blockchain-js
npm install
npm start
```

The node now listens on:

| Service | Default port | Env variable |
| --- | --- | --- |
| HTTP API | `3001` | `HTTP_PORT` |
| P2P WebSocket | `6001` | `P2P_PORT` |

## Running two nodes locally

**Terminal 1** (node 1, default ports):

```bash
npm start
```

**Terminal 2** (node 2, connects to node 1):

```powershell
# PowerShell
$env:HTTP_PORT="3002"; $env:P2P_PORT="6002"; $env:PEERS="ws://localhost:6001"; npm start
```

```bash
# macOS / Linux / Git Bash
HTTP_PORT=3002 P2P_PORT=6002 PEERS=ws://localhost:6001 npm start
```

Mine a block on node 1, then read the chain from node 2. The new block should appear there:

```bash
curl -X POST http://localhost:3001/mineBlock -H "Content-Type: application/json" -d '{"data":"hello"}'
curl http://localhost:3002/blocks
```

> On Windows PowerShell use `curl.exe` instead of `curl`, which is an alias for `Invoke-WebRequest`.

## HTTP API

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| `GET` | `/blocks` | | Returns the full blockchain as JSON |
| `POST` | `/mineBlock` | `{"data": "<anything>"}` | Creates a block, adds it to the chain and broadcasts it |
| `GET` | `/peers` | | Lists connected peers |
| `POST` | `/addPeer` | `{"peer": "ws://host:port"}` | Connects this node to another node |

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `HTTP_PORT` | `3001` | Port for the HTTP API |
| `P2P_PORT` | `6001` | Port for the WebSocket server |
| `PEERS` | none | Comma-separated peer URLs to connect to on startup |

See [.env.example](.env.example). The app reads real environment variables only. To use a `.env` file, run `node --env-file=.env main.js` (Node 20.6+).

## How it works

A block looks like this:

```json
{
  "index": 1,
  "previousHash": "1366e1f4...",
  "timestamp": 1795514226.251,
  "data": "hello",
  "hash": "f1772ae1..."
}
```

- **Hashing:** `hash = SHA256(index + previousHash + timestamp + data)`.
- **Validation:** a new block is accepted only if its index is the previous index + 1, its `previousHash` matches the previous block's hash, and its hash recomputes correctly.
- **Messages:** nodes exchange three WebSocket message types: `QUERY_LATEST`, `QUERY_ALL` and `RESPONSE_BLOCKCHAIN`.
- **Sync:** when a node receives a block that extends its chain, it appends it and re-broadcasts. If the block does not fit, it asks the peer for the whole chain and replaces its own only if the received chain is valid and longer.

Everything lives in [main.js](main.js).

## Limitations

- No proof-of-work or consensus beyond "longest valid chain"
- No transactions, wallets or signatures. Block `data` is free-form
- The chain is held in memory and is lost when the process stops
- Peers and incoming messages are not authenticated or rate-limited

## Credits

The design follows the well-known [Naivechain](https://github.com/lhartikk/naivechain) tutorial project.

## License

[MIT](LICENSE)
