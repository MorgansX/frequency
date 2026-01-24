export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  votes: number;
  codec: string;
  bitrate: number;
  clickcount: number;
  clicktrend: number;
  lastchangetime: string;
  lastcheckok: number;
  lastchecktime: string;
}

export interface SearchParams {
  name?: string;
  country?: string;
  language?: string;
  tag?: string;
  limit?: number;
  offset?: number;
  order?: 'name' | 'votes' | 'clickcount' | 'bitrate';
  reverse?: boolean;
}
