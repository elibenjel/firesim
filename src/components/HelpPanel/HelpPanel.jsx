import React from 'react';
import {
    Typography,
    Paper,
    List,
    ListItem,
    Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const HelpPanel = () => {
    const theme = useTheme();

    return (
        <>
            <Paper variant='side-primary' reversed sx={{ maxWidth : '40%'}} >
                <Typography variant='h4' fontWeight={'bold'}>What is FI/RE ?</Typography>
                <Typography variant='body1' sx={{ textAlign : 'justify' }} >
                    <p>
                        FI/RE means Financial Independence / Retire Early.
                    </p>
                    <p>
                        It is about managing your money in order to gain financial security for your future as fast as possible.
                        It truly is a life style that follows those guidelines :
                        <List>
                            <ListItem>
                                <em>spend little, and</em>
                            </ListItem>
                            <ListItem>
                                <em>invest what's left.</em>
                            </ListItem>
                        </List>
                        After enough years, your investments will have grow in value, so that your fortune can support your
                        cost of living, year after year. If you are wondering why you should do that, I recommend the wonderful book of JL. Collins :
                        <a target='_blank' href='https://www.thesimplepathtowealth.com/'>The Simple Path to Wealth</a>. 
                    </p>
                    <p>
                        Let me give an example.
                        <List>
                            <ListItem>
                                Say you need 20000$ a year to live correctly.
                            </ListItem>
                            <ListItem>
                                You also earn 50000$ each year.
                            </ListItem>
                            <ListItem>
                                Imagine you invest the remaining 30000$ each year in something that grows in value 
                                by 8% each year, in average.
                            </ListItem>
                            <ListItem>
                                After 11 years your fortune will have grow to roughly 540000$.                                
                            </ListItem>
                        </List>
                    </p>
                    <p>
                        Using a well-known rule called the 
                        <a target='_blank' href='https://www.investopedia.com/terms/f/four-percent-rule.asp'>"4% rule"</a>,
                        we could say that this is enough to live for a thirty-year retirement period. This rule means that
                        you can spend 4% of your initial fortune value after retirement each year, without running out of money.
                        You can play with the figures on the Fast Sim tab.
                    </p>
                    <p>
                        However the 4% rule is now old, and many think it is 
                        <a target='_blank' href='https://www.marketwatch.com/story/the-4-rule-is-being-debated-again-but-heres-what-you-should-do-11636999447'>outdated</a>
                        to be applied now. Moreover, it is not
                        valid if the retirement period is larger than 30 years. Essentially, it needs to be modified to make
                        the annual withdrawal rate dynamic, so that you manage your fortune more wisely. But it is still
                        feasible (see what <a target='_blank' href='https://www.forbes.com/advisor/retirement/dynamic-spending-rules/'>dynamic withdrawal strategies</a> are possibles).
                        And even <a target='_blank' href='https://www.marketwatch.com/story/the-fire-movement-confronts-the-4-rule-11627647364?mod=article_inline'>for early retirement</a> ! 
                    </p>
                </Typography>
            </Paper>
            <Paper variant='solid-primary' sx={{ maxWidth : '40%', alignSelf : 'flex-start' }} >
                <Typography variant='h4' fontWeight={'bold'}>How to use the app ?</Typography>
                <ul>
                    <li><Typography variant='body1'>Go to the Fast Sim tab, and get an idea about how spending little in order to invest
                    the rest can help you reach financial independence.</Typography></li>
                    <li><Typography variant='body1'>Use the Complete Sim feature to have complete customization
                    power on the parameters of the simulation.</Typography></li>
                </ul>
            </Paper>
        </>
    )
}

export default HelpPanel;