export type KeywordConvertResult = {
  originalKeyword: string;
  englishKeyword: string;
};

export type GlobalMacro = {
  us: string;
  china: string;
  eu: string;
  japan: string;
};

export type DailyBriefing = {
  keyIssues: string[];
  globalMacro: GlobalMacro;
  summary: string;
};