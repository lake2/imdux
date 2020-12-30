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

-   🚀 简单高效：完全去除了 redux 冗余低效的样板代码，提供一把全自动的生产力工具。
-   :shaved_ice: 类型安全：面向 typescript 用户，100%类型安全，同时摒弃 interface 类型预定义，改用 infer，实现了 state 和 dispatch 类型推导，极大地减少了类型定义代码。
-   ✈️ 目前未来：拥抱 react hooks，便于 typescript 的类型检查和代码复用。
-   :cocktail:最佳实践：Imdux 的目的不仅仅是提供一个库，更希望的是提供一个解决方案，探索一种 react hooks 的最佳实践。

#### 开始

首先，创建一个 react 项目：

```shell
npx create-react-app imdux-demo
```

安装 imdux，imdux 依赖于 immer，redux，react-redux ：

```shell
yarn add imdux immer redux react-redux
```

创建一个简单的项目结构：

```js
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── robots.txt
├── src
│   ├── App.js
│   ├── index.js
│   └── store
│       ├── counter.reducers.js
│       └── index.js
└── yarn.lock
```

打开`src/store/counter.reducers.js`，输入代码：

```js
import { createAction } from 'imdux';

const initialState = {
    value: 0,
};

const reducers = {
    increase(draft, payload) {
        draft.value += payload;
    },
    decrease(draft, payload) {
        draft.value -= payload;
    },
};

export const counter = createAction({ initialState, reducers });
```

打开`src/store/index.js`，创建一个 store：

```js
import { createStore } from 'imdux';

import { counter } from './counter.reducers';

export const store = createStore({ counter }, { devtool: true });
export const { Dispatch, Query } = store;
```

打开`src/App.js`，创建一个`App`：

```js
import React from 'react';
import { useSelector } from 'react-redux';

import { Dispatch } from './store';

export function App() {
    // 取出counter中的值，如果这个值改变，那么组件会自动更新
    const value = useSelector(store => store.counter.value);
    return (
        <div style={{ padding: 20 }}>
            <h1>{value}</h1>
            <button onClick={() => Dispatch.counter.increase(1)}>increase</button> {/* 通过Dispatch触发状态更新 */}
            <button onClick={() => Dispatch.counter.decrease(1)}>decrease</button>
        </div>
    );
}
```

最后，打开`src/index.js`，注入 redux 的 store：

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './App';
import { store } from './store';

ReactDOM.render(
    <Provider store={store.redux}>
        {' '}
        {/* 注入 */}
        <App />
    </Provider>,
    document.getElementById('root'),
);
```

enjoy it~ 很简单，对不对？

你可以在浏览器中打开这个例子： [javascript](https://codesandbox.io/s/imdux-start-javascript-3049f?fontsize=14&hidenavigation=1&theme=dark) [typescript](https://codesandbox.io/s/imdux-start-typescript-7wz5u?fontsize=14&hidenavigation=1&theme=dark)

打开 redux 的 devtool，通过点击`increase`和`decrease`button，我们可以看到状态变更的历史记录：

![redux_devtool](https://user-images.githubusercontent.com/6293752/86553981-e9f2a800-bf7e-11ea-97d4-3511ea30a37a.gif)

### 命名空间

上面的例子中，如果有多个 counter，可以在`reducers`中用命名空间隔离：

```js
import { createAction } from 'imdux';

const initialState = {
    first: 0,
    last: 0,
};

const reducers = {
    first: {
        increase(draft, payload) {
            draft.first += payload;
        },
        decrease(draft, payload) {
            draft.first -= payload;
        },
    },
    last: {
        increase(draft, payload) {
            draft.last += payload;
        },
        decrease(draft, payload) {
            draft.last -= payload;
        },
    },
};

export const counter = createAction({ initialState, reducers });
```

```js
export function App() {
    const first = useSelector(store => store.counter.first);
    const last = useSelector(store => store.counter.last);
    return (
        <div style={{ padding: 20 }}>
            <h1>{first}</h1>
            <button onClick={() => Dispatch.counter.first.increase(1)}>increase</button>
            <button onClick={() => Dispatch.counter.first.decrease(1)}>decrease</button>

            <h1>{last}</h1>
            <button onClick={() => Dispatch.counter.last.increase(1)}>increase</button>
            <button onClick={() => Dispatch.counter.last.decrease(1)}>decrease</button>
        </div>
    );
}
```

![redux_devtool](https://user-images.githubusercontent.com/6293752/86555496-1ad4dc00-bf83-11ea-8622-f74d7dda75f3.gif)

命名空间是可以多级嵌套，应当根据项目情况自由组织，推荐把相关的状态变更放在一个命名空间下。

### getState()

在 redux 中，某些情况下需要`同步`获得状态的最新值，[redux 提供了 getState()接口来实现](https://redux.js.org/basics/store)。

在 imdux 中，`createStore`导出的`Query`内置了 getter，可以达到和`getState()`一样的效果。

例如：

```js
import { createStore } from 'imdux';

import { counter } from './counter.reducers';

export const store = createStore({ counter }, { devtool: true });
export const { Dispatch, Query } = store;

console.log(store.redux.getState().counter); // { value: 0 }
console.log(Query.counter); // { value: 0 }

console.log(store.redux.getState().counter === Query.counter); // true
```

### Typescript

在 redux 中实现 100%的类型检查是 imdux 的初衷。对于 typescript 用户，推荐在`counter.reducers.ts`中带上类型：

```ts
import { createAction } from 'imdux';

type State = typeof initialState; // 获得类型
type Reducers = typeof reducers; // 获得类型

const initialState = {
    value: 0,
};

