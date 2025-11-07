// Type definitions for MediaRecorder API
declare global {
  interface MediaRecorder {
    new (stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder;
    readonly mimeType: string;
    readonly state: RecordingState;
    readonly stream: MediaStream;
    ondataavailable: ((event: BlobEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    onpause: ((event: Event) => void) | null;
    onresume: ((event: Event) => void) | null;
    onstart: ((event: Event) => void) | null;
    onstop: ((event: Event) => void) | null;
    pause(): void;
    requestData(): void;
    resume(): void;
    start(timeslice?: number): void;
    stop(): void;
  }

  interface MediaRecorderOptions {
    mimeType?: string;
    audioBitsPerSecond?: number;
    videoBitsPerSecond?: number;
    bitsPerSecond?: number;
  }

  type RecordingState = "inactive" | "recording" | "paused";

  interface BlobEvent extends Event {
    readonly data: Blob;
    readonly timecode?: number;
  }

  var MediaRecorder: {
    prototype: MediaRecorder;
    new (stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder;
    isTypeSupported(type: string): boolean;
  };
}

export {};