import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import theme from 'react-syntax-highlighter/dist/cjs/styles/prism/tomorrow';

const renderers = {
  code: ({ language, value }) => {
    return <SyntaxHighlighter style={theme} language={language} children={value} />
  }
}

export const Markdown = memo((props) => {
  return (
    <ReactMarkdown plugins={[gfm]} renderers={renderers} {...props} />
  )
});
