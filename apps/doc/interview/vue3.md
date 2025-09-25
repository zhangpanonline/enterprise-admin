---
sidebar_position: 1
---

# Vue3

## 1. 请解释Vue 3中Composition API的核心概念，以及它与Options API的区别。为什么在大型项目中更推荐使用Composition API？请用TypeScript示例说明一个简单的Composition API用法。

Composition API是Vue 3引入的一种新的组件编写方式，  
* 核心是通过setup函数（或`<script setup>`语法糖）组织组件逻辑。  
* 使用 ref、reactive、computed、watch 等 API 直接操作响应式数据。  
* 使用自定义的composable(组合)函数来实现逻辑复用。  
相比Options API，Composition API的逻辑组织更灵活，代码按功能聚合而不是按类型（如data、methods）分散。

与Options API的区别：
1. **代码组织方式：** Options API将组件逻辑分散在data、methods、computed等选项中，同一个功能的代码可能分布在不同地方，难以维护。Composition API允许将相关逻辑（如一个计数器的状态、方法和计算属性）放在一起，提升可读性和维护性。 
2. **逻辑复用性：** Options API复用逻辑通常依赖mixins，但mixins有命名冲突和隐式依赖问题。Composition API通过composable函数（如useCounter）实现逻辑复用，代码更清晰且易于测试。
3. **类型推导：** Composition API与TypeScript结合更友好，ref和reactive可以显式定义类型，而Options API的this上下文类型推导复杂。
4. **灵活性：** Composition API没有固定的结构，可以自由组织代码，适合复杂组件。

为什么大型项目推荐Composition API：
* 代码组织： 逻辑按功能聚合，减少大型组件的维护成本。
* 复用性：composable函数便于提取和共享逻辑，减少重复代码。
* TypeScript支持：类型安全的代码更适合大型团队协作，减少运行时错误。
* 维护性：composable函数独立于组件，易于维护。

