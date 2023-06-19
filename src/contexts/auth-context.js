import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useRouter } from 'next/navigation';


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

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = {
        id: '5e86809283e28b96d2d38537',
        avatar: '/assets/avatars/avatar-anika-visser.png',
        name: 'Anika Visser',
        email: 'anika.visser@devias.io'
      };

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
      window.sessionStorage.setItem('authenticated', 'true');
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

  const signIn = async (values,helpers) => {
    console.log(values);
    axios({
      method: 'POST',
      url : 'http://localhost:8081/admin/signIn',
      data : values
    })
    .then(function (res){
      console.log(res.data);
      window.sessionStorage.setItem('authenticated', 'true');
      router.replace("/admin");
      
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: res.data
      });
    })
    .catch(function (res){
      console.log(res);
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: res.message });
      helpers.setSubmitting(false);
    });
    // if (email !== 'demo@devias.io' || password !== 'Password123!') {
    //   throw new Error('Please check your email and password');
    // }

    // try {
    //   window.sessionStorage.setItem('authenticated', 'true');
    // } catch (err) {
    //   console.error(err);
    // }

    // const user = {
    //   id: '5e86809283e28b96d2d38537',
    //   avatar: '/assets/avatars/avatar-anika-visser.png',
    //   name: 'Anika Visser',
    //   email: 'anika.visser@devias.io'
    // };

    // dispatch({
    //   type: HANDLERS.SIGN_IN,
    //   payload: user
    // });
  };

  const signUp = async (values,helpers) => {
    console.log(values);
    axios({
      method: 'POST',
      url : 'http://localhost:8081/admin/signUp',
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
    window.sessionStorage.setItem('authenticated', 'false');
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
