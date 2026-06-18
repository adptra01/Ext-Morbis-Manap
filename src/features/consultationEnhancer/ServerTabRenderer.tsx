import React from "react";

interface Props {
  html: string;
}

export default function ServerTabRenderer({ html }: Props) {
  return <div className="cons-raw-html" dangerouslySetInnerHTML={{ __html: html }} />;
}
