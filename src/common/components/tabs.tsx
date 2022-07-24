import React from 'react';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import MUITabs from '@mui/material/Tabs';

type Props = {
  tabs: {
    [name: string]: React.ReactElement;
  };
}

export default function Tabs({ tabs }: Props) {
  const [index, setIndex] = React.useState(0);
  const children = React.useMemo(() => Object.values(tabs), [tabs]);

  return (
    <Stack direction="column">
      <MUITabs value={index} onChange={(_e, newVal) => setIndex(newVal)} centered textColor="inherit" indicatorColor="primary">
        {Object.keys(tabs).map((each, i) => (<Tab key={i} value={i} label={each} />))}
      </MUITabs>
      {children[index]}
    </Stack>
  );
}