TypeScript示例：
```typescript
<script setup lang="ts">
import { ref, computed } from 'vue';

// 定义composable函数
function useCounter() {
  // 定义响应式状态
  const count = ref<number>(0);
  // 定义方法
  const increment = () => {
    count.value++;
  };
  return { count, increment };
}

// 使用composable
const { count, increment } = useCounter();
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

## 2. 在Vue 3中使用Vue Router时，如何实现动态路由和导航守卫？请结合TypeScript给出代码示例。

在Vue 3中，Vue Router是用于管理路由的官方库。动态路由指的是通过参数化路由（如/user/:id）或程序化添加路由（如router.addRoute）来动态生成页面，通常用于根据用户数据或角色加载不同路由。导航守卫则是用于控制路由跳转的钩子函数，比如beforeEach可以用来实现鉴权、跳转拦截等功能。两者结合可以实现灵活的路由管理和权限控制。

### 动态路由的实现
* 参数化路由：通过在路由路径中定义动态参数（如/user/:id），可以根据参数动态渲染组件。
* 程序化添加路由：使用router.addRoute动态添加路由，例如根据用户角色加载特定模块的路由。
* 典型场景：如为不同用户动态生成个人页面，或根据权限动态加载管理面板。

### 导航守卫的实现
* 使用beforeEach全局守卫检查用户权限，决定是否允许访问目标路由。
* 通过路由的meta字段定义额外信息（如isAuth表示需要登录），结合TypeScript类型确保代码安全。

### 代码示例
1. 路由配置（包含动态路由）： 
    ```typescript
    // router/index.ts
    import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
    import Home from '../views/Home.vue';
    import User from '../views/User.vue';
    import Login from '../views/Login.vue';

    // 定义meta字段的类型
    interface RouteMeta {
      isAuth?: boolean;
      title?: string;
    }

    // 路由配置
    const routes: RouteRecordRaw[] = [
      {
        path: '/',
        name: 'home',
        component: Home,
        meta: { title: 'Home' },
      },
      {
        path: '/user/:id', // 动态路由
        name: 'user',
        component: User,
        meta: { isAuth: true, title: 'User Profile' },
      },
      {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { title: 'Login' },
      },
    ];

    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    // 动态添加路由（示例：根据用户角色）
    function addDynamicRoutes(role: string) {
      if (role === 'admin') {
        router.addRoute({
          path: '/admin',
          name: 'admin',
          component: () => import('../views/Admin.vue'),
          meta: { isAuth: true, title: 'Admin Panel' },
        });
      }
    }

    export default router;
    ```
2. 导航守卫（结合鉴权）：
    ```typescript
    // router/guards.ts
    import router from './index';
    import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

    // 模拟鉴权函数
    function isAuthenticated(): boolean {
      return !!localStorage.getItem('token');
    }

    // 全局前置守卫
    router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized): boolean | { name: string } => {
      const requiresAuth = to.meta.isAuth as boolean | undefined;

      if (requiresAuth) {
        if (isAuthenticated()) {
          return true; // 允许导航
        } else {
          return { name: 'login' }; // 未登录，重定向到登录页
        }
      }
      return true; // 无需鉴权，直接通过
    });
   ```  

3. 组件中使用动态路由：

    ```typescript
    // views/User.vue
    <script setup lang="ts">
    import { useRoute } from 'vue-router';
    import { ref, onMounted } from 'vue';

    const route = useRoute();
    const userId = ref<string>('');

    // 获取动态路由参数
    onMounted(() => {
      userId.value = route.params.id as string;
    });
    </script>

    <template>
      <div>
        <h1>User Profile: {{ userId }}</h1>
      </div>
    </template>
    ```

## 3. 在Vue 3中，Pinia是如何管理状态的？请结合TypeScript展示一个Pinia Store的定义和使用方式，并说明它与Vuex的区别。

### Pinia状态管理机制
Pinia是Vue 3的官方状态管理库，基于Vue的响应式系统（ref、reactive）管理状态。每个Pinia Store是一个独立的响应式对象，通过defineStore定义，内部可以包含状态（ref或reactive）、getters（类似计算属性）和actions（同步或异步方法）。Pinia通过useStore钩子与Vue组件集成，组件可以直接访问Store的响应式状态并自动更新视图。Pinia支持两种Store定义方式：Setup Store（函数式，推荐）和Option Store（类似Vuex）。相比Vuex，Pinia设计更轻量，API更简洁，且与TypeScript深度集成。

### 与Vuex的区别
1. 模块化设计：
    * Vuex使用单一的全局Store，所有状态通过模块组织，配置复杂。
    * Pinia允许多个独立的Store，天然支持模块化，无需复杂的模块注册。
2. API设计：
    * Vuex依赖state、getters、mutations和actions，需要显式提交mutations来修改状态。
    * Pinia去掉了mutations，状态可以直接修改（如store.count++），API更直观。
3. TypeScript支持：
    * Vuex的类型推导较弱，尤其是动态模块和this上下文。
    * Pinia与TypeScript深度集成，ref和reactive的类型推导更强，Store支持类型导出。
4. 性能和体积：
    * Pinia更轻量（约1KB），移除了Vuex的一些冗余功能（如严格模式）。
    * Pinia利用Vue 3的Proxy响应式系统，性能更优。

### 代码示例
1. 定义Pinia Store：
    ```typescript
    // stores/user.ts
    import { defineStore } from 'pinia';
    import { ref, reactive, computed } from 'vue';

    // 定义用户类型
    interface User {
      userName: string;
      age: number | null;
    }

    // 定义Store返回值的类型
    interface UserStore {
      user: User;
      token: string;
      fullName: string;
      setToken: (newToken: string) => void;
      fetchUser: () => Promise<void>;
    }

    export const useUserStore = defineStore<'user', UserStore>('user', () => {
      // 响应式状态
      const user = reactive<User>({
        userName: '',
        age: null,
      });

      const token = ref<string>('');

      // Getter
      const fullName = computed(() => `${user.userName || 'Guest'}'s Profile`);

      // Action
      function setToken(newToken: string) {
        token.value = newToken;
      }

      // 异步Action
      async function fetchUser() {
        try {
          const response = await fetch('/api/user');
          const data = await response.json();
          user.userName = data.userName;
          user.age = data.age;
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }

      return { user, token, fullName, setToken, fetchUser };
    });
    ```
2. 在组件中使用Store：
    ```typescript
    // views/UserProfile.vue
    <script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '../stores/user';

    const userStore = useUserStore();

    // 直接访问响应式状态
    const { user, token, fullName } = storeToRefs(userStore);

    // 调用action
    const updateToken = () => {
      userStore.setToken('new-token');
    };

    // 异步获取用户数据
    onMounted(() => {
      userStore.fetchUser();
    });
    </script>

    <template>
      <div>
        <h1>{{ fullName }}</h1>
        <p>Username: {{ user.userName }}</p>
        <p>Age: {{ user.age ?? 'Unknown' }}</p>
        <p>Token: {{ token }}</p>
        <button @click="updateToken">Update Token</button>
      </div>
    </template>
    ```

## 4. 在Vite项目中，如何优化构建性能？请结合Vue 3和TypeScript，说明常见优化手段并提供配置示例。

在Vue 3项目中使用Vite作为构建工具，可以通过多种方式优化构建性能，包括代码分包、CDN引入、按需加载、Tree Shaking、代码压缩等。这些优化手段可以减少打包体积、提升首屏加载速度，并提高生产环境的性能。以下是常见优化手段的说明，以及结合Vue 3和TypeScript的配置示例。

### 常见优化手段：

1. 代码分包（Code Splitting）：
    * 实现方式：Vite内置支持代码分割，通过动态导入（import()）实现按需加载。例如，在Vue 3中可以通过路由 懒加载将组件按路由拆分为多个chunk。
    * 效果：减少首屏加载的JS体积，提升加载速度。
    * 适用场景：适用于路由较多的大型Vue 3项目。
2. CDN引入外部依赖：
    * 实现方式：通过Vite的external配置将大型库（如Vue、Pinia）从打包中排除，使用CDN加载。
    * 效果：减少打包体积，利用CDN的缓存和分布式加速。
    * 注意事项：需确保CDN可靠，并配置降级方案（如本地副本）。
3. 按需加载（Lazy Loading）：
    * 实现方式：结合Vue 3的动态组件或异步组件，按需加载非关键组件。
    * 效果：延迟加载次要模块，优化首屏渲染。
      > 动态组件、异步组件、 import() 动态导入什么区别？  
      > `---------------`动态组件：  `<component :is="currentComponent" />`
      > * currentComponent 可以是：
      >   * 已经 全局注册 或 局部注册 的组件对象
      >   * 组件名字符串（注册过的组件）
      > * 特点：  
      >   * 组件已经存在（在打包时就引入了）, 运行时切换组件
      >   * 切换时不会再请求新资源，只是 Vue 重新渲染组件, 组件已经在打包中
      >   * 可以和 v-if、keep-alive 结合优化性能, 不会触发额外网络请求  
      >
      > `---------------`异步组件是指 Vue 允许你 懒加载组件，只有在使用时才去加载：
      > ```ts
      > import { defineAsyncComponent } from 'vue';
      > // 方式一
      > const AsyncFoo = defineAsyncComponent(() => import('./Foo.vue'));
      > // 方式二
      > const AsyncFoo = defineAsyncComponent({
      >   loader: () => import('./Foo.vue'),
      >   loadingComponent: Loading,
      >   errorComponent: ErrorComp,
      >   delay: 200,      // 200ms 后显示 loading
      >   timeout: 3000    // 3s 后失败显示 error
      > });
      > ```
      > * 特点总结：
      >   * 真正 懒加载，只有使用时才请求 JS 文件
      >   * 打包时会生成 独立的 chunk
      >   * 可减少首屏体积，优化加载性能  
      >
      > `---------------`import() 动态导入  
      > import() 是 原生 ES 模块语法，不仅限于 Vue
      > * 特点：
      >   * 返回一个 Promise
      >   * 支持懒加载模块或组件
      >   * 在 Vue 异步组件里，import() 是最常用的方式
      > * 区别：
      >   * 动态导入可以用于任何模块，不仅仅是 Vue 组件
      >   * 异步组件是 Vue 对动态导入的封装，自动处理加载状态和渲染
      >
      > `---------------`对比总结   
      > * `<component :is>` = “我已经有组件了，只是运行时选择显示哪个”
      > * 异步组件 = “我暂时不加载组件，等用户需要时再加载”
      > * import() = “JS 原生动态导入模块”，异步组件内部就是用它来懒加载 Vue 组件  
      >
      >| 特性                   | 动态组件 (`<component :is>`) | 异步组件 (`defineAsyncComponent`) | `import()` |
      >| -------------------- | ------------------------ | ----------------------------- | ---------- |
      >| 加载时机                 | 打包时就已加载                  | 使用时才加载                        | 使用时才加载     |
      >| 是否生成独立 chunk         | 否                        | 是                             | 是          |
      >| 是否需要 Promise         | 否                        | 是                             | 是          |
      >| 适用范围                 | Vue 已注册组件                | Vue 组件懒加载                     | 任意模块       |
      >| 首屏体积优化               | 无                        | 可以                            | 可以         |
      >| 是否可以设置 loading/error | 否                        | 可以                            | 需要自己实现     |

4. Tree Shaking：
    * 实现方式：Vite基于esbuild和Rollup，默认支持Tree Shaking，自动移除未使用的代码。
    * 效果：减少打包后的JS文件大小。
    * 适用场景：使用ESM模块化的库（如Lodash-es）时效果显著。
5. 代码压缩：
    * 实现方式：Vite使用esbuild进行开发时快速构建，生产环境默认使用esbuild压缩代码，可通过build.minify配置。
    * 效果：减小JS/CSS文件体积，加快加载。
6. 图片优化：
    * 实现方式：使用vite-plugin-image-optimizer等插件压缩图片，或将小图片转为Base64内联。
    * 效果：减少静态资源体积，优化加载速度。

### 代码示例
1. Vite配置文件（结合TypeScript）：
    ```typescript
    // vite.config.ts
    import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    import { visualizer } from 'rollup-plugin-visualizer';

    // 定义环境变量类型
    interface ImportMetaEnv {
      readonly VITE_API_URL: string;
    }

    // 优化配置
    export default defineConfig({
      plugins: [
        vue(),
        visualizer(), // 分析打包体积
      ],
      build: {
        minify: 'terser', // 使用Terser压缩代码
        rollupOptions: {
          // 外部化依赖，使用CDN加载
          external: ['vue', 'pinia'],
          output: {
            // 手动分包：将node_modules中的库打包到单独chunk
            manualChunks: {
              vendor: ['vue', 'pinia'],
            },
          },
        },
      },
      resolve: {
        // CDN引入时的别名配置
        alias: {
          vue: 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js',
          pinia: 'https://unpkg.com/pinia@2/dist/pinia.esm-browser.js',
        },
      },
    });
    ```
2. Vue 3路由懒加载（结合TypeScript）：
    ```typescript
    // router/index.ts
    import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

    // 定义路由类型
    interface RouteMeta {
      title: string;
    }

    const routes: RouteRecordRaw[] = [
      {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue'), // 动态导入
        meta: { title: 'Home' },
      },
      {
        path: '/user/:id',
        name: 'user',
        component: () => import('../views/User.vue'), // 动态导入
        meta: { title: 'User Profile' },
      },
    ];

    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    export default router;
    ```
3. 异步组件使用：
    ```typescript
    // views/Home.vue
    <script setup lang="ts">
    import { defineAsyncComponent } from 'vue';

    // 异步加载非关键组件
    const HeavyComponent = defineAsyncComponent(() =>
      import('../components/HeavyComponent.vue')
    );
    </script>

    <template>
      <div>
        <h1>Home Page</h1>
        <Suspense>
          <HeavyComponent />
          <template #fallback>Loading...</template>
        </Suspense>
      </div>
    </template>
    ```
代码说明：
* 代码分包：通过路由懒加载（import('../views/Home.vue')）和manualChunks实现按需加载和模块分离。
* CDN引入：通过external和alias将Vue和Pinia从打包中排除，使用CDN加载。
* 按需加载：使用defineAsyncComponent和<Suspense>加载非关键组件。
* TypeScript支持：通过RouteRecordRaw和自定义RouteMeta接口确保路由配置的类型安全；defineConfig和ImportMetaEnv提供类型安全的Vite配置。
* Tree Shaking和压缩：默认启用Tree Shaking，minify: 'terser'确保生产环境代码最小化。

优化效果：
* 首屏加载：懒加载和CDN引入显著减少初始JS体积。
* 打包体积：分包和Tree Shaking移除冗余代码，降低总体文件大小。
* 开发体验：TypeScript类型注解确保配置可靠，visualizer插件帮助分析打包体积。

注意事项：
* CDN引入需确保网络可靠性，可配置本地副本作为降级。
* 分包策略需根据项目规模调整，避免chunk过多导致HTTP请求增加。