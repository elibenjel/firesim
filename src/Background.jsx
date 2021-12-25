import React from 'react';
import { Button, Container, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { mergeClasses } from '@material-ui/styles';

const useStyles = makeStyles({
    root: ({bimg}) => {
        return {
            backgroundImage: `url(${bimg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: '100%',
            width: '100%',
            margin: 'auto',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
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