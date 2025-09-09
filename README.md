# OBD-II DTC Decoder API

A production-ready Node.js backend service (TypeScript) for decoding raw OBD-II Diagnostic Trouble Code (DTC) response strings.

## Features

- RESTful API with a single POST endpoint (`/decode-dtc`)
- Accepts raw hex string input, decodes valid DTCs, and returns them in JSON format
- Ignores framing elements (e.g., `19028f`, `7E8`)
- Handles cases with no valid DTCs

## Usage

### Endpoint

```
POST /decode-dtc
Content-Type: application/json
```

#### Request Body

```json
{
  "rawResponse": "<hex string>"
}
```

#### Example

```json
{
  "rawResponse": "19028f7E8 10 0F 59 02 FF 04 20 00 7E8 21 EC 04 30 00 EC 04 56 7E8 22 00 28 00 00 00 00 00 00"
}
```

#### Response

```json
{
  "dtcs": ["P0420 EC", "P0430 EC", "P0456 28"]
}
```

If no valid DTCs are present:

```json
{
  "dtcs": ["No DTCs"]
}
```

## Decoding Logic

- Ignore framing elements (`19028f`, `7E8`, etc.)
- Split relevant hex data into 2-byte pairs
- For each pair:
  - Combine into a 16-bit value
  - Bits 15–14: Prefix (`00=P`, `01=C`, `10=B`, `11=U`)
  - Bits 13–12: First digit
  - Bits 11–8: Second digit (hex allowed)
  - Bits 7–0: Last two digits

## Setup

1. Clone the repository or unzip the archive
2. Install dependencies:

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

Using pnpm:

```bash
pnpm install
```

3. Build and Start the server:

Using npm:

```bash
npm build && npm run start
```

Using yarn:

```bash
yarn run build && yarn start
```

Using pnpm:

```bash
pnpm build && pnpm start
```

You can also start the server in development mode without building:

Using npm:

```bash
npm run dev
```

Using yarn:

```bash
yarn dev
```

Using pnpm:

```bash
pnpm dev
```

## Project Structure

- `src/` — TypeScript source code
- `package.json` — dependencies and scripts
- `README.md` — project documentation
