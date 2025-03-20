export interface Battleground {
    id: string;
    red: RedOrBlue;
    blue: RedOrBlue;
    latest: boolean;
    start: string;
    end: string;
    limit: number;
    winner: string;
    isOpen: boolean;
  }
  export interface RedOrBlue {
    users?: (UsersEntity)[] | null;
    spend: number;
    isOpen: boolean;
  }
  export interface UsersEntity {
    id: number;
    spend: number;
  }
  