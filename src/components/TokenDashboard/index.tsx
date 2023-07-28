import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { TokenData } from "../../models/query";
import "./TokenDashboard.scss";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';

type Props = {
    token: TokenData
}

const getElipsisedAddr = (address: string) => {
    if ( !address ) {
        return "";
    }
    const length = address.length;
    return address.substring(0, 10) + "..." + address.substring(length-4, length)
}

function TokenDashboard(props: Props) {
    const { token } = props;
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Grid className="TokenDashboard"
            container
            alignItems="center"
            spacing={3}>
            <Grid item xs={4}>
                <Card className="TokenCard" style={{"cursor":"pointer"}} onClick={(e)=> {
                    e.preventDefault();
                    const addr = token.address as string;
                    if ( navigator.clipboard ) {
                        navigator.clipboard.writeText(addr);
                    } else {
                        const textArea = document.createElement("textarea");
                        textArea.value = addr;
                            
                        // Move textarea out of the viewport so it's not visible
                        textArea.style.position = "absolute";
                        textArea.style.left = "-999999px";
                            
                        document.body.prepend(textArea);
                        textArea.select();
                
                        try {
                            document.execCommand('copy');
                        } catch (error) {
                            console.error(error);
                        } finally {
                            textArea.remove();
                        }
                    }
                    
                    enqueueSnackbar("Copied address", {variant: "info"});
                }}>
                    <CardHeader className="TokenCardHeader" title="Address" />
                    <CardContent className="TokenCardContent">
                        {getElipsisedAddr(token.address as string)}
                        <ContentCopyIcon style={{"width":"32px", "height":"18px"}}/>
                    </CardContent>
                </Card>
            </Grid>


            <Grid item xs={2}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Name" />
                    <CardContent className="TokenCardContent">{token.name}</CardContent>
                </Card>
            </Grid>

            <Grid item xs={2}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Symbol" />
                    <CardContent className="TokenCardContent">{token.symbol}</CardContent>
                </Card>
            </Grid>

            <Grid item xs={2}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Total Supply" />
                    <CardContent className="TokenCardContent">
                        {token.total_supply &&
                            <span>{Number(token.total_supply) / 10 ** Number(token.decimals)}</span>
                        }
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={2}>
                <Card className="TokenCard">
                    <CardHeader className="TokenCardHeader" title="Capacity" />
                    <CardContent className="TokenCardContent">
                        {token.cap ? Number(token.cap) / 10 ** Number(token.decimals): "Infinity"}
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}></Grid>
        </Grid>
    );
}

export default TokenDashboard;