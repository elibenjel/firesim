import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box
} from '@mui/material';
import { ArrowRightRounded } from '@mui/icons-material';


const BulletItem = (props) => {
    const { children } = props;
    return (
        <ListItem disablePadding sx={{ alignItems : 'flex-start' }}>
            <ListItemIcon sx={{ minWidth : '30px', mt : '3px' }}><ArrowRightRounded /></ListItemIcon>
            <ListItemText disableTypography primary={children} />
        </ListItem>
    )
}

const Home = () => {
    const theme = useTheme();
    const { t } = useTranslation('translation', { keyPrefix : 'Home' });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                m: '0 24px 0',
                p: 0
            }}
        >
            <Paper variant='simple' sx={{ p : 8 }} >
                <Typography variant='h4' fontWeight='bold'>
                    {t('title1')}<Typography variant='h4' component='span' fontWeight='bold' color={theme.palette.primary.main}>
                        {t('title-app')}</Typography> ?
                </Typography>
                
                <Typography variant='body2' component='div' sx={{ textAlign : 'justify' }} >
                    <p>{t('p1')}</p>
                    <p>{t('p2')}</p>
                    <List>
                        <BulletItem children={t('p2-b1')} />
                        <BulletItem children={t('p2-b2')} />
                    </List>
                    <p>{t('p3')}<a target='_blank' href='https://www.thesimplepathtowealth.com/'>{t('p3-a1')}</a>.</p>
                    <p>{t('p4')}</p>
                    <List>
                        <BulletItem children={t('p4-b1')} />
                        <BulletItem children={t('p4-b2')} />
                        <BulletItem children={t('p4-b3')} />
                        <BulletItem children={t('p4-b4')} />
                    </List>
                    <p>
                        {t('p5.1')}
                        <a target='_blank' href='https://www.investopedia.com/terms/f/four-percent-rule.asp'>
                            {t('p5-a1')}
                        </a>
                        {t('p5.2')}
                    </p>
                    <p>
                        {t('p6.1')}
                        <a
                            target='_blank'
                            href='https://www.marketwatch.com/story/the-4-rule-is-being-debated-again-but-heres-what-you-should-do-11636999447'
                        >
                            {t('p6-a1')}
                        </a>{t('p6.2')}
                        <a target='_blank' href='https://www.forbes.com/advisor/retirement/dynamic-spending-rules/'>
                            {t('p6-a2')}
                        </a>{t('p6.3')}
                        <a
                            target='_blank'
                            href='https://www.marketwatch.com/story/the-fire-movement-confronts-the-4-rule-11627647364?mod=article_inline'
                        >{t('p6-a3')}
                        </a>{t('p6.4')} 
                    </p>
                </Typography>
            </Paper>
            <Paper variant='rounded-primary' >
                <Typography variant='h4' fontWeight={'bold'}>{t('title2')}</Typography>
                <List>
                    <BulletItem children={t('first-step')} />
                    <BulletItem children={t('second-step')} />
                </List>
            </Paper>
        </Box>
    )
}

export default Home;