## react





## useMemo和useCallBack和React.memo

| 名字              | 作用对象                 | 通俗解释                                                     |
| ----------------- | ------------------------ | ------------------------------------------------------------ |
| `**useMemo**`     | **值**（对象/数组/数字） | 缓存**计算结果**，依赖不变就复用旧值。                       |
| `**useCallback**` | **函数**                 | 缓存**函数定义**，依赖不变就复用旧函数（其实是 `useMemo` 的语法糖）。 |
| `**React.memo**`  | **整个组件**             | 缓存**组件实例**，props 没变就不重新渲染该组件。             |

```js
const varibale=useMemo(fn,[])

const fnName=useCallback(fn,[])

const component=memo((props)=>{
    
})

```



### useMemo

* useMemo： **组件渲染周期内**用来做缓存的 ，API 包含两个参数两个参数，回调函数和依赖项 

`useMemo` 就是 React 给你发的**“智能便签纸”**——你把费劲算出来的结果写在便签上（缓存），只要输入条件不变，下次直接看便签，既省了 CPU（不重算），又让同事（子组件）不因“新纸条”而瞎忙活（保持引用）。



React 组件只要状态或 props 变了，就会**重新渲染**，这意味着组件函数体内的代码会**全部重新执行一遍**。如果里面有一个非常耗时的计算（比如遍历大数组、复杂数学运算），每次渲染都算一遍，页面就会卡顿。

`**useMemo**` **的作用就是“记住上次的计算结果”**，只有当依赖项（比如数组、入参）发生变化时，才重新计算；否则直接复用缓存。

**通俗比喻：错题本**

考试时，你做了一道极其复杂的微积分题（耗时计算）。算出答案后，你把它工工整整抄在一个**错题本（缓存）**上，旁边备注“仅当题目里的数字变了，才重算”。
下次考试如果题目一模一样（依赖没变），你直接翻开错题本抄答案，半秒钟都不用。但如果老师把数字改了（依赖变了），你才需要重新在草稿纸上演算一遍





### useCallback

`useCallback` 的核心作用是**记忆化（memoization）**，它让函数在多次渲染之间保持**相同的引用**，前提是它的依赖项没有发生变化。

>  为什么函数引用会变化？

在 React 函数组件中，每次渲染都会**重新执行整个函数体**。这意味着，组件内部定义的所有普通函数都会**被重新创建**，产生一个全新的函数引用。

```jsx
function MyComponent() {
  // 每次渲染，handleClick 都是一个新的函数
  const handleClick = () => {
    console.log('clicked');
  };

  return <Child onClick={handleClick} />;
}
```

如果 `Child` 使用了 `React.memo` 进行浅比较优化，那么每次父组件渲染时，`handleClick` 的引用都变了，`Child` 会认为 props 变了，从而**重新渲染**，即使行为完全一样

> `useCallback` 如何保持引用稳定？

`useCallback` 会**缓存**第一次渲染时创建的函数，并在后续渲染中，**仅当依赖数组中的值发生变化时**才重新创建新函数；否则，它会**返回之前缓存的同一个函数引用**。

```jsx
import { useCallback } from 'react';
function MyComponent() {
  // 依赖为空数组 → 函数只创建一次，永远不变
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <Child onClick={handleClick} />;
}
```

> 简化代码对比

1. 不用 `useCallback`（每次都是新函数)

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // 每次渲染都生成新的函数
  const handleClick = () => {
    console.log('click');
  };

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>增加 count</button>
      <Child onClick={handleClick} />  {/* count 变化时，Child 会因 props 变化而重渲染 */}
    </>
  );
}

const Child = React.memo(({ onClick }) => {
  console.log('Child 渲染');
  return <button onClick={onClick}>点我</button>;
});
```

2. 使用 `useCallback`（引用稳定）

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // 依赖为空，函数引用永远不变
  const handleClick = useCallback(() => {
    console.log('click');
  }, []);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>增加 count</button>
      <Child onClick={handleClick} />  {/* count 变化时，Child 不会重渲染 */}
    </>
  );
}

const Child = React.memo(({ onClick }) => {
  console.log('Child 渲染');  // 仅首次渲染时打印
  return <button onClick={onClick}>点我</button>;
});
```

3. ### 依赖项变化时，引用会更新

   如果 `useCallback` 的依赖项变了，它会**生成新的函数**，因为缓存失效。

   ```jsx
   const handleClick = useCallback(() => {
     console.log(count);  // 依赖 count
   }, [count]);  // count 变化 → 函数重新创建，引用更新
   ```

   

**useCallback 通过缓存机制确保在依赖不变时返回同一个函数对象。这能帮助子组件（配合 React.memo）避免不必要的重新渲染，提升性能。记住：只有确实需要稳定引用（如传递给子组件、作为 useEffect 依赖）时才使用，过度使用也会带来开销。**



### **React.memo**

react渲染机制： 自顶向下，全部渲染

父组件 发生变化， 子组件也发生渲染

怎么判断子组件是否需要渲染， 属性props 属性不发生变化就无需不需要渲染。

React.memo(function())



\1. React.memo 是做什么的？

memo 是用来做缓存（数据和组件），做性能优化的



\2. 为什么要有React.memo?

避免不必要的渲染，优化性能,不做组件缓存，会带来问题



3. 什么情况下使用React.memo

子组件不依赖父组件任何的属性，完全可以把它缓存起来 ，没有必要重新渲染 

子组件件渲染1000次

```js
import {useState,memo} from 'react';


function  Child(props) { 
    console.log('子组件被渲染了');
    return (
        <div>
            <h1>子组件</h1>
        </div>
    );
}

function Home(props) {
    const [count,setCount] = useState(0);
    console.log('Home组件被渲染了');
    return (
        <div>
            <h1>站点首页</h1>
            <h2>计数器{count}</h2>
            <button onClick={()=>{setCount(count+1)}}>增加计数</button>
            <Child></Child>
        </div>
    );
}
export default Home;
```