const reducers = {
    increase(draft: State, payload: number) {
        // draft的类型为State
        draft.value += payload;
    },
    decrease(draft: State, payload: number) {
        // draft的类型为State
        draft.value -= payload;
    },
};

export const counter = createAction<State, Reducers>({ initialState, reducers }); // 注入类型
```

在`src/store/index.ts`中，导出`Query`的类型，改写`useSelector`的函数定义：

```ts
import { createStore } from 'imdux';
import { useSelector as useReduxSelector } from 'react-redux';

import { counter } from './counter.reducers';

export const store = createStore({ counter }, { devtool: true });
export const { Dispatch, Query } = store;

export type Store = typeof Query;

export function useSelector<TSelected>(selector: (state: Store) => TSelected, equalityFn?: (left: TSelected, right: TSelected) => boolean) {
    return useReduxSelector<Store, TSelected>(selector, equalityFn);
}
```

在`src/App.tsx`中，使用改写后的`useSelector`，这样就可以很轻松地获得 typescript 的类型检查和代码提示：

![type](https://user-images.githubusercontent.com/6293752/86553310-f6760100-bf7c-11ea-8f7b-096a80656c4c.gif)

你可以在浏览器中打开这个例子： [javascript](https://codesandbox.io/s/imdux-start-javascript-3049f?fontsize=14&hidenavigation=1&theme=dark) [typescript](https://codesandbox.io/s/imdux-start-typescript-7wz5u?fontsize=14&hidenavigation=1&theme=dark)

按住`ctrl`键，鼠标左键点击`increase`，可以准确跳转到`reducers.increase`：

![navigate](https://user-images.githubusercontent.com/6293752/87135651-ea67a780-c2cc-11ea-8dbe-bb66a42bf4d7.gif)

### 和 immer 的关系

immer 是一个强大的 immutable 库，它可以非常直观、高效地创建 immutable 数据：

```ts
import produce from 'immer';

const user = {
    name: 'Jack',
    friends: [{ name: 'Tom' }, { name: 'Jerry' }],
};

const user2 = produce(user, draft => {
    draft.name = 'James';
});

console.log(user2.friends === user.friends); // true

const user3 = produce(user, draft => {
    draft.friends.push({ name: 'Vesper' });
});

console.log(user3.friends === user.friends); // false
console.log(user3.friends[0] === user.friends[0]); // true
```

他的原理如图：

![immer](https://user-images.githubusercontent.com/6293752/76953831-530bcc80-694a-11ea-93ec-069d99bb67b0.gif)

相对于通过扩展运算符...，Array.slice 等方式来创建 immutable 对象，immer 通过一个参数为 draft 的函数来修改原对象，然后将修改的过程打包生成一个新对象，原对象不变，符合人的思维直觉。

详情请参考 immer 文档：https://immerjs.github.io/immer/docs/introduction

其实，从名字你就可以看出端倪：imdux = im + dux = immer + redux

imdux 做的事情其实很简单，就是将 redux 中的 reducer，和 immer 中的 draft 函数合二为一：

1. 利用修改 draft 不会影响原来对象的特性，在 reducer 内直接读取和修改 draft
2. 利用 immer 中的 produce 函数，来生成下一个 immutable 状态，然后提交给 redux，触发状态更新

基于以上原理，imdux 中的 reducer 必须是**同步的**。

### 异步请求

imdux 推荐两种异步操作解决办法：

1. 基于 hooks 的异步方案
2. 基于全局函数的异步方案

#### 基于 hooks 的异步方案

一个常见的滚动翻页代码如下：

```js
// 定义一个名称为news的action，并使用createStore初始化

import { createAction } from 'imdux';

const initialState = {
    list: [],
    page: 0,
    isLoading: false,
    isEndOfList: false,
};

const reducers = {
    addNews(draft, list) {
        draft.list.push(...list);
    },
    addPage(draft) {
        if (draft.isEndOfList || draft.isLoading) return;
        draft.page++;
    },
    startLoading(draft) {
        draft.isLoading = true;
    },
    stopLoading(draft) {
        draft.isLoading = false;
    },
    reachEndOfList(draft) {
        draft.isEndOfList = true;
    },
};

export const news = createAction({ initialState, reducers });
```

```js
// 使用Dispatch.news.addPage更新news.page，触发request异步操作

import * as React from 'react';
import { useSelector } from 'react-redux';

import { Dispatch, Store } from './store';

export default function App() {
    const news = useSelector(p => p.news);

    React.useEffect(() => {
        request(news.page);
    }, [news.page]);

    const request = async page => {
        Dispatch.news.startLoading();
        try {
            const response = await Api.getNewsList(page);
            if (!Api.isError(response)) {
                if (response.data.list.length === 0) {
                    Dispatch.news.reachEndOfList();
                } else {
                    Dispatch.news.addNews(response.data.list);
                }
            } else {
                alert(response.message);
            }
        } catch (e) {
            alert(e.message);
        } finally {
            Dispatch.news.stopLoading();
        }
    };

    return (
        <div onScroll={Dispatch.news.addPage}>
            {news.list.map(item => (
                <h1 key={item.key}>{item.title}</h1>
            ))}
            {news.isLoading ? '加载中' : news.isEndOfList ? '加载完毕' : ''}
        </div>
    );
}
```

#### 基于全局函数的异步方案

当一个异步方法需要在多个 component 中复用的时候，可以定义一个全局函数，在函数内使用`Dispatch`触发状态更新，使用`Query`获得状态的最新值，然后在需要的 component 中 import 这个函数即可。

需要注意的是，这种方案非常简单，但是会造成全局变量污染问题，请酌情使用。

### 最佳实践

// TODO

### License

MIT
