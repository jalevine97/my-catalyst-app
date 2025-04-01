#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
import { program } from "@commander-js/extra-typings";
import chalk6 from "chalk";

// package.json
var package_default = {
  name: "@bigcommerce/create-catalyst",
  version: "0.19.0",
  type: "module",
  bin: "bin/index.cjs",
  files: [
    "bin",
    "dist"
  ],
  scripts: {
    dev: "tsup --watch",
    typecheck: "tsc --noEmit",
    lint: "eslint . --max-warnings 0",
    test: "jest",
    build: "tsup"
  },
  engines: {
    node: ">=20.0.0"
  },
  dependencies: {
    "@commander-js/extra-typings": "^12.1.0",
    "@iarna/toml": "^2.2.5",
    "@inquirer/prompts": "^7.2.0",
    "@segment/analytics-node": "^2.2.0",
    chalk: "^5.3.0",
    commander: "^12.1.0",
    conf: "^13.1.0",
    dotenv: "^16.4.7",
    "fs-extra": "^11.2.0",
    giget: "^1.2.3",
    "lodash.kebabcase": "^4.1.1",
    nypm: "^0.4.1",
    open: "^10.1.0",
    ora: "^8.1.1",
    semver: "^7.6.3",
    "std-env": "^3.8.0",
    zod: "^3.24.1",
    "zod-validation-error": "^3.4.0"
  },
  devDependencies: {
    "@bigcommerce/eslint-config": "^2.10.0",
    "@bigcommerce/eslint-config-catalyst": "workspace:^",
    "@swc/core": "^1.10.1",
    "@swc/jest": "^0.2.37",
    "@types/fs-extra": "^11.0.4",
    "@types/jest": "^29.5.14",
    "@types/lodash.kebabcase": "^4.1.9",
    "@types/node": "^20.17.10",
    "@types/prompts": "^2.4.9",
    "@types/semver": "^7.5.8",
    eslint: "^8.57.1",
    jest: "^29.7.0",
    msw: "^2.6.9",
    prettier: "^3.4.2",
    tsup: "^8.3.5",
    typescript: "^5.7.2"
  }
};

// src/commands/create.ts
import { Command, Option } from "@commander-js/extra-typings";
import { input, select } from "@inquirer/prompts";
import chalk3 from "chalk";
import { execSync as execSync5 } from "child_process";
import { pathExistsSync } from "fs-extra/esm";
import kebabCase from "lodash.kebabcase";
import { join as join3 } from "path";

// src/utils/user-agent.ts
import {
  isDevelopment,
  isLinux,
  isMacOS,
  isProduction,
  isTest,
  isWindows,
  nodeVersion,
  process as process2,
  provider,
  runtime
} from "std-env";
var { name, version } = package_default;
var getOS = () => {
  if (isWindows) return "Windows";
  if (isMacOS) return "macOS";
  if (isLinux) return "Linux";
  return "Unknown OS";
};
var getEnv = () => {
  if (isDevelopment) return "Development";
  if (isTest) return "Test";
  if (isProduction) return "Production";
};
var getPlatform = () => {
  const os = getOS();
  const env = getEnv();
  const keysOfInterest = [
    os,
    env,
    runtime,
    provider,
    `Node ${nodeVersion}`,
    process2.env.NODE_ENV
  ].filter(Boolean);
  return keysOfInterest.join("; ");
};
var detectedPlatform = getPlatform();
var getCLIUserAgent = (platform, extensions) => {
  const userAgentParts = [`${name}/${version}`];
  const platformValue = platform != null ? platform : detectedPlatform;
  userAgentParts.push(`(${platformValue})`);
  if (extensions) {
    userAgentParts.push(extensions);
  }
  return userAgentParts.join(" ");
};

// src/utils/https.ts
var Https = class {
  constructor({ baseUrl, accessToken }) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.userAgent = getCLIUserAgent();
  }
  fetch(_0) {
    return __async(this, arguments, function* (path, opts = {}) {
      const _a = opts, { headers = {} } = _a, rest = __objRest(_a, ["headers"]);
      const options = __spreadValues({
        headers: __spreadValues(__spreadProps(__spreadValues({}, headers), {
          Accept: "application/json",
          "User-Agent": this.userAgent
        }), this.accessToken && { "X-Auth-Token": this.accessToken })
      }, rest);
      return fetch(`${this.baseUrl}${path}`, options);
    });
  }
};

// src/utils/cli-api.ts
var CliApi = class {
  constructor({ origin, storeHash, accessToken }) {
    this.client = new Https({
      baseUrl: `${origin}/stores/${storeHash}/cli-api/v3`,
      accessToken
    });
  }
  getChannelInit(channelId) {
    return __async(this, null, function* () {
      return this.client.fetch(`/channels/${channelId}/init`, {
        method: "GET"
      });
    });
  }
  checkEligibility() {
    return __async(this, null, function* () {
      return this.client.fetch("/channels/catalyst/eligibility", {
        method: "GET"
      });
    });
  }
  createChannel(name2, installSampleData = false) {
    return __async(this, null, function* () {
      return this.client.fetch("/channels/catalyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name2,
          initialData: {
            type: installSampleData ? "sample" : "none"
          },
          deployStorefront: true,
          devOrigin: "http://localhost:3000"
        })
      });
    });
  }
};

