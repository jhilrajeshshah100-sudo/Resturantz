
export enum Screen {
  LANDING = 'landing',
  HOME = 'home',
  DINING = 'dining',
  GUESTS = 'guests',
  PROFILE = 'profile',
  CHAT = 'chat',
  CONCIERGE = 'concierge'
}

export interface DiningVenue {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: string;
  type: string;
  menu?: string[];
}

export interface SocialActivity {
  id: string;
  title: string;
  time: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  avatar: string;
  time: string;
  isMe: boolean;
}
