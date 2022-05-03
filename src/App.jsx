import React, {useContext} from 'react';
import {appContext, connect, store} from "./redux";

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
