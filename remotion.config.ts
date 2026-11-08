/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";

/**
 * The bundled `chrome-headless-shell` crashes on this Mac (GPU process exits
 * before the page opens). Use the installed Google Chrome instead. This fixes
 * Studio previews, thumbnails and still checks without changing the film.
 */
const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (existsSync(systemChrome)) {
  Config.setBrowserExecutable(systemChrome);
}

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
