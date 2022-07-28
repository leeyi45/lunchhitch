import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  Field, FieldProps, Form, Formik,
} from 'formik';
import Head from 'next/head';
import { object as yupObj, string as yupStr } from 'yup';

import { fetchApiThrowOnError } from '../../api_helpers';
import AuthSelector from '../../common/auth_selector';
import Box from '../../common/components/Box';
import NavBar from '../../common/components/navbar';
import TextField from '../../common/components/textfield';
import TooltipButton from '../../common/components/tooltip_button';

import styles from './styles.module.css';

type FormValues = {
  shopName: string;
  desc: string;
}

export default function Suggestions() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClear = () => {
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>Suggestions</title>
      </Head>
      <div className={styles.Suggestions}>
        <AuthSelector>
          {(user) => (
            <>
              <NavBar user={user} />
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                width: '45%',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                left: '27.5%',
                top: '20%',
                textAlign: 'center',
              }}
              >
                <h1 style={{ color: '#50C878' }}>Know a hidden gem in your community? Share it with us!</h1>
                <Typography variant="subtitle2" style={{ color: '#808080', paddingBottom: '10px', fontFamily: 'raleway' }}>Please add a short description of the shop as well! <br />You can include its main cuisine, location, signature dishes, as well as why you would like to suggest this shop to your community.</Typography>
                <Stack direction="column" style={{ width: '90%' }}>
                  <Formik<FormValues>
                    initialValues={{
                      shopName: '',
                      desc: '',
                    }}
                    onSubmit={async ({ shopName, desc }, { resetForm }) => {
                      await fetchApiThrowOnError(`suggestions?shopName=${shopName}`, {
                        description: desc,
                      });
                      resetForm();
                      handleClickOpen();
                    }}
                    validationSchema={yupObj({
                      shopName: yupStr().required('Shop name is required!'),
                      desc: yupStr().required('Description cannot be empty!'),
                    })}
                  >
                    {({ errors, isSubmitting, setFieldValue }) => (
                      <Form>
                        <p>{Object.values(errors).at(0)}</p>
                        <Field name="shopName">
                          {({ field, meta }: FieldProps<FormValues>) => (
                            <Stack direction="row" style={{ lineHeight: '5px', justifyContent: 'center' }}>
                              <p style={{ fontSize: '20px', paddingRight: '10px' }}>Shop Name:</p>
                              <TextField
                                {...field}
                                id="standard-textarea"
                                multiline
                                variant="standard"
                                style={{ width: '40%' }}
                                onEscape={() => setFieldValue('shopName', '')}
                                error={meta.touched && !!meta.error}
                              />
                            </Stack>
                          )}
                        </Field>
                        <Field name="desc">
                          {({ field, meta }: FieldProps<FormValues>) => (
                            <Stack direction="row" style={{ lineHeight: '5px' }}>
                              <p style={{ fontSize: '20px', paddingRight: '10px', paddingLeft: '5px' }}>Description:</p>
                              <TextField
                                {...field}
                                id="standard-textarea"
                                multiline
                                variant="standard"
                                fullWidth
                                onEscape={() => setFieldValue('desc', '')}
                                error={meta.touched && !!meta.error}
                              />
                            </Stack>
                          )}
                        </Field>
                        <div>
                          <TooltipButton
                            tooltip="Submit"
                            type="submit"
                            disabled={Object.values(errors).length > 0 || isSubmitting}
                            style={{ padding: '20px', color: '#50C878' }}
                            endIcon={(<SendIcon />)}
                          >
                            Submit suggestion
                          </TooltipButton>
                        </div>
                      </Form>
                    )}
                  </Formik>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      Your suggestion has been submitted!
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Thank you for contributing to our site database.<br />
                        Site admins will look into your suggestion and might choose to bring it to the site.<br />
                        Be sure to look out for any updates!
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClear} autoFocus style={{ color: '#50C878' }}>Close</Button>
                    </DialogActions>
                  </Dialog>
                </Stack>
              </Box>
            </>
          )}
        </AuthSelector>
      </div>
    </>
  );
}
