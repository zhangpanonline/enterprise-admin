1. 启用 "verbatimModuleSyntax" 后，为何仅类型导入能避免运行时错误？  

    > 启用时，`import { RouteRecordRaw } from 'vue-router'`， ts提示：“RouteRecordRaw”是一种类型，必须在启用 "verbatimModuleSyntax" 时使用仅类型导入进行导入。

    > 在 TypeScript 中，"verbatimModuleSyntax" 是一个编译器选项，用于让模块语法更贴近 ECMAScript 标准。启用该选项后，TypeScript 不再为未找到的导入项生成兼容性代码，而是直接将模块语法原样输出到生成的 JavaScript 文件中。  
    例如：`import { someValue } from 'module'`，目标模块中并未实际导出该值，会导致运行时错误。这是因为此选项下，TypeScript 不再为未找到的导入项生成兼容性代码。  
    然而，类型导入（如 `import type { SomeType } from 'module'`）不会引发此类问题。原因在于类型导入仅在编译阶段起作用，用于类型检查和声明，最终会被完全移除，不会影响运行时逻辑。因此，即使目标模块中没有对应的类型定义，也不会导致运行时错误，因为这些信息本就不会进入生成的 JavaScript 文件。  
    这一特性强调了在启用了 "verbatimModuleSyntax" 的项目中，明确区分类型导入与值导入的重要性，以确保代码的健壮性和正确性。

2. `src/vite-env.d.ts 文件作用是什么？`
    > vite-env.d.ts 是 Vite 项目中用于 类型声明补充 的文件，通常用于告诉 TypeScript Vite 环境下的一些全局类型（比如 import.meta、.env 文件、静态资源模块等），从而避免类型报错。