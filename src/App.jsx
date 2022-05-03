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
const TwoSon = () => <section>二儿子 <Wrapper/></section>
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
const Wrapper = () => {
  const {appState, setAppState} = useContext(appContext)
  const dispatch = (action) => {
    setAppState(reducer(appState, action))
  }
  return <UserModifier dispatch={dispatch} state={appState}/>
}
const UserModifier = ({dispatch, state}) => {
  const onChange = (e) => {
    dispatch({
      type: 'updateUser', payload: {
        name: e.target.value
      }
    })
  }
  return <div>
    <input type="text" value={state.user.name}
           onChange={onChange}/>
  </div>
}

export default App;
