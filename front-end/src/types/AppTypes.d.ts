export interface IContextProps {
  file?: File;
  selectedDocID: string;
  currentPage: number;
  pageCount: number;
  scrollTop: number;
  loading: boolean;
  pdfDimensions: IPdfDimensions;
  userInfo: IUserInfo;
  userSettingsApi: IUserSettings;
  userSettingsUi: IUserSettings;
  isMenuOpen: boolean;
  selectedEyeTracker: IEyeTracker;
  isEyeTrackerConnected: boolean;
  isCalibrating: boolean;
  calibrationProcess: Record<string, any> | null;
  shouldSubscribe: boolean;
  pageMounted: boolean;
  loadFile?: (file?: File) => void;
  setSelectedDocID?: (id: ID) => void;
  setCurrentPage?: (pageNumber: number) => void;
  setPageCount?: (pageCount: number) => void;
  setUserInfo?: (userInfo: IUserInfo) => void;
  setLoading?: (loading: boolean) => void;
  logout: () => void;
  setUserSettingsUi?: (userSettings: Part) => void;
  setUserSettingsApi?: (userSettings: IUserSettings) => void;
  setPdfDimensions?: (dimensions: IPdfDimensions) => void;
  goToNextPage?: () => void;
  goToPrevPage?: () => void;
  setScrollTop?: (scrollTop: number) => void;
  setIsMenuOpen?: (isOpen: boolean) => void;
  setSelectedEyeTracker?: (eyeTracker: IEyeTracker) => void;
  setIsEyeTrackerConnected?: (isConnected: boolean) => void;
  setIsCalibrating?: (isCalibrating: boolean) => void;
  setCalibrationProcess?: (payload: Record<string, any> | null) => void;
  setShouldSubscribe?: (shouldSubscribe: boolean) => void;
  setPageMounted?: () => void;
}

interface ISingleScaledWordCoords {
  pageNum: number;
  wordCoords: ScaledWord;
}
interface IScaledWordCoords {
  word: string;
  wordCoords: ScaledWord;
}
interface ScaledWord {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface IWordPositions {
  box: number[];
  confidence: number;
  word: string;
}

export interface IContextValues extends IContextState {}

export interface IAction {
  type: string;
  payload?: any;
}

export interface File {
  size: number;
}

export interface IUserInfo {
  isLoggedIn: boolean;
  userID: string;
  username: string;
}

export interface IUserSettings {
  language: string;
  theme: string;
  zoom: number;
}

export interface IEyeTracker {
  device_name: string;
  model?: string;
  address?: string;
  serial_number?: string;
  firmware_version?: string;
  runtime_version?: string;
  // TODO: add more fields here as needed.
}

export interface IPdfDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export type DebounceFn = (...args: any[]) => void;

export type ID = string | number;

export interface Document {
  docID: ID;
  docName: string;
  lastReadPage: number;
  uploadDate: string;
}

export type ConnectionStatus =
  | "error"
  | "searching"
  | "connected"
  | "selection"
  | "";

export interface GazeData {
  left_gaze_point_on_display_area: [number, number];
  right_gaze_point_on_display_area: [number, number];
  right_gaze_point_validity: any;
  left_gaze_point_validity: any;
  left_gaze_point_in_user_coordinate_system: any;
  right_gaze_point_in_user_coordinate_system: any;
  // Todo: add other fields
}
export interface CalibrationPoint {
  x: number;
  y: number;
}

interface IWordPositionsState {
  wordsLoading: boolean;
  wordPositions: { data: IWordPositions[]; page: number }[];
  wordsScreenPositions: IScaledWordCoords[];
  setWordPositions?: (
    wordPositions: { data: IWordPositions[]; page: number }[]
  ) => void;
  setWordsScreenPositions?: (wordPositions: IScaledWordCoords[]) => void;
}

export interface IWordPositionsAction {
  type: string;
  payload: any;
}
