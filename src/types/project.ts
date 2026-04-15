export interface ProjectBase {
  id: string;
  title: string;
  year: number;
  stack: string[];
  description: string;
  repoUrl?: string;
}

export interface WebProject extends ProjectBase {
  type: 'web';
  liveUrl: string;
  posterSrc: string;
  videoSrc?: string;
}

export type ChatMessage =
  | { from: 'bot'; text: string; timestamp?: string; buttons?: string[][] }
  | { from: 'user'; text: string; timestamp?: string };

export interface TelegramProject extends ProjectBase {
  type: 'telegram';
  botUsername: string;
  botUrl: string;
  chatScript: ChatMessage[];
}

export type Project = WebProject | TelegramProject;