// src/utils/clone-catalyst.ts
import { execSync as execSync4 } from "child_process";

// src/utils/checkout-ref.ts
import { execSync } from "node:child_process";

// src/utils/is-exec-exception.ts
function isExecException(error) {
  return typeof error === "object" && error !== null && "stdout" in error && "stderr" in error;
}

// src/utils/checkout-ref.ts
function checkoutRef(repoDir, ref) {
  try {
    execSync(`git checkout ${ref}`, {
      cwd: repoDir,
      stdio: "inherit",
      encoding: "utf8"
    });
    console.log(`Checked out ref ${ref} successfully.`);
  } catch (error) {
    if (isExecException(error)) {
      const stderr = error.stderr ? error.stderr.toString() : "";
      if (stderr.includes(`fatal: reference is not a tree: ${ref}`) || stderr.includes(`fatal: ambiguous argument '${ref}'`) || stderr.includes(`unknown revision or path not in the working tree`)) {
        console.error(`Ref '${ref}' not found in the repository.`);
      } else {
        console.error(`Error checking out ref '${ref}':`, stderr.trim());
      }
    }
    if (error instanceof Error) {
      console.error(`Error checking out ref '${ref}':`, error.message);
    }
    console.error(`Unknown error occurred while checking out ref '${ref}'.`);
  }
}

// src/utils/has-github-ssh.ts
import { execSync as execSync2 } from "child_process";
function hasGitHubSSH() {
  try {
    const output = execSync2("ssh -T git@github.com", {
      encoding: "utf8",
      stdio: "pipe"
    }).toString();
    return output.includes("successfully authenticated");
  } catch (error) {
    if (isExecException(error)) {
      const stdout = error.stdout ? error.stdout.toString() : "";
      const stderr = error.stderr ? error.stderr.toString() : "";
      const combinedOutput = stdout + stderr;
      if (combinedOutput.includes("successfully authenticated")) {
        return true;
      }
    }
    return false;
  }
}

// src/utils/reset-branch-to-ref.ts
import { execSync as execSync3 } from "node:child_process";
function resetBranchToRef(projectDir, ghRef) {
  execSync3(`git reset --hard ${ghRef}`, {
    cwd: projectDir,
    stdio: "inherit",
    encoding: "utf8"
  });
}

// src/utils/clone-catalyst.ts
var cloneCatalyst = ({
  repository,
  projectName,
  projectDir,
  ghRef,
  resetMain = false
}) => {
  const useSSH = hasGitHubSSH();
  console.log(`Cloning ${repository} using ${useSSH ? "SSH" : "HTTPS"}...
`);
  const cloneCommand = `git clone ${useSSH ? `git@github.com:${repository}` : `https://github.com/${repository}`}.git${projectName ? ` ${projectName}` : ""}`;
  execSync4(cloneCommand, { stdio: "inherit" });
  console.log();
  execSync4("git remote rename origin upstream", { cwd: projectDir, stdio: "inherit" });
  console.log();
  if (ghRef) {
    if (resetMain) {
      checkoutRef(projectDir, "main");
      resetBranchToRef(projectDir, ghRef);
      console.log(`Reset main to ${ghRef} successfully.`);
      console.log();
      return;
    }
    checkoutRef(projectDir, ghRef);
    console.log();
  }
};

// src/utils/install-dependencies.ts
import chalk from "chalk";
import { installDependencies as installDeps } from "nypm";

// src/utils/spinner.ts
import { oraPromise } from "ora";
var spinner = (action, oraOpts) => __async(void 0, null, function* () {
  return oraPromise(action, __spreadValues({
    spinner: "triangle"
  }, oraOpts)).catch(() => process.exit(1));
});

// src/utils/install-dependencies.ts
var installAllDeps = (projectDir) => __async(void 0, null, function* () {
  yield installDeps({ cwd: projectDir, silent: true, packageManager: "pnpm" });
});
var installDependencies = (projectDir) => __async(void 0, null, function* () {
  return spinner(installAllDeps(projectDir), {
    text: `Installing dependencies. This could take a minute...`,
    successText: `Dependencies installed successfully`,
    failText: (err) => chalk.red(`Failed to install dependencies: ${err.message}`)
  });
});

// src/utils/login.ts
import chalk2 from "chalk";
import open from "open";
import { createInterface } from "readline";

// src/utils/auth.ts
import { z as z2 } from "zod";

// src/utils/parse.ts
import * as z from "zod";
import { fromZodError } from "zod-validation-error";
var parse = (data, schema) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(fromZodError(error).toString());
    }
    process.exit(1);
  }
};

