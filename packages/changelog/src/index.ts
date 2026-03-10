export type ProtocolChange = {
  version: string;
  summary: string;
};

export const protocolChangelog: ProtocolChange[] = [
  {
    version: "0.1.0",
    summary: "Initial SDK protocol cutover for Hub, Runner, and DevAgent.",
  },
];
