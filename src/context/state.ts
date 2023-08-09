import { ModelParser, Output } from "@dataverse/model-parser";
import { PlaygroundActionType, PlaygroundStateType } from "@/types";
import _ from "lodash";
import app from "../../output/app.json";

export const initialState: PlaygroundStateType = {
  appVersion: "0.0.1",
  modelParser: new ModelParser(app as Output),
  sortedStreamIds: [],
  isDataverseExtension: undefined,
  isNoExtensionModalVisible: false,
  isConnecting: false,
};

export const reducer = (
  state: PlaygroundStateType,
  action: {
    type: PlaygroundActionType;
    payload: any;
  },
) => {
  const { type, payload } = action;

  switch (type) {
    case PlaygroundActionType.SetSortedStreamIds:
      state.sortedStreamIds = payload;
      break;
    case PlaygroundActionType.SetIsDataverseExtension:
      state.isDataverseExtension = payload;
      break;
    case PlaygroundActionType.SetNoExtensionModalVisible:
      state.isNoExtensionModalVisible = payload;
      break;
    case PlaygroundActionType.SetIsConnecting:
      state.isConnecting = payload;
      break;
  }
  return _.cloneDeep(state);
};
