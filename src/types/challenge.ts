export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  word: string;
  description: string;
  isCompleted: boolean;
  reward: number;
}
