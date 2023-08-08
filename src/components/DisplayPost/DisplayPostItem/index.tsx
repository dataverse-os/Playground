import AccountStatus from "@/components/AccountStatus";
import { addressAbbreviation, getAddressFromDid, timeAgo } from "@/utils";
import {
  PropsWithoutRef,
  PropsWithRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FileType, StreamRecord } from "@dataverse/dataverse-connector";
import { Wrapper, Content, CreatedAt, Footer } from "./styled";
import React from "react";
import Text from "./Text";
import Images from "./Images";
import UnlockInfo from "./UnlockInfo";
import { Header } from "./styled";
import { FlexRow } from "@/styled";
import { useApp, useStore, useUnlockStream } from "@dataverse/hooks";
import { DatatokenInfo } from "@/types";
import { usePlaygroundStore } from "@/context";
import { Message } from "@arco-design/web-react";

interface DisplayPostItemProps extends PropsWithRef<any> {
  streamId: string;
}

const DisplayPostItem: React.FC<DisplayPostItemProps> = ({ streamId }) => {
  // const navigate = useNavigate();

  const {
    playgroundState: { modelParser, isDataverseExtension },
    setNoExtensionModalVisible,
    setIsConnecting,
  } = usePlaygroundStore();
  const { state, dataverseConnector } = useStore();
  const streamRecord = useMemo(() => {
    return state.streamsMap[streamId];
  }, [state.streamsMap]);

  const [datatokenInfo, setDatatokenInfo] = useState<DatatokenInfo>();
  const [isGettingDatatokenInfo, setIsGettingDatatokenInfo] =
    useState<boolean>(false);
  const { isPending: isConnectingApp, connectApp } = useApp({
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
  const { isPending, isSucceed, unlockStream } = useUnlockStream({
    onPending: () => {
      if (isDataverseExtension === false) {
        setNoExtensionModalVisible(true);
        return;
      }
    },
    onError: (error: any) => {
      console.error(error);
      Message.error(error?.message ?? error);
    },
  });

  useEffect(() => {
    if (
      !datatokenInfo &&
      !isGettingDatatokenInfo &&
      streamRecord.streamContent.file.fileType === FileType.Datatoken
    ) {
      initDatatokenInfo();
    }
  }, [state.streamsMap]);

  const initDatatokenInfo = async () => {
    setIsGettingDatatokenInfo(true);
    try {
      const datatokenInfo = await dataverseConnector.getDatatokenBaseInfo(
        streamRecord.streamContent.file.datatokenId
      );
      setDatatokenInfo(datatokenInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGettingDatatokenInfo(false);
    }
  };

  const unlock = async () => {
    if (!state.pkh) {
      try {
        await connectApp({ appId: modelParser.appId });
      } catch (error) {
        console.error(error);
        return;
      }
    }

    if (isPending || isSucceed) {
      console.log("cannot unlock");
      return;
    }

    await unlockStream(streamId);
  };

  return (
    <Wrapper>
      <Content>
        <Header>
          <FlexRow>
            <AccountStatus
              name={
                addressAbbreviation(getAddressFromDid(streamRecord.pkh)) ?? ""
              }
              did={streamRecord.pkh}
            />
            <CreatedAt>
              {"• " +
                timeAgo(
                  Date.parse(streamRecord.streamContent.content.createdAt)
                )}
            </CreatedAt>
          </FlexRow>
          {streamRecord.streamContent.file.fileType !== FileType.Public && (
            <UnlockInfo
              streamRecord={streamRecord}
              isPending={isPending || isConnectingApp}
              isSucceed={isSucceed}
              datatokenInfo={datatokenInfo}
              unlock={unlock}
            />
          )}
        </Header>

        <Text
          streamRecord={streamRecord}
          isUnlockSucceed={isSucceed}
          onClick={() => {
            // navigate("/post/" + streamRecord.streamId);
          }}
        />
        <Images
          streamRecord={streamRecord}
          isUnlockSucceed={isSucceed}
          isGettingDatatokenInfo={isGettingDatatokenInfo}
          onClick={() => {
            // navigate("/post/" + streamRecord.streamId);
          }}
        />
        {/* <Footer>
          <a
            href={`${process.env.DATAVERSE_OS}/finder`}
            target="_blank"
            className="link"
          >
            View on DataverseOS File System
          </a>
        </Footer> */}
      </Content>
    </Wrapper>
  );
};

export default DisplayPostItem;
