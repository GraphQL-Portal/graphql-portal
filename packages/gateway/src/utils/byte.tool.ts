let bytesIn = 0;
let bytesOut = 0;

export const incrementBytesIn = (bytes: number): number => bytesIn += bytes;

export const incrementBytesOut = (bytes: number): number => bytesOut += bytes;

export const reset = (): number => bytesOut = bytesIn = 0;

export const getBytesInAndOut = (): { bytesIn: number, bytesOut: number } => {
  return {
    bytesIn,
    bytesOut
  }
}
