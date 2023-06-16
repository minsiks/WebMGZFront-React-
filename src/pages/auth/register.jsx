import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { Box, Button, Link, Stack, TextField, Typography,RadioGroup,FormControlLabel,Radio} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import React, { useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

const Page = () => {
  
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      userId: '',
      userEmail: '',
      userName: '',
      userPwd: '',
      userGender: '',
      userPhoneNo:'',
      userBirth : new Date(),
      passwordConfirm:'',
    },
    validationSchema: Yup.object({
      userId: Yup
        .string()
        .max(255)
        .required('아이디는 필수사항입니다.'),
      userEmail: Yup
        .string()
        .email('이메일 양식을 확인해 주세요.')
        .max(255)
        .required('이메일은 필수사항입니다.'),
      userName: Yup
        .string()
        .max(255)
        .required('이름은 필수사항입니다.'),
      userPwd: Yup
        .string()
        .matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,"영문 숫자 특수기호 조합 8자리 이상입니다.")
        .required('비밀번호는 필수사항입니다.'),
      userPhoneNo: Yup
        .string()
        .min(9,'핸드폰 번호가 너무 짧아요.')
        .max(13, '핸드폰 번호가 너무 길어요.')
        .required('핸드폰번호는 필수사항입니다..'),
      userBirth: Yup
        .date()
        .required('생년월일은 필수사항입니다.'),
      passwordConfirm: Yup
      .string()
      .oneOf([Yup.ref('userPwd'), null], '비밀번호가 맞지 않습니다.'),
    }),
    onSubmit: async (values,helpers) => {
        console.log(values);
        axios({
          method: 'POST',
          url : 'http://localhost:8081/user/user',
          data : values
        })
        .then(function (res){
          if(res.data=="중복"){
            helpers.setErrors({ submit: res.data + "되는 ID 입니다" });
          }else{
            alert(res.data+'Successfully signed up!');
          }
        })
        .catch(function (res){
          console.log(res);
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: res.message });
          helpers.setSubmitting(false);
        });
    }
  });
  
  return (
    <>
      <Head>
        <title>
          회원가입 | WebMGZ42Admin
        </title>
      </Head>
      <Box
        sx={{
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
                회원가입
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                이미 회원이신가요?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={2}>
                <TextField
                  error={!!(formik.touched.userId && formik.errors.userId)}
                  fullWidth
                  helperText={formik.touched.userId && formik.errors.userId}
                  label="아이디"
                  name="userId"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.userId}
                />
                <TextField
                  error={!!(formik.touched.userName && formik.errors.userName)}
                  fullWidth
                  helperText={formik.touched.userName && formik.errors.userName}
                  label="이름"
                  name="userName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.userName}
                />
                <TextField
                  error={!!(formik.touched.userEmail && formik.errors.userEmail)}
                  fullWidth
                  helperText={formik.touched.userEmail && formik.errors.userEmail}
                  label="이메일"
                  name="userEmail"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.userEmail}
                />
                <TextField
                  error={!!(formik.touched.userPwd && formik.errors.userPwd)}
                  fullWidth
                  helperText={formik.touched.userPwd && formik.errors.userPwd}
                  label="비밀번호"
                  name="userPwd"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.userPwd}
                />
                <TextField
                  error={!!(formik.touched.passwordConfirm && formik.errors.passwordConfirm)}
                  fullWidth
                  helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                  label="비밀번호 확인"
                  name="passwordConfirm"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                />
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={formik.values.userGender}
                  onChange={e => {
                    formik.handleChange(e);
                      formik.setFieldValue('userGender',e.target.value);
                  }}
                >
                  <FormControlLabel value="남" control={<Radio />} label="남" />
                  <FormControlLabel value="여" control={<Radio />} label="여" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
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
                  <MobileDatePicker
                      label={"생년월일"}
                      onBlur={formik.handleBlur}
                      inputFormat={"yyyy-MM-dd"}
                      value={formik.values.userBirth}
                      mask={"____-__-__"}
                      onChange={(e) => {
                        formik.setFieldValue('userBirth',e)
                      }}
                      renderInput={(params) => <TextField {...params} />}
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
                계속하기
              </Button>
            </form>
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
