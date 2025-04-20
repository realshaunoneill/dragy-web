export type TimeMetric =
  | "zeroToHundred"
  | "hundredToTwoHundred"
  | "quarterMile";

export interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  zeroToHundred: number | null;
  hundredToTwoHundred: number | null;
  quarterMile: number | null;
  power: number | null;
  modifications: string[] | null;
}

export interface CarListResponse {
  err: number;
  errMsg: string;
  data: {
    car_list: CarList[];
    self_ranking: [];
    count: number;
  };
  selfChanged: {};
}

export interface CarTimeResponse {
  code: string;
  data: {
    data: CarTime[];
  };
  msg: string;
}

export interface CarList {
  id: string;
  userId: string;
  addTime: string;
  results: string;
  type: string;
  models: string;
  address: string;
  name: string;
  userChineseName: any;
  icon: string;
  gender: string;
  temperature: string;
  modified: string;
  brand_name: string;
  testTime: string;
  distance: string;
  series: string;
  car_decade: string;
  drive_mode: string;
  intakeFrom: string;
  displacement: string;
  modifiedBrandIds: string;
  trapspeed: string;
  appVersion: string;
  version: string;
  country: string;
  iso2: string;
  city: string;
  province: string;
}

export interface CarTime {
  acceleration: number;
  address: string;
  addressid: number;
  addtime: number;
  alias: string;
  altitude: string;
  appVersion: number;
  commentnum: number;
  createTime: string;
  density: string;
  distance: number;
  dsc: string;
  garageid: number;
  heightDifference: number;
  iconlist: string;
  id: number;
  isShowByMonth: number;
  isshow: number;
  latitude: string;
  likenum: number;
  longitude: string;
  maxGVaule: string;
  modifiedBrandIds: string;
  relateForum: number;
  results: number;
  runid: string;
  slope: number;
  temperature: string;
  testTimestamp: string;
  testid: string;
  testtime: string;
  trapspeed: string;
  type: number;
  updateTime: string;
  userCarid: number;
  userid: number;
  version: string;
}

export interface UserDetails {
  appVersion: number;
  carBankingList: string;
  city: string;
  commentNum: number;
  content: {
    testId: string;
  };
  country: string;
  createTime: string;
  garage: {
    brandLogo: string;
    brandName: string;
    carDecade: string;
    carid: number;
    displacement: string;
    driveMode: string;
    garageid: number;
    icon: string;
    id: number;
    intakefrom: string;
    models: string;
    modified: string;
    modifiedBrandIds: string;
    modifiedid: string;
    series: string;
    userid: string;
  };
  id: number;
  isDelete: number;
  isFavorite: number;
  isFollow: number;
  isRecommend: number;
  isThumbsUp: number;
  iso2: string;
  iso3: string;
  likeNum: number;
  location: string;
  province: string;
  pubTime: string;
  pubTimestamp: string;
  tags: string;
  type: number;
  updateTime: string;
  usedGarage: {
    brandLogo: string;
    brandName: string;
    carDecade: string;
    carid: number;
    displacement: string;
    driveMode: string;
    garageid: number;
    icon: string;
    id: number;
    intakefrom: string;
    models: string;
    modified: string;
    modifiedBrandIds: string;
    modifiedid: string;
    series: string;
    userid: string;
  };
  userIcon: string;
  userId: number;
  username: string;
  viewCount: number;
  viewsNum: number;
}

export interface UserDetailsResponse {
  code: string;
  data: {
    data: UserDetails[];
    index: number;
    page: number;
  };
  msg: string;
}
