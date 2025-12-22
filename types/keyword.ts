export type KeywordConvertResult = {
  original: string;
  normalized: string;
};

export type KeywordAnalysis = {
  tag: string;
  summary: string;
  relatedIssues: string[];
};

export type MainKeywordItem = {
  tag: string;
  active: boolean;
};

export type MainKeywordList = MainKeywordItem[];
