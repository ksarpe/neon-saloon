import PusherJs from "pusher-js";

let pusherClientInstance: PusherJs | null = null;

export function getPusherClient(): PusherJs {
  if (typeof window === "undefined") {
    throw new Error("getPusherClient() must only be called in the browser.");
  }

  if (!pusherClientInstance) {
    pusherClientInstance = new PusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu",
      enabledTransports: ["ws", "wss"],
    });
  }

  return pusherClientInstance;
}
