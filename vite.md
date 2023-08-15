## vite首屏加载缓慢，长时间白屏	

- vite不同于webpack，vite基于es模块，而webpack基于commonJS，所以在编译处理时，不用将代码进行降级处理

- vite在启动项目阶段不会将所有代码，编译-压缩-打包，在项目启动阶段，仅加载部分第三方依赖，而剩下工作则交给浏览器，在首次加载页面时进行剩余处理，浏览器加载哪个页面，就家在对应页面所需要的依赖项，这样极大提高了项目启动时间，随之而来的问题就是整个项目首次加载速度较为缓慢，尤其当单个页面依赖更多资源时，浏览器加载速度会更慢

- 静态资源处理：
  - 进入浏览器加载阶段时，vite会将vue文件转为js文件以供浏览器识别，将css预处理器（sass、less）语言编译为css，向html注入热更新脚本



## 依赖预构建

- 只有bare import（裸模块）会进行预构建

- 步骤：依赖扫描、源码解析
- 扫描大体流程
  - **裸模块**：通过模块id（import vue from 'vue'，from后面就是模块id，）判断，id不是以**.**或**./**开头的路径的记录为裸模块，将其保存在 deps（vite将所有的裸模块和其他依赖都保存在该对象中）对象中，并将**裸模块添加到deps.external数组中**，将该模块标记为external
  - **js模块**：将代码转换为AST(抽象语法树)进行分析，获取import的模块，**深度遍历这些模块**
  - **html/vue模块**：将其中js模块进行分离，**按照js模块进行深度遍历**
    - 在处理html/vue模块时，只获取js部分，**内联script会将内容作为虚拟模块（借助打包工具在编译代码的过程中生成，实际是不存在的）引入，外联script（通过src引入的js/ts脚本），转化为import引入**
      - 虚拟模块为何存在：html文件允许内部有多个script，但是多个script无法被处理为一个js文件，只能将其转为多个虚拟模块使用
  - **其他模块**：可通过后缀名进行判断，例如***.css**这类模块在深度遍历的过程中被esbuild记录为external，就**不会进行深度解析**
  - **CSS Modules,Sass/Less**等模块都有自己的依赖管理方式，**css**通过**生成唯一类名**实现模块隔离，**sass/less**通过**@import导入**实现模块化
  - 等待扫描完毕，**deps对象中就保存了所有的依赖信息**，在扫描过程中，**vite注重每个模块的处理**，并不关心打包结果

- **vite**使用**esbuild**打包工具代替了深度遍历，因为打包本身就是一个深度遍历的过程

- **esbuild** 可以在解析过程，指定当前解析的模块为 **external**，则 esbuild **不再深入解析和加载该模块**。

- **手动干预依赖与构建**：

  - 在预构建阶段，vite不会**构建node_modules以外的包**，如果需要预构建，可以vite.config.ts中配置**optimizeDeps.include**，

  - ```typescript
    export default defineConfig({
      optimizeDeps: {
        include: ['my-lib/components/**/*.vue'],
      },
    })
    ```

  - 同理，也可指定node_modules中**不需要被预构建的依赖**

  - ```typescript
    // CommonJS 的依赖不应该排除在优化外。如果一个 ESM 依赖被排除在优化外，但是却有一个嵌套的 CommonJS 依赖，则应该为该 CommonJS 依赖添加 optimizeDeps.include。例如：
    export default defineConfig({
      optimizeDeps: {
        include: ['esm-dep > cjs-dep'], // 此处ES规范的esm-dep依赖于cjs-dep的CommonJS规范	
      },
    })
    ```

  - optimizeDeps.**esbuildOptions**用于指定 esbuild 打包器的选项。常用的选项包括：

    - minify：是否启用代码压缩。默认为 false。
    - target：打包的目标环境。可以是 "es2015", "es2016", "es2017", "es2018", "es2019", "es2020", "es2021", "esnext" 或 "nodeX"，其中 X 是 Node.js 的版本号。默认为 "es2018"。
    - jsxFactory：用于指定 JSX 转换函数的名称。
    - jsxFragment：用于指定 JSX 片段转换函数的名称。

  - ```typescript
    export default defineConfig({
      optimizeDeps: {
       esbuildOptions: {
          minify: true,
          target: 'es2019',
        },
      },
    })
    ```

    

#### 裸模块

 - 通过模块名访问，而不是路径

 - ```javascript
   // vue 是 bare import 
   import vue from "vue"
   import xxx from "vue/xxx"
   
   // 以下不是 bare import 
   import foo from "./foo.ts"  
   import foo from "/foo.ts" 
   ```



#### 为什么只有裸模块会进行预构建？

- 裸模块一般是npm安装的模块，不会轻易改变，所以预构建速度相对较快，而开发者手写的代码由于经常修改，如果进行预构建，会大大提高预构建的时间
- 裸模块是指没有被其他模块引用的文件，vite利用es模块特性，将裸模块按需加载
- 预构建全部模块会增加不必要的构建成本和编译时间。只预构建裸模块可以最大化启动速度,同时减少构建负担

- vite通过判断实际路径是否在node_modules中，对裸模块和开发者手写代码进行区分
- vite之所以只对裸模块进行预构建，是为了提供更快的开发构建速度和更好的开发体验。通过利用裸模块的增量构建和浏览器原生的模块热重载，Vite使得前端开发更加高效和方便。

#### Vite打包时，按需加载elementplus

- 使用 `vite-plugin-style-import` 插件

- ```typescript
  import styleImport from 'vite-plugin-style-import'
  
  export default {
    plugins: [
      styleImport({
        libs: [
          {
            libraryName: 'element-plus',
            esModule: true,
            ensureStyleFile: true, // 确保样式文件存在
            resolveStyle: (name) => { // 解析样式文件路径，返回样式文件路径
              name = name.slice(3)
              return `element-plus/packages/theme-chalk/src/${name}.scss`
            },
            resolveComponent: (name) => {  // 解析组价文件路径，返回组件文件路径
              return `element-plus/lib/${name}`
            }
          }
        ]
      })
    ]
  }
  ```




## Vite热更新

- 前端修改代码，vite server监听到有修改
- vite计算热更新模块
- vite server通过websocket告诉vite client 需要热更新
- 浏览器请求对应修改代码
- 执行修改后的代码









