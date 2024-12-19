import React from "react";

type QueryResponseProps = {
  text: string;
  attachments: any[];
};

const QueryResponse: React.FC<QueryResponseProps> = ({ text, attachments }) => {
  return (
    <div className=" w-full">
      <p className="mb-4">{text}</p>
      {/* {attachments.length > 0 && (
        <div>
          <IntentsFeed
          />
        </div>
      )} */}
    </div>
  );
};

export default QueryResponse;
