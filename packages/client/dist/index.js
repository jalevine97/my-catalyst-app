"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BigCommerceAPIError: () => BigCommerceAPIError,
  createClient: () => createClient,
  removeEdgesAndNodes: () => removeEdgesAndNodes
});
module.exports = __toCommonJS(src_exports);

// src/error.ts
var BigCommerceAPIError = class _BigCommerceAPIError extends Error {
  constructor(status, graphqlErrors = []) {
    const message = `
    BigCommerce API returned ${status}
    ${graphqlErrors.map((error) => JSON.stringify(error, null, 2)).join("\n")}
    `;
    super(message);
    this.status = status;
    this.graphqlErrors = graphqlErrors;
    this.name = "BigCommerceAPIError";
  }
  static async createFromResponse(response) {
    try {
      const errorResponse = await response.json();
      assertIsErrorResponse(errorResponse);
      return new _BigCommerceAPIError(response.status, errorResponse.errors);
    } catch {
      return new _BigCommerceAPIError(response.status);
    }
  }
};
function assertIsErrorResponse(value) {
  if (typeof value !== "object" || value === null) {
    throw new Error("Expected maybeError to be an object");
  }
  if (!("errors" in value)) {
    throw new Error("Expected maybeError to have an errors property");
  }
}

// src/utils/getOperationName.ts
var import_graphql = require("@0no-co/graphql.web");
function isOperationDefinitionNode(node) {
  return node.kind === "OperationDefinition";
}
var getOperationInfo = (document) => {
  const documentNode = (0, import_graphql.parse)(document);
  const operationInfo = documentNode.definitions.filter(isOperationDefinitionNode).map((def) => {
    var _a;
    return {
      name: (_a = def.name) == null ? void 0 : _a.value,
      type: def.operation
    };
  })[0];
  return operationInfo;
};

// src/utils/normalizeQuery.ts
var import_graphql2 = require("@0no-co/graphql.web");
function normalizeQuery(query) {
  if (typeof query === "string") {
    return query;
  }
  if (query instanceof String) {
    return query.toString();
  }
  if ("kind" in query) {
    return (0, import_graphql2.print)(query);
  }
  throw new Error("Invalid query type");
}

// src/utils/userAgent.ts
var import_std_env = require("std-env");

// package.json
var package_default = {
  name: "@bigcommerce/catalyst-client",
  description: "BigCommerce API client for Catalyst.",
  version: "0.14.0",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: {
    build: "tsup",
    dev: "tsup --watch",
    typecheck: "tsc --noEmit",
    lint: "eslint . --ext .ts,.js,.cjs --max-warnings 0",
    "lint-fix": "eslint . --ext .ts,.js,.cjs --fix",
    "gen-types": "dotenv -e .env.local -- node scripts/types.js"
  },
  files: [
    "dist"
  ],
  dependencies: {
    "@0no-co/graphql.web": "^1.0.12",
    "std-env": "^3.8.0"
  },
  devDependencies: {
    "@bigcommerce/eslint-config": "^2.10.0",
    "@bigcommerce/eslint-config-catalyst": "workspace:^",
    "@types/node": "^20.17.10",
    "dotenv-cli": "^7.4.4",
    eslint: "^8.57.1",
    prettier: "^3.4.2",
    tsup: "^8.3.5",
    typescript: "^5.7.2"
  }
};

// src/utils/userAgent.ts
var { name, version } = package_default;
var getPlatform = () => {
  const keysOfInterest = [import_std_env.runtime, import_std_env.provider, import_std_env.nodeVersion, import_std_env.process.env.NODE_ENV].filter(Boolean);
  return keysOfInterest.join("; ");
};
var detectedPlatform = getPlatform();
var getBackendUserAgent = (platform, extensions) => {
  const userAgentParts = [`${name}/${version}`];
  const platformValue = platform ?? detectedPlatform;
  userAgentParts.push(`(${platformValue})`);
  if (extensions) {
    userAgentParts.push(extensions);
  }
  return userAgentParts.join(" ");
};

