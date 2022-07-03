import { Paper } from '@mui/material';

import styles from './Box.module.css';

function Box(props: { children: any; }) {
  const { children } = props;
  return (
    <Paper className={styles.box} elevation={3}>
      {children}
    </Paper>
  );
}

export default Box;
