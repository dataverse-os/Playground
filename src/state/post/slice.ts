import { getDatatokenInfo as _getDatatokenInfo } from "@/sdk";
// import { PostStream } from "@/types";
import { web3Storage } from "@/utils";
import { StreamRecord } from "@dataverse/dataverse-connector";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";

interface Props {
  isEncrypting?: boolean;
  encryptedContent?: string;
  isEncryptedSuccessfully?: boolean;
  isPublishingPost: boolean;
  sortedStreamsMap: Record<string, StreamRecord>;
}

const initialState: Props = {
  isEncrypting: false,
  encryptedContent: "",
  isEncryptedSuccessfully: false,
  isPublishingPost: false,
  sortedStreamsMap: {},
};

export const uploadImg = createAsyncThunk(
  "post/uploadImg",
  async ({ files }: { files: File[] }): Promise<string[]> => {
    const imgCIDs = await Promise.all(
      files.map((file) => web3Storage.storeFiles([file]))
    );
    const imgUrls = imgCIDs.map((cid) => `https://${cid}.ipfs.w3s.link`);
    return imgUrls;
  }
);

export const getDatatokenInfo = createAsyncThunk(
  "post/getDatatokenInfo",
  async ({ address }: { address: string }) => {
    const res = await _getDatatokenInfo({
      address,
    });
    return res;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setIsPublishingPost: (state, action: PayloadAction<boolean>) => {
      state.isPublishingPost = action.payload;
    },
    setSortedStreamsMap: (state, action: PayloadAction<Record<string, StreamRecord>>) => {
      state.sortedStreamsMap = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadImg.pending, (state) => {
      state.isPublishingPost = true;
    });
    builder.addCase(uploadImg.fulfilled, (state, action) => {
      state.isPublishingPost = false;
    });
    builder.addCase(uploadImg.rejected, (state) => {
      state.isPublishingPost = false;
    });
    //getDatatokenInfo
    // builder.addCase(getDatatokenInfo.pending, (state, action) => {
    //   const postStreamList = JSON.parse(
    //     JSON.stringify(current(state.postStreamList))
    //   ) as PostStream[];
    //   postStreamList.find((postStream) => {
    //     if (postStream.streamRecord.streamContent.file.datatokenId === action.meta.arg.address) {
    //       postStream = {
    //         ...postStream,
    //         isGettingDatatokenInfo: true,
    //       };
    //     }
    //   });
    //   state.postStreamList = postStreamList;
    // });
    // builder.addCase(getDatatokenInfo.fulfilled, (state, action) => {
    //   const postStreamList = JSON.parse(
    //     JSON.stringify(current(state.postStreamList))
    //   ) as PostStream[];
    //   postStreamList.find((postStream) => {
    //     if (postStream.streamRecord.streamContent.file.datatokenId === action.meta.arg.address) {
    //       postStream.datatokenInfo = {
    //         ...postStream.datatokenInfo,
    //         ...action.payload,
    //       };
    //       postStream = {
    //         ...postStream,
    //         isGettingDatatokenInfo: false,
    //         hasGotDatatokenInfo: true,
    //       };
    //     }
    //   });
    //   state.postStreamList = postStreamList;
    // });

    // builder.addCase(getDatatokenInfo.rejected, (state, action) => {
    //   const postStreamList = JSON.parse(
    //     JSON.stringify(current(state.postStreamList))
    //   ) as PostStream[];
    //   postStreamList.find((postStream) => {
    //     if (postStream.streamRecord.streamContent.file.datatokenId === action.meta.arg.address) {
    //       postStream = {
    //         ...postStream,
    //         isGettingDatatokenInfo: false,
    //         hasGotDatatokenInfo: true,
    //       };
    //     }
    //   });
    //   state.postStreamList = postStreamList;
    // });
  },
});

export default postSlice.reducer;
