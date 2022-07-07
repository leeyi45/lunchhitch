import React from 'react';
import { Paper, PaperProps } from '@mui/material';

import styles from './Box.module.css';

type Props = Omit<PaperProps, 'elevation'> & {
  elevation?: number;
};

export default function Box({ children, ...props }: Props) {
  return (
    <Paper className={styles.box} {...props}>
      {children}
    </Paper>
  );
}

Box.defaultProps = {
  elevation: 3,
};
