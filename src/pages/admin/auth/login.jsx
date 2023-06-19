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
import { customAxios } from 'src/utils/customAxios';

const Page = () => {
  const [message, setMessage]=useState([]);
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState('userId');
  const formik = useFormik({
    initialValues: {
      userId: '',
      userPwd: '',
      submit: null
    },
    validationSchema: Yup.object({
      userId: Yup
        .string()
        .max(255)
        .required('ID는 필수 값 입니다.'),
      userPwd: Yup
        .string()
        .max(255)
        .required('비밀번호는 필수 값 입니다.')
    }),
    onSubmit: async (values, helpers) => {
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
                    type="userPwd"
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
                <Typography
                  sx={{ mb: 1 }}
                  variant="h6"
                >
                  Not available in the demo
                </Typography>
                <Typography color="text.secondary">
                  To prevent unnecessary costs we disabled this feature in the demo.
                </Typography>
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
