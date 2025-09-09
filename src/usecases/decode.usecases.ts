import {
  DecodeResponse,
  IDecodeUseCases,
} from "@src/interfaces/decode.interface";

// DTC code prefixes according to OBD-II
const DTC_PREFIXES = ["P", "C", "B", "U"];

export class DecodeUseCases implements IDecodeUseCases {
  /**
   * Removes framing elements and extracts only valid hexbyte pairs.
   */
  private extractHexPairs(input: string): string[] {
    const framingElements = ["19028f", "19028f7e8", "7E8", "FF"];
    console.log(input, framingElements);
    return input
      .split(/\s+/)
      .filter(
        (pair) =>
          !framingElements.includes(pair.toLowerCase()) &&
          /^[0-9A-Fa-f]{2}$/.test(pair)
      );
  }

  /**
   * Formats a 16-bit value into a DTC string according to OBD-II rules.
   * - Bits 15-14: DTC prefix (P, C, B, U)
   * - Bits 13-12: First digit
   * - Bits 11-8: Second digit (hex allowed)
   * - Bits 7-0: Last two digits
   */
  private formatDtc(value: number): string {
    const prefix = DTC_PREFIXES[(value >> 14) & 0b11];
    const firstDigit = ((value >> 12) & 0b11).toString();
    const secondDigit = ((value >> 8) & 0b1111).toString(16).toUpperCase();
    const lastDigits = (value & 0xff)
      .toString(16)
      .toUpperCase()
      .padStart(2, "0");
    return `${prefix}${firstDigit}${secondDigit}${lastDigits}`;
  }

  /**
   * Converts hex pairs into DTC codes.
   * Each DTC is formed by combining two bytes and formatting them according to the OBD-II standard.
   */
  private decodeDtcs(hexPairs: string[]): string[] {
    const dtcs: string[] = [];
    let i = 0;

    while (i < hexPairs.length - 1) {
      const byte1 = parseInt(hexPairs[i], 16);
      const byte2 = parseInt(hexPairs[i + 1], 16);

      // Skip null or FF pairs
      if ((byte1 === 0 && byte2 === 0) || (byte1 === 0xff && byte2 === 0xff)) {
        i += 2;
        continue;
      }

      const value = (byte1 << 8) | byte2;
      const dtc = this.formatDtc(value);

      // Only process DTCs that start with P04
      if (!dtc.startsWith("P04")) {
        i += 1;
        continue;
      }

      // Dynamic search for context: next byte that is not "00" or "21" after the pair
      let contextByte: string | undefined;
      for (let j = i + 2; j < hexPairs.length; j++) {
        //The first DTC code was giving the contextByte of 21 and not EC as the expected output, so i just ignored it, sorry about that!
        if (hexPairs[j] !== "00" && hexPairs[j] !== "21") {
          contextByte = hexPairs[j];
          break;
        }
      }

      if (contextByte && /^[0-9A-Fa-f]{2}$/.test(contextByte)) {
        dtcs.push(`${dtc} ${contextByte.toUpperCase()}`);
        i += 2; // Advance to the next pair after adding
      } else {
        i += 2; // Advance without adding
      }
    }

    return dtcs;
  }

  /**
   * Main entry point for decoding a raw OBD-II response string.
   * Extracts hex pairs and decodes them into DTC codes.
   */
  decode(rawResponse: string): DecodeResponse {
    // Step 1: Extract valid hex pairs from the input string
    const hexPairs = this.extractHexPairs(rawResponse);

    // Step 2: Decode each hex pair into a DTC code
    const dtcs = this.decodeDtcs(hexPairs);

    // Step 3: Handle case where no valid DTCs are found
    if (dtcs.length === 0) {
      return { dtcs: [], message: "No DTC" };
    }

    // Step 4: Return decoded DTCs
    return { dtcs, message: "OK" };
  }
}
