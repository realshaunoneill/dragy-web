export type TimeMetric = "zeroToHundred" | "hundredToTwoHundred" | "quarterMile"

export interface CarData {
  id: string
  make: string
  model: string
  year: number
  zeroToHundred: number | null
  hundredToTwoHundred: number | null
  quarterMile: number | null
  power: number | null
  modifications: string[] | null
}

export interface CarListResponse {
  err: number,
  errMsg: string,
  data: {
    car_list: CarList[],
    self_ranking: [],
    count: number,
  },
  selfChanged: {},
}

export interface CarList {
  id: string
  userId: string
  addTime: string
  results: string
  type: string
  models: string
  address: string
  name: string
  userChineseName: any
  icon: string
  gender: string
  temperature: string
  modified: string
  brand_name: string
  testTime: string
  distance: string
  series: string
  car_decade: string
  drive_mode: string
  intakeFrom: string
  displacement: string
  modifiedBrandIds: string
  trapspeed: string
  appVersion: string
  version: string
  country: string
  iso2: string
  city: string
  province: string
}
