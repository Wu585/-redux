import React, {createContext, useContext, useEffect, useState} from 'react';

const appContext = createContext(null)

const store = {
  state: {
    user: {
      name: 'frank',
      age: 18
    }
  },
  setState(newState) {
    store.state = newState
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}
const connect = (Component) => {
  // 这里props透传写法原因：用的时候，写在组件上的属性相当于调用这个返回的函数，然后传参
  return (props) => {
    const {state, setState} = useContext(appContext)
    const [, update] = useState({})
    useEffect(() => {
      store.subscribe(() => {
        update({})
      })
    }, [])
    const dispatch = (action) => {
      setState(reducer(state, action))
    }
    return <Component {...props} dispatch={dispatch} state={state}/>
  }
}

function App() {
  return (
    <appContext.Provider value={store}>
      <OneSon/>
      <TwoSon/>
      <ThreeSon/>
    </appContext.Provider>
  );
}

const OneSon = () => <section>大儿子 <User/></section>
const TwoSon = () => <section>二儿子 <UserModifier>内容</UserModifier></section> // 这里相当于调用函数传参，参数是children
const ThreeSon = () => <section>小儿子</section>

const User = connect(() => {
  const {state} = useContext(appContext)
  return <div>User:{state.user.name}</div>
})
const reducer = (state, {type, payload}) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state
  }
}


const UserModifier = connect(({dispatch, state, children}) => {
  const onChange = (e) => {
    dispatch({
      type: 'updateUser', payload: {
        name: e.target.value
      }
    })
  }
  return <div>
    {children}
    <input type="text" value={state.user.name}
           onChange={onChange}/>
  </div>
})

export default App;