// src/client.ts
var graphqlApiDomain = process.env.BIGCOMMERCE_GRAPHQL_API_DOMAIN ?? "mybigcommerce.com";
var adminApiHostname = process.env.BIGCOMMERCE_ADMIN_API_HOST ?? "api.bigcommerce.com";
var Client = class {
  constructor(config) {
    this.config = config;
    if (!config.channelId) {
      throw new Error("Client configuration must include a channelId.");
    }
    this.defaultChannelId = config.channelId;
    this.backendUserAgent = getBackendUserAgent(config.platform, config.backendUserAgentExtensions);
    this.getChannelId = config.getChannelId ? config.getChannelId : (defaultChannelId) => defaultChannelId;
    this.beforeRequest = config.beforeRequest;
  }
  backendUserAgent;
  defaultChannelId;
  getChannelId;
  beforeRequest;
  trustedProxySecret = process.env.BIGCOMMERCE_TRUSTED_PROXY_SECRET;
  async fetch({
    document,
    variables,
    customerAccessToken,
    fetchOptions = {},
    channelId
  }) {
    var _a;
    const { headers = {}, ...rest } = fetchOptions;
    const query = normalizeQuery(document);
    const log = this.requestLogger(query);
    const graphqlUrl = await this.getGraphQLEndpoint(channelId);
    const { headers: additionalFetchHeaders = {}, ...additionalFetchOptions } = await ((_a = this.beforeRequest) == null ? void 0 : _a.call(this, fetchOptions)) ?? {};
    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.storefrontToken}`,
        "User-Agent": this.backendUserAgent,
        ...customerAccessToken && { "X-Bc-Customer-Access-Token": customerAccessToken },
        ...this.trustedProxySecret && { "X-BC-Trusted-Proxy-Secret": this.trustedProxySecret },
        ...additionalFetchHeaders,
        ...headers
      },
      body: JSON.stringify({
        query,
        ...variables && { variables }
      }),
      ...additionalFetchOptions,
      ...rest
    });
    if (!response.ok) {
      throw await BigCommerceAPIError.createFromResponse(response);
    }
    log(response);
    return response.json();
  }
  async fetchShippingZones() {
    const response = await fetch(
      `https://${adminApiHostname}/stores/${this.config.storeHash}/v2/shipping/zones`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Auth-Token": this.config.xAuthToken,
          "User-Agent": this.backendUserAgent
        }
      }
    );
    if (!response.ok) {
      throw new Error(`Unable to get Shipping Zones: ${response.statusText}`);
    }
    return response.json();
  }
  async fetchSitemapIndex(channelId) {
    const sitemapIndexUrl = `${await this.getCanonicalUrl(channelId)}/xmlsitemap.php`;
    const response = await fetch(sitemapIndexUrl, {
      method: "GET",
      headers: {
        Accept: "application/xml",
        "Content-Type": "application/xml",
        "User-Agent": this.backendUserAgent,
        ...this.trustedProxySecret && { "X-BC-Trusted-Proxy-Secret": this.trustedProxySecret }
      }
    });
    if (!response.ok) {
      throw new Error(`Unable to get Sitemap Index: ${response.statusText}`);
    }
    return response.text();
  }
  async getCanonicalUrl(channelId) {
    const resolvedChannelId = channelId ?? await this.getChannelId(this.defaultChannelId);
    return `https://store-${this.config.storeHash}-${resolvedChannelId}.${graphqlApiDomain}`;
  }
  async getGraphQLEndpoint(channelId) {
    return `${await this.getCanonicalUrl(channelId)}/graphql`;
  }
  requestLogger(document) {
    if (!this.config.logger) {
      return () => {
      };
    }
    const { name: name2, type } = getOperationInfo(document);
    const timeStart = Date.now();
    return (response) => {
      const timeEnd = Date.now();
      const duration = timeEnd - timeStart;
      const complexity = response.headers.get("x-bc-graphql-complexity");
      console.log(
        `[BigCommerce] ${type} ${name2 ?? "anonymous"} - ${duration}ms - complexity ${complexity ?? "unknown"}`
      );
    };
  }
};
function createClient(config) {
  return new Client(config);
}

// src/utils/removeEdgesAndNodes.ts
var removeEdgesAndNodes = (array) => {
  if (!array.edges) {
    return [];
  }
  return array.edges.filter((edge) => edge !== null).map((edge) => edge.node);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BigCommerceAPIError,
  createClient,
  removeEdgesAndNodes
});
