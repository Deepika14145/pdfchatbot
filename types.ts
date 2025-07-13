export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  file?: {
    name: string;
    type: string;
  };
}