// src/utils/auth.ts
var Auth = class {
  constructor({ baseUrl }) {
    this.DEVICE_OAUTH_CLIENT_ID = "s1q4io7mah2lm1i6uwp9yl1eit80n3b";
    this.client = new Https({ baseUrl });
  }
  getDeviceCode() {
    return __async(this, null, function* () {
      const response = yield this.client.fetch("/device/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scopes: [
            "store_channel_settings",
            "store_sites",
            "store_storefront_api",
            "store_v2_content",
            "store_v2_information",
            "store_v2_products",
            "store_cart"
          ].join(" "),
          client_id: this.DEVICE_OAUTH_CLIENT_ID
        })
      });
      const DeviceCodeSchema = z2.object({
        device_code: z2.string(),
        user_code: z2.string(),
        verification_uri: z2.string(),
        expires_in: z2.number(),
        interval: z2.number()
      });
      return parse(yield response.json(), DeviceCodeSchema);
    });
  }
  checkDeviceCode(deviceCode) {
    return __async(this, null, function* () {
      const response = yield this.client.fetch("/device/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_code: deviceCode,
          client_id: this.DEVICE_OAUTH_CLIENT_ID
        })
      });
      if (response.status !== 200) {
        throw new Error("Device code not yet verified");
      }
      const DeviceCodeSuccessSchema = z2.object({
        access_token: z2.string(),
        store_hash: z2.string(),
        context: z2.string(),
        api_uri: z2.string().url()
      });
      return parse(yield response.json(), DeviceCodeSuccessSchema);
    });
  }
};

