export interface VideoData {
  id: string;
  title: string;
  summary: string;
  transcript: string;
  mindMap: MindMapNode[];
}

export interface MindMapNode {
  id: string;
  name: string;
  val: number;
  links?: { source: string; target: string }[];
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko';