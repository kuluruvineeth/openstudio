// Base Interfaces
export interface UrlInfo {
  url: string;
  width: number;
  height: number;
}

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface Status {
  privacyStatus: string;
}

export interface ResourceId {
  kind: string;
  videoId: string;
}

// Thumbnails Interface
export interface Thumbnails {
  default: UrlInfo;
  medium: UrlInfo;
  high: UrlInfo;
  standard?: UrlInfo; // Optional, as not all thumbnails might have a standard size
  maxres?: UrlInfo; // Optional, as not all thumbnails might have a maxres size
}

// Snippet Interface
export interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: ResourceId;
  videoOwnerChannelTitle: string;
  videoOwnerChannelId: string;
}

// Content Details Interface
export interface ContentDetails {
  videoId: string;
  videoPublishedAt: string;
}

// Item Interface
export interface Item<T = Snippet, U = ContentDetails, V = Status> {
  kind: string;
  etag: string;
  id: string;
  snippet: T;
  contentDetails: U;
  status: V;
}

// Data Interface
export interface Data<T = Item> {
  kind: string;
  etag: string;
  nextPageToken: string;
  items: T[];
  pageInfo: PageInfo;
}

// Params Interface
export interface Params {
  part: string[];
  playlistId: string;
}

// Headers Interfaces
export interface Headers {
  "x-google-api-client": string;
  "Accept-Encoding": string;
  "User-Agent": string;
  Authorization: string;
}

export interface ResponseHeaders {
  "alt-svc": string;
  "cache-control": string;
  connection: string;
  "content-encoding": string;
  "content-type": string;
  date: string;
  server: string;
  "transfer-encoding": string;
  vary: string;
  "x-content-type-options": string;
  "x-frame-options": string;
  "x-xss-protection": string;
}

// User Agent Directive Interface
export interface UserAgentDirective {
  product: string;
  version: string;
  comment: string;
}

// Config Interface
export interface Config {
  url: string;
  method: string;
  apiVersion: string;
  userAgentDirectives: UserAgentDirective[];
  headers: Headers;
  params: Params;
  retry: boolean;
  responseType: string;
}

// Request Interface
export interface Request {
  responseURL: string;
}

// PlaylistItem Interface
export interface PlaylistItem<T = Data> {
  config: Config;
  data: T;
  headers: ResponseHeaders;
  status: number;
  statusText: string;
  request: Request;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
}
