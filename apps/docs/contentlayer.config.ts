import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import shiki from "shiki";

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string" },
    date: { type: "date" },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^docs\//, ""),
    },
  },
}));

export default makeSource({
  // 内容所在位置的路径，相对于项目根目录。
  contentDirPath: "src/content",
  //   Your schema definitions for your project
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
//   BUG
  highlight: {
    highlighter: async (code, lang) => {
      const highlighter = await shiki.getHighlighter({ theme: "github-dark" }); // 使用高级主题
      return highlighter.codeToHtml(code, { lang });
    },
    langs: ["js", "ts", "jsx", "tsx", "html", "css", "md", "mdx", "sh", "json"], // 支持语言
  },
});
