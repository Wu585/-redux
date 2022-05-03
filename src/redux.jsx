import React, {createContext, useContext, useEffect, useState} from "react";

export const appContext = createContext(null)

export const store = {
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
export const reducer = (state, {type, payload}) => {
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
export const connect = (Component) => {
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
