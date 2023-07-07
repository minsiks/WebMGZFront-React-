import axios,{AxiosInstance,AxiosRequestConfig} from "axios";
import { API_BASE_URL } from "src/constants";
import * as jwt from 'jsonwebtoken';
import Swal from "sweetalert2";
export const customAxios: AxiosInstance = axios.create({
    baseURL : API_BASE_URL,
    
});


//refresh token api
export async function postRefreshToken() {
  try {
    const response = await customAxios.post('/auth/refresh', {
      authorization: localStorage.getItem('jwtToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // 404 오류 처리
      console.log('404 오류가 발생했습니다.');
      // 추가적인 오류 처리 로직을 여기에 작성합니다.
      Swal.fire({
        title: '로그인 세션이 만료되었습니다.',
        text: '다시 로그인 화면으로 돌아갑니다.',
        icon: 'warning',
        confirmButtonText: 'Cool'
      }).then((result)=>{
        window.location.replace('/admin/auth/login');
      })
    }
    throw error; // 다른 오류는 다시 throw하여 상위 레벨에서 처리하도록 합니다.
  }
}
customAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken')
    const refreshToken = localStorage.getItem('refreshToken')
      if(token) {
        config.headers.authorization = token;
      }
      if(refreshToken){
        config.headers.refreshToken =refreshToken;
      }
      return config
  })
  
customAxios.interceptors.response.use(
    
    // 200번대 응답이 올때 처리
    (response) => {
      return response;
    },
    // 200번대 응답이 아닐 경우 처리
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      
      //토큰이 만료되을 때
      if (status === 500) {
        let errorMsg = error.response.data.message;
        if (errorMsg.includes('The Token has expired on'||'The token was expected')) {
          const originRequest = config;
          //리프레시 토큰 api
          const response = await postRefreshToken();
          //리프레시 토큰 요청이 성공할 때
          if (response.status === 200) {
            console.log(response)
            const jwtToken = response.headers['authorization'];
            const refreshToken = response.headers['refreshtoken'];
            localStorage.setItem('jwtToken', jwtToken);
            localStorage.setItem('refreshToken', refreshToken);
            axios.defaults.headers.common['authorization'] = `Bearer ${jwtToken}`;
            axios.defaults.headers.common['refreshtoken'] = `Bearer ${refreshToken}`;
            //진행중이던 요청 이어서하기
            originRequest.headers.Authorization = `Bearer ${jwtToken}`;
            return axios(originRequest);
          //리프레시 토큰 요청이 실패할때(리프레시 토큰도 만료되었을때 = 재로그인 안내)
          } else if (response.status === 404) {
            window.location.replace('/sign-in');
          } else {
            alert('LOGIN.MESSAGE.ETC');
          }
        }
      }
      return Promise.reject(error);
    },
  );