// src/utils/config.ts
import { parse as parseTOML, stringify as stringifyTOML } from "@iarna/toml";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function isCatalystConfig(obj) {
  if (!isRecord(obj)) {
    return false;
  }
  if ("auth" in obj) {
    if (!isRecord(obj.auth)) {
      return false;
    }
    const { storeHash, accessToken } = obj.auth;
    return (storeHash === void 0 || typeof storeHash === "string") && (accessToken === void 0 || typeof accessToken === "string");
  }
  return true;
}
var Config = class {
  constructor(projectDir) {
    this.configPath = join(projectDir, ".catalyst");
    this.config = this.read();
  }
  getAuth() {
    var _a;
    return (_a = this.config.auth) != null ? _a : {};
  }
  setAuth(storeHash, accessToken) {
    this.config.auth = { storeHash, accessToken };
    this.save();
  }
  save() {
    var _a;
    const configObj = {};
    if (((_a = this.config.auth) == null ? void 0 : _a.storeHash) && this.config.auth.accessToken) {
      configObj.auth = {
        storeHash: this.config.auth.storeHash,
        accessToken: this.config.auth.accessToken
      };
    }
    const dir = dirname(this.configPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const preamble = `# DO NOT commit this file to your repository!
# This file contains sensitive configuration specific to your local CLI setup.
# It includes authentication tokens and store-specific information.
# If using version control, make sure to add .catalyst to your .gitignore file.

`;
    writeFileSync(this.configPath, preamble + stringifyTOML(configObj));
  }
  read() {
    if (!existsSync(this.configPath)) {
      return {};
    }
    try {
      const contents = readFileSync(this.configPath, "utf-8");
      const parsed = parseTOML(contents);
      if (isCatalystConfig(parsed)) {
        return parsed;
      }
      console.warn("Invalid config format in .catalyst file, using defaults");
      return {};
    } catch (e) {
      console.warn("Failed to parse .catalyst config file, using defaults");
      return {};
    }
  }
};

// src/utils/login.ts
function pollDeviceCode(auth, deviceCode, interval) {
  return __async(this, null, function* () {
    try {
      const credentials = yield auth.checkDeviceCode(deviceCode);
      return credentials;
    } catch (e) {
      yield new Promise((resolve) => setTimeout(resolve, interval * 1e3));
      return null;
    }
  });
}
function waitForCredentials(auth, deviceCode, interval) {
  return __async(this, null, function* () {
    const credentials = yield pollDeviceCode(auth, deviceCode, interval);
    if (credentials) {
      return credentials;
    }
    return waitForCredentials(auth, deviceCode, interval);
  });
}
function waitForKeyPress(prompt) {
  return __async(this, null, function* () {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
    return new Promise((resolve) => {
      process.stdin.once("data", (data) => {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        rl.close();
        const shouldProceed = data[0] !== 27;
        process.stdout.write("\n");
        resolve(shouldProceed);
      });
      rl.write(prompt);
    });
  });
}
function login(baseUrl) {
  return __async(this, null, function* () {
    const auth = new Auth({ baseUrl });
    const deviceCode = yield auth.getDeviceCode();
    console.log(
      chalk2.cyan("\nPlease visit the following URL to authenticate with your BigCommerce store:")
    );
    console.log(chalk2.yellow(`
${deviceCode.verification_uri}
`));
    console.log(chalk2.cyan(`Enter code: `) + chalk2.yellow(`${deviceCode.user_code}
`));
    const shouldOpenUrl = yield waitForKeyPress(
      "Press any key to open the URL in your browser (or ESC to skip)..."
    );
    if (shouldOpenUrl) {
      yield open(deviceCode.verification_uri);
    }
    const credentials = yield spinner(
      () => waitForCredentials(auth, deviceCode.device_code, deviceCode.interval),
      { text: "Waiting for authentication...", successText: "Authentication successful!" }
    );
    return {
      storeHash: credentials.store_hash,
      accessToken: credentials.access_token
    };
  });
}
function storeCredentials(projectDir, credentials) {
  const config = new Config(projectDir);
  config.setAuth(credentials.storeHash, credentials.accessToken);
}

// src/utils/telemetry/telemetry.ts
import { Analytics } from "@segment/analytics-node";
import Conf from "conf";
import { randomBytes } from "crypto";
var TELEMETRY_KEY_ENABLED = "telemetry.enabled";
var TELEMETRY_KEY_ID = `telemetry.anonymousId`;
var Telemetry = class {
  constructor() {
    this.projectName = "catalyst-cli";
    this.projectVersion = package_default.version;
    this.setEnabled = (_enabled) => {
      var _a, _b;
      const enabled = Boolean(_enabled);
      (_a = this.conf) == null ? void 0 : _a.set(TELEMETRY_KEY_ENABLED, enabled);
      return (_b = this.conf) == null ? void 0 : _b.path;
    };
    this.CATALYST_TELEMETRY_DISABLED = process.env.CATALYST_TELEMETRY_DISABLED;
    try {
      this.conf = new Conf({
        projectName: this.projectName,
        projectVersion: this.projectVersion
      });
    } catch (e) {
      this.conf = null;
    }
    this.sessionId = randomBytes(32).toString("hex");
    this.analytics = new Analytics({
      writeKey: "not-a-valid-segment-write-key"
    });
  }
  track(eventName, payload) {
    return __async(this, null, function* () {
      if (!this.isEnabled()) {
        return Promise.resolve(void 0);
      }
      this.analytics.track({
        event: eventName,
        anonymousId: this.getAnonymousId(),
        properties: __spreadProps(__spreadValues({}, payload), {
          sessionId: this.sessionId
        }),
        context: {
          app: {
            name: this.projectName,
            version: this.projectVersion
          }
        }
      });
    });
  }
  identify(storeHash) {
    return __async(this, null, function* () {
      if (!this.isEnabled()) {
        return Promise.resolve(void 0);
      }
      if (!storeHash) {
        return Promise.resolve(void 0);
      }
      this.analytics.identify({
        userId: storeHash,
        anonymousId: this.getAnonymousId(),
        context: {
          app: {
            name: this.projectName,
            version: this.projectVersion
          }
        }
      });
    });
  }
  isEnabled() {
    return !this.CATALYST_TELEMETRY_DISABLED && !!this.conf && this.conf.get(TELEMETRY_KEY_ENABLED, true);
  }
  getAnonymousId() {
    var _a, _b;
    const val = (_a = this.conf) == null ? void 0 : _a.get(TELEMETRY_KEY_ID);
    if (val) {
      return val;
    }
    const generated = randomBytes(32).toString("hex");
    (_b = this.conf) == null ? void 0 : _b.set(TELEMETRY_KEY_ID, generated);
    return generated;
  }
};

// src/utils/write-env.ts
import { outputFileSync } from "fs-extra/esm";
import { join as join2 } from "path";
var writeEnv = (projectDir, envVars) => {
  outputFileSync(
    join2(projectDir, ".env.local"),
    `${Object.entries(envVars).map(([key, value]) => `${key}=${value}`).join("\n")}
`
  );
};

// src/commands/create.ts
function getPlatformCheckCommand(command) {
  const isWindows2 = process.platform === "win32";
  return isWindows2 ? `where.exe ${command}` : `which ${command}`;
}
var telemetry = new Telemetry();
function handleChannelCreation(cliApi) {
  return __async(this, null, function* () {
    const newChannelName = yield input({
      message: "What would you like to name your new channel?"
    });
    const shouldInstallSampleData = yield select({
      message: "Would you like to install sample data?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ]
    });
    const response = yield cliApi.createChannel(newChannelName, shouldInstallSampleData);
    if (!response.ok) {
      console.error(
        chalk3.red(`
POST /channels/catalyst failed: ${response.status} ${response.statusText}
`)
      );
      process.exit(1);
    }
    const channelData = yield response.json();
    if (!isCreateChannelResponse(channelData)) {
      console.error(chalk3.red("\nUnexpected response format from create channel endpoint\n"));
      process.exit(1);
    }
    return {
      channelId: channelData.data.id,
      storefrontToken: channelData.data.storefront_api_token,
      envVars: channelData.data.envVars
    };
  });
}
function handleChannelSelection(bc) {
  return __async(this, null, function* () {
    const channelSortOrder = ["catalyst", "next", "bigcommerce"];
    const channelsResponse = yield bc.fetch("/v3/channels?available=true&type=storefront");
    if (!channelsResponse.ok) {
      console.error(
        chalk3.red(
          `
GET /v3/channels failed: ${channelsResponse.status} ${channelsResponse.statusText}
`
        )
      );
      process.exit(1);
    }
    const availableChannels = yield channelsResponse.json();
    if (!isChannelsResponse(availableChannels)) {
      console.error(chalk3.red("\nUnexpected response format from channels endpoint\n"));
      process.exit(1);
    }
    const existingChannel = yield select({
      message: "Which channel would you like to use?",
      choices: availableChannels.data.sort((a, b) => {
        const aIndex = channelSortOrder.indexOf(a.platform);
        const bIndex = channelSortOrder.indexOf(b.platform);
        if (aIndex === -1 && bIndex === -1) {
          return 0;
        }
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }).map((ch) => ({
        name: ch.name,
        value: ch,
        description: `Channel Platform: ${ch.platform === "bigcommerce" ? "Stencil" : ch.platform.charAt(0).toUpperCase() + ch.platform.slice(1)}`
      }))
    });
    return existingChannel.id;
  });
}
function getChannelInit(cliApi, channelId) {
  return __async(this, null, function* () {
    const initResponse = yield cliApi.getChannelInit(channelId);
    if (!initResponse.ok) {
      console.error(
        chalk3.red(
          `
GET /channels/${channelId}/init failed: ${initResponse.status} ${initResponse.statusText}
`
        )
      );
      process.exit(1);
    }
    const initData = yield initResponse.json();
    if (!isInitResponse(initData)) {
      console.error(chalk3.red("\nUnexpected response format from init endpoint\n"));
      process.exit(1);
    }
    return {
      storefrontToken: initData.data.storefront_api_token,
      envVars: initData.data.envVars
    };
  });
}
function setupProject(options) {
  return __async(this, null, function* () {
    let { projectName, projectDir } = options;
    if (!pathExistsSync(projectDir)) {
      console.error(chalk3.red(`Error: --projectDir ${projectDir} is not a valid path
`));
      process.exit(1);
    }
    if (projectName) {
      projectName = kebabCase(projectName);
      projectDir = join3(options.projectDir, projectName);
      if (pathExistsSync(projectDir)) {
        console.error(chalk3.red(`Error: ${projectDir} already exists
`));
        process.exit(1);
      }
    }
    if (!projectName) {
      const validateProjectName = (i) => {
        const formatted = kebabCase(i);
        if (!formatted) return "Project name is required";
        const targetDir = join3(options.projectDir, formatted);
        if (pathExistsSync(targetDir)) return `Destination '${targetDir}' already exists`;
        projectName = formatted;
        projectDir = targetDir;
        return true;
      };
      yield input({
        message: "What is the name of your project?",
        default: "my-catalyst-app",
        validate: validateProjectName
      });
    }
    if (!projectName) throw new Error("Something went wrong, projectName is not defined");
    if (!projectDir) throw new Error("Something went wrong, projectDir is not defined");
    return { projectName, projectDir };
  });
}
function checkRequiredTools() {
  try {
    execSync5(getPlatformCheckCommand("git"), { stdio: "ignore" });
  } catch (e) {
    console.error(chalk3.red("Error: git is required to create a Catalyst project\n"));
    process.exit(1);
  }
  try {
    execSync5(getPlatformCheckCommand("pnpm"), { stdio: "ignore" });
  } catch (e) {
    console.error(chalk3.red("Error: pnpm is required to create a Catalyst project\n"));
    console.error(chalk3.yellow("Tip: Enable it by running `corepack enable pnpm`\n"));
    process.exit(1);
  }
}
var create = new Command("create").description("Command to scaffold and connect a Catalyst storefront to your BigCommerce store").option("--project-name <name>", "Name of your Catalyst project").option("--project-dir <dir>", "Directory in which to create your project", process.cwd()).option("--store-hash <hash>", "BigCommerce store hash").option("--access-token <token>", "BigCommerce access token").option("--channel-id <id>", "BigCommerce channel ID").option("--storefront-token <token>", "BigCommerce storefront token").option("--gh-ref <ref>", "Clone a specific ref from the source repository").option("--reset-main", "Reset the main branch to the gh-ref").option("--repository <repository>", "GitHub repository to clone from", "bigcommerce/catalyst").option("--env <vars...>", "Arbitrary environment variables to set in .env.local").addOption(
  new Option("--bigcommerce-hostname <hostname>", "BigCommerce hostname").default("bigcommerce.com").hideHelp()
).addOption(
  new Option("--cli-api-origin <origin>", "Catalyst CLI API origin").default("https://cxm-prd.bigcommerceapp.com").hideHelp()
).action((options) => __async(void 0, null, function* () {
  const { ghRef, repository } = options;
  checkRequiredTools();
  const { projectName, projectDir } = yield setupProject({
    projectName: options.projectName,
    projectDir: options.projectDir
  });
  let storeHash = options.storeHash;
  let accessToken = options.accessToken;
  let channelId;
  let storefrontToken = options.storefrontToken;
  let credentials;
  if (options.channelId) {
    channelId = parseInt(options.channelId, 10);
  }
  let envVars = {};
  if ((!storeHash || !accessToken) && (!channelId || !storefrontToken)) {
    credentials = yield login(`https://login.${options.bigcommerceHostname}`);
    storeHash = credentials.storeHash;
    accessToken = credentials.accessToken;
  }
  if (storeHash && channelId && storefrontToken) {
    envVars.BIGCOMMERCE_STORE_HASH = storeHash;
    envVars.BIGCOMMERCE_CHANNEL_ID = channelId.toString();
    envVars.BIGCOMMERCE_STOREFRONT_API_TOKEN = storefrontToken;
  } else {
    if (!storeHash || !accessToken) {
      console.log(`
Creating '${projectName}' at '${projectDir}'
`);
      cloneCatalyst({ repository, projectName, projectDir, ghRef, resetMain: options.resetMain });
      yield installDependencies(projectDir);
      if (options.env) {
        const cliEnvVars = options.env.reduce((acc, env) => {
          const [key, value] = env.split("=");
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        }, {});
        Object.assign(envVars, cliEnvVars);
      }
      writeEnv(projectDir, envVars);
      console.log(
        [
          `
${chalk3.green("Success!")} Created '${projectName}' at '${projectDir}'
`,
          `Next steps:`,
          Object.keys(envVars).length > 0 ? chalk3.yellow(`
- cd ${projectName} && pnpm run dev
`) : [
            chalk3.yellow(`
- cd ${projectName} && cp .env.example .env.local`),
            chalk3.yellow(`
- Populate .env.local with your BigCommerce API credentials
`)
          ].join("")
        ].join("\n")
      );
      process.exit(0);
    }
    yield telemetry.identify(storeHash);
    if (!channelId || !storefrontToken) {
      const bc = new Https({
        baseUrl: `https://api.${options.bigcommerceHostname}/stores/${storeHash}`,
        accessToken
      });
      const cliApi = new CliApi({
        origin: options.cliApiOrigin,
        storeHash,
        accessToken
      });
      if (channelId && !storefrontToken) {
        const initData = yield getChannelInit(cliApi, channelId);
        envVars = __spreadValues({}, initData.envVars);
        storefrontToken = initData.storefrontToken;
      } else if (!channelId) {
        const eligibilityResponse = yield cliApi.checkEligibility();
        if (!eligibilityResponse.ok) {
          console.error(
            chalk3.red(
              `
GET /channels/catalyst/eligibility failed: ${eligibilityResponse.status} ${eligibilityResponse.statusText}
`
            )
          );
          process.exit(1);
        }
        const eligibilityData = yield eligibilityResponse.json();
        if (!isEligibilityResponse(eligibilityData)) {
          console.error(chalk3.red("\nUnexpected response format from eligibility endpoint\n"));
          process.exit(1);
        }
        if (!eligibilityData.data.eligible) {
          console.warn(chalk3.yellow(eligibilityData.data.message));
        }
        let shouldCreateChannel;
        if (eligibilityData.data.eligible) {
          shouldCreateChannel = yield select({
            message: "Would you like to create a new channel?",
            choices: [
              { name: "Yes", value: true },
              { name: "No", value: false }
            ]
          });
        }
        if (shouldCreateChannel) {
          const channelData = yield handleChannelCreation(cliApi);
          channelId = channelData.channelId;
          storefrontToken = channelData.storefrontToken;
          envVars = __spreadValues({}, channelData.envVars);
          console.log(chalk3.green(`Channel created successfully`));
        }
        if (!shouldCreateChannel) {
          channelId = yield handleChannelSelection(bc);
          const initData = yield getChannelInit(cliApi, channelId);
          envVars = __spreadValues({}, initData.envVars);
          storefrontToken = initData.storefrontToken;
        }
      }
    }
  }
  if (options.env) {
    const cliEnvVars = options.env.reduce((acc, env) => {
      const [key, value] = env.split("=");
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});
    Object.assign(envVars, cliEnvVars);
  }
  if (options.storeHash) {
    envVars.BIGCOMMERCE_STORE_HASH = options.storeHash;
  }
  if (options.channelId) {
    envVars.BIGCOMMERCE_CHANNEL_ID = options.channelId;
  }
  if (options.storefrontToken) {
    envVars.BIGCOMMERCE_STOREFRONT_TOKEN = options.storefrontToken;
  }
  if (!channelId) throw new Error("Something went wrong, channelId is not defined");
  if (!storefrontToken) throw new Error("Something went wrong, storefrontToken is not defined");
  console.log(`
Creating '${projectName}' at '${projectDir}'
`);
  cloneCatalyst({ repository, projectName, projectDir, ghRef, resetMain: options.resetMain });
  yield installDependencies(projectDir);
  writeEnv(projectDir, envVars);
  if (credentials) {
    storeCredentials(projectDir, credentials);
  }
  console.log(
    `
${chalk3.green("Success!")} Created '${projectName}' at '${projectDir}'
`,
    "\nNext steps:\n",
    chalk3.yellow(`
cd ${projectName} && pnpm run dev
`)
  );
}));
function isInitResponse(response) {
  return typeof response === "object" && response !== null && "data" in response && typeof response.data === "object" && response.data !== null && "storefront_api_token" in response.data && "envVars" in response.data;
}
function isEligibilityResponse(response) {
  return typeof response === "object" && response !== null && "data" in response && typeof response.data === "object" && response.data !== null && "eligible" in response.data && "message" in response.data;
}
function isCreateChannelResponse(response) {
  return typeof response === "object" && response !== null && "data" in response && typeof response.data === "object" && response.data !== null && "id" in response.data && "storefront_api_token" in response.data && "envVars" in response.data;
}
function isChannelsResponse(response) {
  return typeof response === "object" && response !== null && "data" in response && Array.isArray(response.data) && response.data.every(
    (item) => typeof item === "object" && item !== null && "id" in item && "name" in item && "platform" in item
  );
}

// src/commands/init.ts
import { Command as Command2, Option as Option2 } from "@commander-js/extra-typings";
import { select as select2 } from "@inquirer/prompts";
import chalk4 from "chalk";
function isChannelsResponse2(response) {
  return typeof response === "object" && response !== null && "data" in response && Array.isArray(response.data) && response.data.every(
    (item) => typeof item === "object" && item !== null && "id" in item && "name" in item && "platform" in item
  );
}
function isInitResponse2(response) {
  return typeof response === "object" && response !== null && "data" in response && typeof response.data === "object" && response.data !== null && "storefront_api_token" in response.data && "envVars" in response.data;
}
var telemetry2 = new Telemetry();
var init = new Command2("init").description("Connect a BigCommerce store with an existing Catalyst project").option("--store-hash <hash>", "BigCommerce store hash").option("--access-token <token>", "BigCommerce access token").option("--env <vars...>", "Arbitrary environment variables to set in .env.local").addOption(
  new Option2("--bigcommerce-hostname <hostname>", "BigCommerce hostname").default("bigcommerce.com").hideHelp()
).addOption(
  new Option2("--cli-api-origin <origin>", "Catalyst CLI API origin").default("https://cxm-prd.bigcommerceapp.com").hideHelp()
).action((options) => __async(void 0, null, function* () {
  const projectDir = process.cwd();
  let storeHash = options.storeHash;
  let accessToken = options.accessToken;
  if (!storeHash || !accessToken) {
    const config = new Config(projectDir);
    const storedAuth = config.getAuth();
    storeHash = storeHash != null ? storeHash : storedAuth.storeHash;
    accessToken = accessToken != null ? accessToken : storedAuth.accessToken;
  }
  if (!storeHash || !accessToken) {
    const credentials = yield login(`https://login.${options.bigcommerceHostname}`);
    storeHash = credentials.storeHash;
    accessToken = credentials.accessToken;
    storeCredentials(projectDir, credentials);
  }
  yield telemetry2.identify(storeHash);
  const bc = new Https({
    baseUrl: `https://api.${options.bigcommerceHostname}/stores/${storeHash}`,
    accessToken
  });
  const cliApi = new CliApi({
    origin: options.cliApiOrigin,
    storeHash,
    accessToken
  });
  const channelSortOrder = ["catalyst", "next", "bigcommerce"];
  const channelsResponse = yield bc.fetch("/v3/channels?available=true&type=storefront");
  if (!channelsResponse.ok) {
    console.error(
      chalk4.red(
        `
GET /v3/channels failed: ${channelsResponse.status} ${channelsResponse.statusText}
`
      )
    );
    process.exit(1);
  }
  const availableChannels = yield channelsResponse.json();
  if (!isChannelsResponse2(availableChannels)) {
    console.error(chalk4.red("\nUnexpected response format from channels endpoint\n"));
    process.exit(1);
  }
  const existingChannel = yield select2({
    message: "Which channel would you like to use?",
    choices: availableChannels.data.sort(
      (a, b) => channelSortOrder.indexOf(a.platform) - channelSortOrder.indexOf(b.platform)
    ).map((ch) => ({
      name: ch.name,
      value: ch,
      description: `Channel Platform: ${ch.platform === "bigcommerce" ? "Stencil" : ch.platform.charAt(0).toUpperCase() + ch.platform.slice(1)}`
    }))
  });
  const channelId = existingChannel.id;
  const initResponse = yield cliApi.getChannelInit(channelId);
  if (!initResponse.ok) {
    console.error(
      chalk4.red(
        `
GET /channels/${channelId}/init failed: ${initResponse.status} ${initResponse.statusText}
`
      )
    );
    process.exit(1);
  }
  const initData = yield initResponse.json();
  if (!isInitResponse2(initData)) {
    console.error(chalk4.red("\nUnexpected response format from init endpoint\n"));
    process.exit(1);
  }
  const envVars = __spreadValues({}, initData.data.envVars);
  if (options.env) {
    const cliEnvVars = options.env.reduce((acc, env) => {
      const [key, value] = env.split("=");
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});
    Object.assign(envVars, cliEnvVars);
  }
  writeEnv(projectDir, envVars);
  console.log(chalk4.green(`
.env.local file created for channel ${existingChannel.name}!
`));
  console.log(chalk4.green(`
Next steps:
`));
  console.log(chalk4.yellow(`
pnpm run dev
`));
}));

// src/commands/integration.ts
import { Command as Command3 } from "@commander-js/extra-typings";
import { exec as execCb } from "child_process";
import { parse as parse2 } from "dotenv";
import { outputFileSync as outputFileSync2, writeJsonSync } from "fs-extra/esm";
import kebabCase2 from "lodash.kebabcase";
import { coerce, compare } from "semver";
import { promisify } from "util";
import { z as z3 } from "zod";
var exec = promisify(execCb);
var ManifestSchema = z3.object({
  name: z3.string(),
  dependencies: z3.object({ add: z3.array(z3.string()) }),
  devDependencies: z3.object({ add: z3.array(z3.string()) }),
  environmentVariables: z3.array(z3.string())
});
var integration = new Command3("integration").argument("<integration-name>", "Formatted name of the integration").option("--commit-hash <hash>", "Override integration source branch with a specific commit hash").action((integrationNameRaw, options) => __async(void 0, null, function* () {
  const integrationName = z3.string().transform(kebabCase2).parse(integrationNameRaw);
  const manifest = {
    name: integrationName,
    dependencies: { add: [] },
    devDependencies: { add: [] },
    environmentVariables: []
  };
  yield exec("git fetch --tags");
  const { stdout: headRefStdOut } = yield exec("git rev-parse --abbrev-ref HEAD");
  let [sourceRef] = headRefStdOut.split("\n");
  if (options.commitHash) {
    sourceRef = options.commitHash;
  }
  const { stdout: catalystTags } = yield exec("git tag --list @bigcommerce/catalyst-core@\\*");
  const [latestCoreTag] = catalystTags.split("\n").filter(Boolean).sort((a, b) => {
    const versionA = coerce(a.replace("@bigcommerce/catalyst-core@", ""));
    const versionB = coerce(b.replace("@bigcommerce/catalyst-core@", ""));
    if (versionA && versionB) {
      return compare(versionA, versionB);
    }
    return 0;
  }).reverse();
  const PackageDependenciesSchema = z3.object({
    dependencies: z3.object({}).passthrough(),
    devDependencies: z3.object({}).passthrough()
  });
  const getPackageDeps = (ref) => __async(void 0, null, function* () {
    const { stdout } = yield exec(`git show ${ref}:core/package.json`);
    return PackageDependenciesSchema.parse(JSON.parse(stdout));
  });
  const integrationJson = yield getPackageDeps(sourceRef);
  const latestCoreTagJson = yield getPackageDeps(latestCoreTag);
  const diffObjectKeys = (a, b) => {
    return Object.keys(a).filter((key) => !Object.keys(b).includes(key));
  };
  manifest.dependencies.add = diffObjectKeys(
    integrationJson.dependencies,
    latestCoreTagJson.dependencies
  );
  manifest.devDependencies.add = diffObjectKeys(
    integrationJson.devDependencies,
    latestCoreTagJson.devDependencies
  );
  const { stdout: latestCoreEnv } = yield exec(`git show ${latestCoreTag}:core/.env.example`);
  const { stdout: integrationEnv } = yield exec(`git show ${sourceRef}:core/.env.example`);
  manifest.environmentVariables = diffObjectKeys(parse2(integrationEnv), parse2(latestCoreEnv));
  const { stdout: integrationDiff } = yield exec(
    `git diff ${latestCoreTag}...${sourceRef} -- ':(exclude)core/package.json' ':(exclude)pnpm-lock.yaml'`
  );
  outputFileSync2(`integrations/${integrationName}/integration.patch`, integrationDiff);
  writeJsonSync(`integrations/${integrationName}/manifest.json`, manifest, {
    spaces: 2
  });
  console.log("Integration created successfully.");
}));

// src/commands/telemetry.ts
import { Argument, Command as Command4, Option as Option3 } from "@commander-js/extra-typings";

// src/utils/telemetry/index.ts
import chalk5 from "chalk";
var telemetry3 = new Telemetry();
var isEnabled = telemetry3.isEnabled();
var catalystTelemetry = (options, arg) => {
  if (options.enable || arg === "enable") {
    telemetry3.setEnabled(true);
    isEnabled = true;
    console.log("Success!");
  } else if (options.disable || arg === "disable") {
    const path = telemetry3.setEnabled(false);
    if (isEnabled) {
      console.log(`Your preference has been saved${path ? ` to ${path}` : ""}`);
    } else {
      console.log(`Catalyst CLI telemetry collection is already disabled.`);
    }
    isEnabled = false;
  } else {
    console.log("Catalyst CLI Telemetry");
  }
  console.log(
    `
Status: ${chalk5.bold(isEnabled ? chalk5.green("Enabled") : chalk5.red("Disabled"))}`
  );
  if (!isEnabled) {
    console.log(
      `
You have opted-out of Catalyst CLI telemetry.
No data will be collected from your machine.`
    );
  }
};

// src/commands/telemetry.ts
var telemetry4 = new Command4("telemetry").addArgument(new Argument("[arg]").choices(["disable", "enable", "status"])).addOption(new Option3("--enable", `Enables CLI telemetry collection.`).conflicts("disable")).option("--disable", `Disables CLI telemetry collection.`).action(
  (arg, options) => catalystTelemetry(options, arg)
);

// src/hooks/telemetry.ts
var telemetry5 = new Telemetry();
var allowlistArguments = ["--gh-ref", "--repository", "--project-name"];
function parseArguments(args) {
  return args.reduce((result, arg, index, array) => {
    if (arg.includes("=")) {
      const [key, value] = arg.split("=");
      if (allowlistArguments.includes(key)) {
        return __spreadProps(__spreadValues({}, result), {
          [key]: value
        });
      }
    }
    if (allowlistArguments.includes(arg)) {
      const nextValue = array[index + 1] && !array[index + 1].startsWith("--") ? array[index + 1] : null;
      if (nextValue && !nextValue.includes("--")) {
        return __spreadProps(__spreadValues({}, result), {
          [arg]: nextValue
        });
      }
    }
    return result;
  }, {});
}
var telemetryPreHook = (command) => __async(void 0, null, function* () {
  const availableCommands = command.commands.map((cmd) => cmd._name);
  const [commandName = "create", ...args] = command.args;
  if (!availableCommands.includes(commandName)) {
    return yield telemetry5.track("create", __spreadValues({}, parseArguments(args)));
  }
  return yield telemetry5.track(commandName, __spreadValues({}, parseArguments(args)));
});
var telemetryPostHook = () => __async(void 0, null, function* () {
  yield telemetry5.analytics.closeAndFlush();
});

// src/index.ts
console.log(chalk6.cyanBright(`
\u25E2 ${package_default.name} v${package_default.version}
`));
program.name(package_default.name).version(package_default.version).description("A command line tool to create a new Catalyst project.").addCommand(create, { isDefault: true }).addCommand(init).addCommand(integration).addCommand(telemetry4).hook("preAction", telemetryPreHook).hook("postAction", telemetryPostHook);
program.parse(process.argv);
//# sourceMappingURL=index.js.map