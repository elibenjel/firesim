import React from 'react';
import { Button, Container, AppBar, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { mergeClasses } from '@material-ui/styles';

const useStyles = makeStyles({
    root: ({bimg}) => {
        return {
            backgroundImage: `url(${bimg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            minHeight: '100%',
            minWidth: '100%',
            position: 'fixed',
            top: 0,
            left: 0
        }
    }
  });

const Background = ({children, source}) => {
  {
    const classes = useStyles({bimg : source});
    return (
      <Container className={classes.root} maxWidth="lg">
          {children}
      </Container>
    )
  }
}

export default Background;