import { useEffect, useMemo } from "react";
import DisplayPostItem from "./DisplayPostItem";
import PublishPost from "@/components/PublishPost";
import { StreamRecordMap } from "@/types";
import { usePlaygroundStore } from "@/context";
import { detectDataverseExtension } from "@dataverse/utils";
import { ceramic } from "@/sdk";
import { useAction, useFeeds, useStore } from "@dataverse/hooks";
import { Wrapper } from "./styled";
import { FileType } from "@dataverse/dataverse-connector";
import LoadingPostItem from "./LoadingPostItem";
import { useApp } from "@dataverse/hooks";

const DisplayPost = () => {
  const {
    modelParser,
    appVersion,
    sortedStreamIds,
    setIsDataverseExtension,
    setSortedStreamIds,
    setIsConnecting,
  } = usePlaygroundStore();
  const postModel = useMemo(() => {
    return modelParser.getModelByName("post");
  }, []);
  const indexFilesModel = useMemo(() => {
    return modelParser.getModelByName("indexFiles");
  }, []);

  const { streamsMap } = useStore();
  const { actionLoadStreams } = useAction();
  const { loadFeeds } = useFeeds();

  const { connectApp } = useApp({
    onPending: () => {
      setIsConnecting(true);
    },
    onError: () => {
      setIsConnecting(false);
    },
    onSuccess: () => {
      setIsConnecting(false);
    },
  });

  useEffect(() => {
    detectDataverseExtension().then(res => {
      setIsDataverseExtension(res);
      if (res === true) {
        console.log("load with extension");
        loadFeeds(postModel.streams[postModel.streams.length - 1].modelId);
      } else if (res === false) {
        console.log("load with ceramic");
        loadFeedsByCeramic();
      }
    });
  }, []);

  useEffect(() => {
    if (streamsMap) {
      const _sortedStreamIds = Object.keys(streamsMap)
        .filter(
          el =>
            streamsMap[el].pkh &&
            streamsMap[el].streamContent.content.appVersion === appVersion &&
            streamsMap[el].streamContent.file &&
            streamsMap[el].streamContent.file.fileType !== FileType.Private,
        )
        .sort(
          (a, b) =>
            Date.parse(streamsMap[b].streamContent.content.createdAt) -
            Date.parse(streamsMap[a].streamContent.content.createdAt),
        );

      setSortedStreamIds(_sortedStreamIds);
    }
  }, [streamsMap]);

  const loadFeedsByCeramic = async () => {
    const postStreams = await ceramic.loadStreamsByModel(
      postModel.streams[postModel.streams.length - 1].modelId,
    );
    const indexedFilesStreams = await ceramic.loadStreamsByModel(
      indexFilesModel.streams[postModel.streams.length - 1].modelId,
    );
    const ceramicStreamsRecordMap: StreamRecordMap = {};
    Object.entries(postStreams).forEach(([streamId, content]) => {
      ceramicStreamsRecordMap[streamId] = {
        appId: modelParser.appId,
        modelId: postModel.streams[postModel.streams.length - 1].modelId,
        pkh: content.controller,
        streamContent: {
          content,
        },
      };
    });

    Object.values(indexedFilesStreams).forEach(file => {
      if (ceramicStreamsRecordMap[file.contentId]) {
        ceramicStreamsRecordMap[file.contentId].streamContent.file = file;
      }
    });

    actionLoadStreams(ceramicStreamsRecordMap);
  };

  return (
    <>
      <Wrapper>
        <PublishPost
          modelId={postModel.streams[postModel.streams.length - 1].modelId}
          connectApp={connectApp}
        />
        {!streamsMap ? (
          <>
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
          </>
        ) : (
          sortedStreamIds.map((streamId, index) =>
            index % 2 == 1 ? (
              <DisplayPostItem
                streamId={streamId}
                key={streamId}
                connectApp={connectApp}
              />
            ) : undefined,
          )
        )}
      </Wrapper>
      <Wrapper>
        {!streamsMap ? (
          <>
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
            <LoadingPostItem />
          </>
        ) : (
          sortedStreamIds.map((streamId, index) =>
            index % 2 == 0 ? (
              <DisplayPostItem
                streamId={streamId}
                key={streamId}
                connectApp={connectApp}
              />
            ) : undefined,
          )
        )}
      </Wrapper>
    </>
  );
};

export default DisplayPost;
