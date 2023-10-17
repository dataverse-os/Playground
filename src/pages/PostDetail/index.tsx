import React from "react";

import { useParams } from "react-router-dom";

import { Wrapper } from "./styled";

import CommentEditor from "@/components/Comment/CommentEditor";
import Hint from "@/components/Comment/Hint";
import DisplayPostItem from "@/components/DisplayPost/DisplayPostItem";
import Header from "@/layout/Header";

const PostDetail: React.FC = () => {
  const { streamId } = useParams();

  return (
    <Wrapper>
      <div className='header'>
        <Header />
      </div>
      <div className='main'>
        <div className='post'>
          <DisplayPostItem fileId={streamId!} />
          <div className='comment-list'>
            <CommentEditor onSubmit={content => console.log(content)} />
            <Hint text='Be the first one to comment' />
            {/* <Comment
              author="Alice"
              userId="alice"
              content="This is a great article!"
              avatar="https://robohash.org/1"
            />
            <Comment
              author="Alice"
              userId="alice"
              content="This is a great article!"
              avatar="https://robohash.org/2"
            /> */}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default PostDetail;
