import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ACCESS_TOKEN,API_BASE_URL } from 'src/constants';
import { customAxios } from 'src/utils/customAxios';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const router = useRouter();
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = window.localStorage.getItem('authenticated') === 'true'?true:false;
    console.log(isAuthenticated);
    try {
      isAuthenticated = window.localStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = JSON.parse(window.localStorage.getItem('user'));

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
      
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.localStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
      email: 'anika.visser@devias.io'
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const logIn = async (values,helpers) =>{
    customAxios.post(
      '/signIn',
      values,
      {withCredentials: true}
    ).then(function (res){
      const jwtToken = res.headers['authorization'];
      const refreshToken = res.headers['refreshtoken'];
      window.localStorage.setItem('authenticated', 'true');
      window.localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem("jwtToken", jwtToken);
      localStorage.setItem("refreshToken", refreshToken);
      axios.defaults.headers.common['authorization'] = `Bearer ${jwtToken}`;
      axios.defaults.headers.common['refreshtoken'] = `Bearer ${refreshToken}`;
      
      router.replace("/admin");
      
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: res.data
      });
      
    })
    .catch(function (res){
      console.log(res);
      helpers.setStatus({ success: false });
      if(res.code == "ERR_NETWORK"){
        helpers.setErrors({ submit: "서버 연결이 끊어졌습니다..! 관리자에게 문의 주세요" });
      }else if(res.response.data.message != null){
        helpers.setErrors({ submit: res.response.data.message });
      }else{
        helpers.setErrors({ submit: decodeURIComponent(decodeURI(res.response.data).replace(/\+/g, " ")) });
      }
      helpers.setSubmitting(false);
    });
  }
  const signIn = async (values,helpers) => {
    if(values.userPhoneNo){
      customAxios.get('admin/findUserByPNo',
      {
        params: {
          userPhoneNo : values.userPhoneNo
        },
        withCredentials: true
      }).then(function(res){
        if(!res.data.userId){
          helpers.setErrors({ submit: "전화번호를 다시 확인해 주세요" });
          return;
        }
        values.userId = res.data.userId;
        logIn(values,helpers);
      }).catch(function (res){
        console.log(res);
      });
    }else{
      logIn(values,helpers);
    }

     
  };

  const signUp = async (values,helpers) => {
    axios({
      method: 'POST',
      url : 'http://localhost:8081/api/admin/signUp',
      data : values
    })
    .then(function (res){
      if(res.data=="중복"){
        helpers.setErrors({ submit: res.data + "되는 ID 입니다" });
      }else{
        router.push("/admin/auth/login");
      }
    })
    .catch(function (res){
      console.log(res);
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: res.message });
      helpers.setSubmitting(false);
    });
  };

  const signOut = () => {
    window.localStorage.setItem('authenticated', 'false');
    localStorage.removeItem("user");
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
