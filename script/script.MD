### defer async

  - defer: 异步加载，等到页面加载完毕后执行，按照加载顺序执行
  - async: 异步加载，会阻塞dom渲染，加载完毕后立即执行 可用于内联脚本(页面内部script标签包裹的js，而非通过src引入的js)
  - crossorigin: cors资源跨域时使用
  - type: 默认为text/javascript,以js的方式解析文本，也可以是module，以es6模块化的方式解析文本，module模式下，不会阻塞dom,异步加载，相当于defer

### DOMContentLoaded/load  
   - https://juejin.cn/post/7027728332972113927
   - DOMContentLoaded：当纯HTML被完全加载以及解析时，DOMContentLoaded 事件会被触发，而不必等待样式表，图片或者子框架完成加载。也就是只要页面DOM加载完成就触发，无需等待依赖资源的加载。
   - load：当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发load事件。
 