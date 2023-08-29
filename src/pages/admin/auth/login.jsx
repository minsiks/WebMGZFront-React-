import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
const Page = () => {
  const [message, setMessage]=useState([]);
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState('userId');
  const formik = useFormik({
    initialValues: {
      userId: '',
      userPwd: '',
      userPhoneNo : '',
    },
    validationSchema: Yup.object({
      userId: Yup
        .string()
        .max(255),
      userPwd: Yup
        .string()
        .max(255)
        .required('비밀번호는 필수 값 입니다.'),
      userPhoneNo: Yup
        .string()
        .min(9,'핸드폰 번호가 너무 짧아요.')
        .max(13, '핸드폰 번호가 너무 길어요.'),
    }),
    onSubmit: async (values, helpers) => {
        console.log(axios.defaults.headers.common['authorization']);
        console.log(values);
        await auth.signIn(values,helpers);
    }
  });

  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );

  const handleSkip = useCallback(
    () => {
      auth.skip();
      router.push('/');
    },
    [auth, router]
  );

  return (
    <>
      <Head>
        <title>
          로그인 | WebMGZ42Admin
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                로그인 WebMGZ42 관리자
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                계정이 없으신가요?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/admin/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  회원가입
                </Link>
              </Typography>
            </Stack>
            <Tabs
              onChange={handleMethodChange}
              sx={{ mb: 3 }}
              value={method}
            >
              <Tab
                label="아이디"
                value="userId"
              />
              <Tab
                label="핸드폰 번호"
                value="phoneNumber"
              />
            </Tabs>
            {method === 'userId' && (
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.userId && formik.errors.userId)}
                    fullWidth
                    helperText={formik.touched.userId && formik.errors.userId}
                    label="아이디"
                    name="userId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.userId}
                  />
                  <TextField
                    error={!!(formik.touched.userPwd && formik.errors.userPwd)}
                    fullWidth
                    helperText={formik.touched.userPwd && formik.errors.userPwd}
                    label="비밀번호"
                    name="userPwd"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="Password"
                    value={formik.values.userPwd}
                  />
                </Stack>
                
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  계속
                </Button>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={handleSkip}
                >
                  
                </Button>
                <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    WebMGZ 관리자를위한 사이트입니다.
                  </div>
                </Alert>
              </form>
            )}
            {method === 'phoneNumber' && (
              <div>
                <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                  <Stack spacing={3}>
                    <TextField
                    error={!!(formik.touched.userPhoneNo && formik.errors.userPhoneNo)}
                    fullWidth
                    helperText={formik.touched.userPhoneNo && formik.errors.userPhoneNo}
                    label="전화번호"
                    name="userPhoneNo"
                    inputProps={{maxLength:13 , inputMode: 'numeric', pattern:'[0-9]*'}}
                    onBlur={formik.handleBlur}
                    onChange={e => {
                      formik.handleChange(e);
                        formik.setFieldValue('userPhoneNo',e.target.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`));
                    }}
                    type="text"
                    value={formik.values.userPhoneNo}
                   />
                    <TextField
                      error={!!(formik.touched.userPwd && formik.errors.userPwd)}
                      fullWidth
                      helperText={formik.touched.userPwd && formik.errors.userPwd}
                      label="비밀번호"
                      name="userPwd"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="Password"
                      value={formik.values.userPwd}
                    />
                  </Stack>
                  {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                  )}
                    <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    type="submit"
                    variant="contained"
                  >
                    계속
                  </Button>
                </form>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
