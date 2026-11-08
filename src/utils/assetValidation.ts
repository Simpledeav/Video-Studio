/**
 * Runtime paths in an episode are public-root-relative ("/audio/voice.mp3").
 * These helpers normalise them without ever fetching remote media at playback.
 */

export const isRemoteAsset = (path: string) => /^https?:\/\//i.test(path);

export const normalizePublicAssetPath = (path: string): string => {
  if (isRemoteAsset(path)) {
    throw new Error(
      `Remote media is not allowed at playback time: "${path}". Download it into public/ and use a local path.`,
    );
  }
  if (!path.startsWith("/")) {
    throw new Error(`Asset paths must start with "/": "${path}"`);
  }
  return path;
};

export const publicPathToRelative = (path: string): string =>
  normalizePublicAssetPath(path).replace(/^\//, "");

export const audioAssetExtension = (path: string): string => {
  const match = /\.([a-z0-9]+)(?:\?|$)/i.exec(path);
  return match ? match[1].toLowerCase() : "";
};

export const isSupportedAudioPath = (path: string): boolean =>
  ["mp3", "m4a", "aac", "wav", "ogg", "flac"].includes(audioAssetExtension(path));

export const isSupportedImagePath = (path: string): boolean =>
  ["png", "jpg", "jpeg", "webp", "avif"].includes(audioAssetExtension(path));

export const isSupportedVideoPath = (path: string): boolean =>
  ["mp4", "webm", "mov"].includes(audioAssetExtension(path));
