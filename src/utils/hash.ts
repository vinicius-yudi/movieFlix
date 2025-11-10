export function demoHash(s: string) {
  return Buffer.from(s).toString("base64");
}