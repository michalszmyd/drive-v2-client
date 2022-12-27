import { css } from '@emotion/css';
import React from 'react';
import { colors } from '../../../consts/colors';
import ReactHelper from '../../../helpers/react-helper';

interface PageWrapperProps {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}

export default function PageWrapper({children, className = ''}: PageWrapperProps): React.ReactElement {
  return (
    <div className={ReactHelper.arrayToClassName([styles.container, className])}>
      {children}
    </div>
  );
}

const styles = {
  container: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundImage: `linear-gradient(to bottom right, ${colors.main}, ${colors.secondary})`,
    boxSizing: 'border-box',
    overflow: 'auto',
  }),
};
