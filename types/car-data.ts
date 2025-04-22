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

export interface CarDetails {
  dsc: string
  iconList: string
  addTime: string
  address: string
  userChineseName: any
  type: string
  graph_data: string
  temperature: string
  alias: string
  models: string
  slope: string
  acceleration: string
  modified: string
  likeNum: string
  commentNum: string
  results: string
  name: string
  icon: string
  distance: string
  height_difference: string
  modifiedId: string
  userId: string
  gender: string
  series: string
  car_decade: string
  drive_mode: string
  intakeFrom: string
  displacement: string
  brand_name: string
  modifiedBrandIds: string
  appVersion: string
  version: string
  garageId: string
  longitude: string
  latitude: string
  altitude: string
  density: string
  max_g_value: string
  testTime: string
  likeType: number
  country: string
  iso2: string
  city: string
  province: string
}

export interface CarDetailsResponse {
  err: number
  errMsg: string
  data: {
    carResults: CarDetails
  }
  selfChanged: {}
}

export interface DataInfo {
  dataArr: {
    speed: number
    heading: number
    satelliteNum: number
    sAcc: number
    acceleration: number
    headAcc: number
    sv4: number
    longitude: number
    time: number
    latitude: number
    hAcc: number
    accuracy: number
    altitude: number
    vAcc: number
    hDOP: number
    fixType: number
  }[]
  contentMode: any[]
  detail: Detail[]
  contentId: any[]
  relationId: string
  endSpeedVersion: string
}
export interface Detail {
  seat: number
  isContent: boolean
  name: string
  time: number
}
