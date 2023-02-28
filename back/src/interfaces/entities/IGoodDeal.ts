import { GoodDealVote } from "../../entities/gooDealVote";

export interface IGoodDeal {
  goodDealId: number;
  goodDealTitle: string;
  goodDealLink?: string;
  goodDealContent: string;
  goodDealVotes: GoodDealVote[];
  image?: string;
  createdAt: Date;
}
