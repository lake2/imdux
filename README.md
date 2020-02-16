<p align="center"><img src="https://user-images.githubusercontent.com/6293752/74236902-3f4ac600-4d0d-11ea-95c5-1069d1b52dd8.png" alt="imdux logo" width="150"></p>
<h1 align="center">Imdux</h1>
<p align="center">🌈 A redux helper for react & hooks & typescript developers.</p>
<p align="center">
<a href="https://travis-ci.org/lake2/imdux"><img src="https://travis-ci.org/lake2/imdux.svg?branch=master" alt="CI Status"></a>
<a href="https://coveralls.io/github/lake2/imdux?branch=master"><img src="https://coveralls.io/repos/github/lake2/imdux/badge.svg?branch=master" alt="Coverage Status"></a>
<a href="https://npmjs.com/package/imdux"><img src="https://img.shields.io/npm/v/imdux" alt="Version"></a>
<a href="https://npmjs.com/package/imdux"><img src="https://img.shields.io/npm/dt/imdux" alt="Download"></a>
<a href="https://github.com/lake2/imdux"><img src="https://img.shields.io/bundlephobia/minzip/imdux" alt="Mini size"></a>
<a href="https://github.com/lake2/imdux"><img src="https://img.shields.io/npm/l/imdux" alt="MIT License"></a>
</p>

### 特点

- 🚀简单高效：完全去除了redux冗余低效的样板代码，提供一把全自动的生产力工具。
- :shaved_ice: 类型安全：面向typescript用户，100%类型安全，同时摒弃interface类型预定义，改用infer，实现了state和dispatch类型推导，极大地减少了类型定义代码。
- ✈️目前未来：拥抱react hooks，便于typescript的类型检查和代码复用。
- :cocktail:最佳实践：Imdux的目的不仅仅是提供一个库，更希望的是提供一个解决方案，探索一种react hooks的最佳实践。

#### 开始

首先，创建一个react项目：

```shell
npx create-react-app imdux-demo
```

安装imdux，imdux依赖于 immer，redux，react-redux ：

```shell
npm install imdux immer redux react-redux --save
```

在`src`目录下创建文件`store.js`，输入代码：

```js
import { createAction, createStore } from "imdux";

const initialState = {
  value: 0
};

const reducers = {
  increase(draft, payload) {
    draft.value += payload;
  },
  decrease(draft, payload) {
    draft.value -= payload;
  }
};

const counter = createAction({ initialState, reducers });
export const store = createStore({ counter }, { devtool: true });
export const { Dispatch } = store;
```

打开`src/App.js`，输入代码：

```js
import React from "react";
import { useSelector } from "react-redux";

import { Dispatch } from "./store";

export default function App() {
  const value = useSelector(store => store.counter.value);
  return (
    <div>
      <h1>{value}</h1>
      <button onClick={() => Dispatch.counter.increase(1)}>increase</button>
      <button onClick={() => Dispatch.counter.decrease(1)}>decrease</button>
    </div>
  );
}
```

打开`src/index.js`，注入redux的store：

```js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store.redux}>
    <App />
  </Provider>,
  rootElement
);
```

enjoy it~ 很简单，对不对？

打开redux的devtool，通过点击`increase`和`decrease`button，我们可以看到状态变更的历史记录：

通过观察可以发现，`counter.increase`中的`counter`等于` createStore({ counter })`中的`counter`，而`counter.increase`中的`increase`等于`reducers`中的`increase`，也就是说，imdux会自动帮你创建redux中的action.type，你再也不需要定义字符串、写switch...case、那一套东西了。

对于typescript用户，你需要在`store.ts`中带上类型：

```ts
import { createAction, createStore } from "imdux";

type State = typeof initialState; // 获得类型
type Reducers = typeof reducers;  // 获得类型

const initialState = {
  value: 0
};

const reducers = {
  increase(draft: State, payload: number) { // draft的类型为State
    draft.value += payload;
  },
  decrease(draft: State, payload: number) { // draft的类型为State
    draft.value -= payload;
  }
};

const counter = createAction<State, Reducers>({ initialState, reducers }); // 注入类型
export const store = createStore({ counter }, { devtool: true });
export const { Dispatch } = store;
```

这样你就可以很轻松地获得typescript的类型检查和代码提示：

你可以在浏览器中打开这个例子： [javascript](https://codesandbox.io/s/imdux-start-javascript-3049f?fontsize=14&hidenavigation=1&theme=dark)   [typescript](https://codesandbox.io/s/imdux-start-typescript-7wz5u?fontsize=14&hidenavigation=1&theme=dark)


### Imdux API

- [createAction](https://github.com/lake2/imdux#createAction)

- [createStore](https://github.com/lake2/imdux#createStore)

#### createAction

imdux中的action由两部组成：`initialState`和`reducers`。

通常react项目可以切割为很多小的页面或者模块。当一个页面或者模块的state需要全局管理时，你就可以为这个页面或者模块创建一个`Action`，并为这个`Action`起一个名字。例如，你有一个名称为`home`的`Action`，`home.usename`需要全局管理：

```js
const initialState = { usernmae: "" }
```

```js
const reducers = {
  setUsername(draft, payload) {
    draft.usernmae = payload;
  },
};
```

```js
const home = createAction({ initialState, reducers });
```

一个`Action`就创建好了。

对于typescript用户，你需要增加类型信息并注入：

```ts
type State = typeof initialState; // 获得类型
type Reducers = typeof reducers;  // 获得类型

const home = createAction<State, Reducers>({ initialState, reducers }); // 注入类型
```

同时，给每一个reducer函数带上类型信息，以便在reducer内获得类型提示，这也是Dispatch函数参数类型检查的关键所在：

```ts
const reducers = {
  setUsername(draft:State, payload:string) {
    draft.usernmae = payload;
  },
};
```

####  createStore

创建好名称为`home`的`Action`后，你需要使用`createStore`把这个action初始化，同时将`Dispatch`和`Query`导出：

```ts
export const store = createStore({ home }, { devtool: true });
export const { Dispatch, Query } = store;
```

接下来，你就可以使用`Dispatch`触发一个状态变化，更新页面：

```ts
Dispatch.home.setUsername("jack");
```

你可以使用`Query`,`同步地`获取当前状态：

```typescript
console.log(Query.home.usernmae) // jack
```

### 异步请求

// TODO

### 最佳实践

// TODO

### License

MIT
