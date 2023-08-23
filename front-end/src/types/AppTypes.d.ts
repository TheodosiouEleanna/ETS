export interface IContextState {
  file: IFile;
  selectedDocID: string;
  currentPage: number;
  pageCount: number;
  loading: boolean;
  pdfDimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  userInfo: IUserInfo;
  userSettingsApi: IUserSettings;
  userSettingsUi: IUserSettings;
  isMenuOpen: boolean;
  selectedEyeTracker: {
    device_name: string;
  };
  isEyeTrackerConnected: boolean;
}

export interface IAction {
  type: string;
  payload?: any;
}

export interface IFile {
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
  // TODO: add more fields here as needed.
}
