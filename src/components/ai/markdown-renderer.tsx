'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Styled tables
        table: ({ children }) => (
          <div className="overflow-x-auto my-3">
            <table className="min-w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-violet-50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-semibold text-violet-900 border-b border-gray-200">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 border-b border-gray-100">{children}</td>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
        ),
        // Styled lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-sm">{children}</li>
        ),
        // Styled headings
        h1: ({ children }) => (
          <h1 className="text-lg font-bold mt-3 mb-2 text-gray-900">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-semibold mt-3 mb-2 text-gray-800">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold mt-2 mb-1 text-gray-700">{children}</h3>
        ),
        // Styled code
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="bg-gray-100 text-violet-700 px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            );
          }
          return (
            <code className="block bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-2">{children}</pre>
        ),
        // Styled paragraphs
        p: ({ children }) => (
          <p className="my-1.5 leading-relaxed">{children}</p>
        ),
        // Styled strong/bold
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        // Styled blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-violet-300 pl-3 my-2 text-gray-600 italic">
            {children}
          </blockquote>
        ),
        // Styled links
        a: ({ children, href }) => (
          <a href={href} className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
