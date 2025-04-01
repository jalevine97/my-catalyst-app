interface DocumentDecoration<Result = Record<string, any>, Variables = Record<string, any>> {
    /** Type to support `@graphql-typed-document-node/core`
     * @internal
     */
    __apiType?: (variables: Variables) => Result;
    /** Type to support `TypedQueryDocumentNode` from `graphql`
     * @internal
     */
    __ensureTypesOfVariablesAndResultMatching?: (variables: Variables) => Result;
}

interface Config<FetcherRequestInit extends RequestInit = RequestInit> {
    storeHash: string;
    storefrontToken: string;
    xAuthToken: string;
    channelId?: string;
    platform?: string;
    backendUserAgentExtensions?: string;
    logger?: boolean;
    getChannelId?: (defaultChannelId: string) => Promise<string> | string;
    beforeRequest?: (fetchOptions?: FetcherRequestInit) => Promise<Partial<FetcherRequestInit> | undefined> | Partial<FetcherRequestInit> | undefined;
}
interface BigCommerceResponseError {
    message: string;
    locations: Array<{
        line: number;
        column: number;
    }>;
    path: string[];
}
interface BigCommerceResponse<T> {
    data: T;
    errors?: BigCommerceResponseError[];
}
declare class Client<FetcherRequestInit extends RequestInit = RequestInit> {
    private config;
    private backendUserAgent;
    private readonly defaultChannelId;
    private getChannelId;
    private beforeRequest?;
    private trustedProxySecret;
    constructor(config: Config<FetcherRequestInit>);
    fetch<TResult, TVariables extends Record<string, unknown>>(config: {
        document: DocumentDecoration<TResult, TVariables>;
        variables: TVariables;
        customerAccessToken?: string;
        fetchOptions?: FetcherRequestInit;
        channelId?: string;
    }): Promise<BigCommerceResponse<TResult>>;
    fetch<TResult>(config: {
        document: DocumentDecoration<TResult, Record<string, never>>;
        variables?: undefined;
        customerAccessToken?: string;
        fetchOptions?: FetcherRequestInit;
        channelId?: string;
    }): Promise<BigCommerceResponse<TResult>>;
    fetchShippingZones(): Promise<unknown>;
    fetchSitemapIndex(channelId?: string): Promise<string>;
    private getCanonicalUrl;
    private getGraphQLEndpoint;
    private requestLogger;
}
declare function createClient<FetcherRequestInit extends RequestInit = RequestInit>(config: Config<FetcherRequestInit>): Client<FetcherRequestInit>;

declare class BigCommerceAPIError extends Error {
    status: number;
    graphqlErrors: unknown[];
    constructor(status: number, graphqlErrors?: unknown[]);
    static createFromResponse(response: Response): Promise<BigCommerceAPIError>;
}

type Maybe<T> = T | null;
interface Connection<T> {
    edges?: Maybe<Array<Maybe<Edge<T>>>> | undefined;
}
interface Edge<T> {
    node: T;
}
declare const removeEdgesAndNodes: <T>(array: Connection<T>) => T[];

export { BigCommerceAPIError, createClient, removeEdgesAndNodes };
