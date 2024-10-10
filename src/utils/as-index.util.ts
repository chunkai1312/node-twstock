import { Index } from '../enums';

export function asIndex(index: string) {
  const indices: Record<string, string> = {
    '發行量加權股價指數': Index.TAIEX,
    '未含金融指數': Index.NonFinance,
    '未含電子指數': Index.NonElectronics,
    '未含金融電子指數': Index.NonFinanceNonElectronics,
    '水泥類指數': Index.Cement,
    '食品類指數': Index.Food,
    '塑膠類指數': Index.Plastic,
    '水泥窯製類指數': Index.CementAndCeramic,
    '塑膠化工類指數': Index.PlasticAndChemical,
    '機電類指數': Index.Electrical,
    '紡織纖維類指數': Index.Textiles,
    '電機機械類指數': Index.ElectricMachinery,
    '電器電纜類指數': Index.ElectricalAndCable,
    '化學生技醫療類指數': Index.ChemicalBiotechnologyAndMedicalCare,
    '化學類指數': Index.Chemical,
    '生技醫療類指數': Index.BiotechnologyAndMedicalCare,
    '玻璃陶瓷類指數': Index.GlassAndCeramic,
    '造紙類指數': Index.PaperAndPulp,
    '鋼鐵類指數': Index.IronAndSteel,
    '橡膠類指數': Index.Rubber,
    '汽車類指數': Index.Automobile,
    '電子工業類指數': Index.Electronics,
    '半導體類指數': Index.Semiconductors,
    '電腦及週邊設備類指數': Index.ComputerAndPeripheralEquipment,
    '光電類指數': Index.Optoelectronics,
    '通信網路類指數': Index.CommunicationsTechnologyAndInternet,
    '電子零組件類指數': Index.ElectronicPartsComponents,
    '電子通路類指數': Index.ElectronicProductsDistirbution,
    '資訊服務類指數': Index.InformationService,
    '其他電子類指數': Index.OtherElectronics,
    '建材營造類指數': Index.BuildingMaterialsAndConstruction,
    '航運類指數': Index.ShippingAndTransportation,
    '觀光餐旅類指數': Index.TourismAndHospitality,
    '金融保險類指數': Index.FinancialAndInsurance,
    '貿易百貨類指數': Index.TradingAndConsumerGoods,
    '油電燃氣類指數': Index.OilGasAndElectricity,
    '其他類指數': Index.Other,
    '綠能環保類指數': Index.GreenEnergyAndEnvironmentalServices,
    '數位雲端類指數': Index.DigitalAndCloudServices,
    '運動休閒類指數': Index.SportsAndLeisure,
    '居家生活類指數': Index.Household,
    '櫃買指數': Index.TPEX,
    '櫃買紡纖類指數': Index.TPExTextiles,
    '櫃買機械類指數': Index.TPExElectricMachinery,
    '櫃買鋼鐵類指數': Index.TPExIronAndSteel,
    '櫃買電子類指數': Index.TPExElectronic,
    '櫃買營建類指數': Index.TPExBuildingMaterialsAndConstruction,
    '櫃買航運類指數': Index.TPExShippingAndTransportation,
    '櫃買觀光餐旅類指數': Index.TPExTourismAndHospitality,
    '櫃買化工類指數': Index.TPExChemical,
    '櫃買生技醫療類指數': Index.TPExBiotechnologyAndMedicalCare,
    '櫃買半導體類指數': Index.TPExSemiconductors,
    '櫃買電腦及週邊類指數': Index.TPExComputerAndPeripheralEquipment,
    '櫃買光電業類指數': Index.TPExOptoelectronic,
    '櫃買通信網路類指數': Index.TPExCommunicationsAndInternet,
    '櫃買電子零組件類指數': Index.TPExElectronicPartsComponents,
    '櫃買電子通路類指數': Index.TPExElectronicProductsDistribution,
    '櫃買資訊服務類指數': Index.TPExInformationService,
    '櫃買文化創意業類指數': Index.TPExCulturalAndCreative,
    '櫃買其他電子類指數': Index.TPExOtherElectronic,
    '櫃買其他類指數': Index.TPExOther,
    '櫃買綠能環保類指數': Index.TPExGreenEnergyAndEnvironmentalServices,
    '櫃買數位雲端類指數': Index.TPExDigitalAndCloudServices,
    '櫃買居家生活類指數': Index.TPExHousehold,

    /* 其他別稱 */
    '加權股價': Index.TAIEX,
    '未含金融': Index.NonFinance,
    '未含電子': Index.NonElectronics,
    '未含金融電子': Index.NonFinanceNonElectronics,
    '綜合平均': '綜合平均',
    '工業平均': '工業平均',
    '水泥類': Index.Cement,
    '水泥工業': Index.Cement,
    '水泥工業類': Index.Cement,
    '食品類': Index.Food,
    '食品工業': Index.Food,
    '食品工業類': Index.Food,
    '塑膠類': Index.Plastic,
    '塑膠工業': Index.Plastic,
    '塑膠工業類': Index.Plastic,
    '紡織纖維': Index.Textiles,
    '紡織纖維類': Index.Textiles,
    '電機機械': Index.ElectricMachinery,
    '電機機械類': Index.ElectricMachinery,
    '電器電纜': Index.ElectricalAndCable,
    '電器電纜類': Index.ElectricalAndCable,
    '化學工業類': Index.ChemicalBiotechnologyAndMedicalCare,
    '化學生技醫': Index.ChemicalBiotechnologyAndMedicalCare,
    '化學生技醫療': Index.ChemicalBiotechnologyAndMedicalCare,
    '化學生技醫療類': Index.ChemicalBiotechnologyAndMedicalCare,
    '玻璃陶瓷': Index.GlassAndCeramic,
    '玻璃陶瓷類': Index.GlassAndCeramic,
    '造紙類': Index.PaperAndPulp,
    '造紙工業': Index.PaperAndPulp,
    '造紙工業類': Index.PaperAndPulp,
    '鋼鐵類': Index.IronAndSteel,
    '鋼鐵工業': Index.IronAndSteel,
    '鋼鐵工業類': Index.IronAndSteel,
    '橡膠類': Index.Rubber,
    '橡膠工業': Index.Rubber,
    '橡膠工業類': Index.Rubber,
    '汽車類':  Index.Automobile,
    '汽車工業':  Index.Automobile,
    '汽車工業類':  Index.Automobile,
    '電子類': Index.Electronics,
    '電子工業': Index.Electronics,
    '電子工業類': Index.Electronics,
    '建材營造': Index.BuildingMaterialsAndConstruction,
    '營造建材類': Index.BuildingMaterialsAndConstruction,
    '建材營造類': Index.BuildingMaterialsAndConstruction,
    '運輸類': Index.ShippingAndTransportation,
    '航運業': Index.ShippingAndTransportation,
    '航運業類': Index.ShippingAndTransportation,
    '觀光類': Index.TourismAndHospitality,
    '觀光事業': Index.TourismAndHospitality,
    '觀光事業類': Index.TourismAndHospitality,
    '金融保險': Index.FinancialAndInsurance,
    '金融保險類': Index.FinancialAndInsurance,
    '貿易百貨': Index.TradingAndConsumerGoods,
    '百貨貿易類': Index.TradingAndConsumerGoods,
    '貿易百貨類': Index.TradingAndConsumerGoods,
    '百貨貿易類指數': Index.TradingAndConsumerGoods,
    '其它': Index.Other,
    '其它類': Index.Other,
    '其他': Index.Other,
    '其他類': Index.Other,
    '化學工業': Index.Chemical,
    '生技醫療': Index.BiotechnologyAndMedicalCare,
    '油電燃氣': Index.OilGasAndElectricity,
    '半導體': Index.Semiconductors,
    '電腦及週邊設備': Index.ComputerAndPeripheralEquipment,
    '光電': Index.Optoelectronics,
    '通信網路': Index.CommunicationsTechnologyAndInternet,
    '電子零組件': Index.ElectronicPartsComponents,
    '電子通路': Index.ElectronicProductsDistirbution,
    '資訊服務': Index.InformationService,
    '其他電子': Index.OtherElectronics,
    '未含金融保險股指數': Index.NonFinance,
    '未含電子股指數': Index.NonElectronics,
    '未含金融電子股指數': Index.NonFinanceNonElectronics,
    '電子類指數': Index.Electronics,
    '觀光類指數': Index.TourismAndHospitality,
    '航運業類指數': Index.ShippingAndTransportation,
    '觀光事業類指數': Index.TourismAndHospitality,
    '櫃買觀光類指數': Index.TPExTourismAndHospitality,
    '櫃買生技類指數': Index.TPExBiotechnologyAndMedicalCare,
    '櫃買電腦週邊類指數': Index.TPExComputerAndPeripheralEquipment,
    '櫃買光電類指數': Index.TPExOptoelectronic,
    '櫃買電子零件類指數': Index.TPExElectronicPartsComponents,
    '櫃買文化創意類指數': Index.TPExCulturalAndCreative,
    '櫃買紡織纖維類指數': Index.TPExTextiles,
    '櫃買電機機械類指數': Index.TPExElectricMachinery,
    '櫃買鋼鐵工業類指數': Index.TPExIronAndSteel,
    '櫃買建材營造類指數': Index.TPExBuildingMaterialsAndConstruction,
    '櫃買航運業類指數': Index.TPExShippingAndTransportation,
    '櫃買化學工業類指數': Index.TPExChemical,
    '櫃買半導體業類指數': Index.TPExSemiconductors,
    '櫃買電腦週邊業類指數': Index.TPExComputerAndPeripheralEquipment,
    '櫃買通信網路業類指數': Index.TPExCommunicationsAndInternet,
    '櫃買電子零組件業類指數': Index.TPExElectronicPartsComponents,
    '櫃買電子通路業類指數': Index.TPExElectronicProductsDistribution,
    '櫃買資訊服務業類指數': Index.TPExInformationService,
    '櫃買其他電子業類指數': Index.TPExOtherElectronic,
    '櫃買電子工業類指數': Index.TPExElectronic,
    '櫃買電腦及週邊設備業類指數': Index.TPExComputerAndPeripheralEquipment,
    '櫃買觀光事業類指數': Index.TPExTourismAndHospitality,
    '櫃買紡纖纖維類指數': Index.TPExTextiles,
    '櫃買線上遊戲類指數': Index.TPExGame,
  };
  return indices[index];
}
