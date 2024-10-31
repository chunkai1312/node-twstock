export interface FutOptInstitutional {
  date: string;
  exchange: string;
  symbol: string;
  name: string;
  institutional: Array<{
    investor: string;
    longTradeVolume: number;
    longTradeValue: number;
    shortTradeVolume: number;
    shortTradeValue: number;
    netTradeVolume: number;
    netTradeValue: number;
    longOiVolume: number;
    longOiValue: number;
    shortOiVolume: number;
    shortOiValue: number;
    netOiVolume: number;
    netOiValue: number;
  }>;
}
