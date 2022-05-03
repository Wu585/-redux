import React, {createContext, useContext, useState} from 'react';

const appContext = createContext(null)

function App() {
  const [appState, setAppState] = useState({
    user: {
      name: 'frank',
      age: 18
    }
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <OneSon/>
      <TwoSon/>
      <ThreeSon/>
    </appContext.Provider>
  );
}

const OneSon = () => <section>大儿子 <User/></section>
const TwoSon = () => <section>二儿子 <UserModifier>内容</UserModifier></section> // 这里相当于调用函数传参，参数是children
const ThreeSon = () => <section>小儿子</section>

const User = () => {
  const contextValue = useContext(appContext)
  return <div>User:{contextValue.appState.user.name}</div>
}
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
const connect = (Component) => {
  // 这里props透传写法原因：用的时候，写在组件上的属性相当于调用这个返回的函数，然后传参
  return (props) => {
    const {appState, setAppState} = useContext(appContext)
    const dispatch = (action) => {
      setAppState(reducer(appState, action))
    }
    return <Component {...props} dispatch={dispatch} state={appState}/>
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
