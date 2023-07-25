import './ServiceInfoForm.scss';
import { useEffect, useState } from 'react'
import { Token, TokenData, TokenUtils } from './../../models/token';
import { Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { Add, PersonAdd, PlaylistRemove } from '@mui/icons-material';
import { factoryAddress } from '../../contract/address';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { getServiceInfo } from '../../contract/query';


type Props = {
    onUpdateServiceInfo: (service_info: any) => Promise<any>;
};

function ServiceInfoForm(props: Props) {
    const connectedWallet = useConnectedWallet();
    const [serviceInfo, setServiceInfo] = useState({
        service_fee: "", dist_percent: 0, dist_address: "", admin_address: ""
    }) ;

    useEffect(()=> {
        const preFetch = async () => {
            let isAdmin = false;
            try {
              if (connectedWallet && connectedWallet.walletAddress) {
                  let serviceInfo = await getServiceInfo(connectedWallet)
                  setServiceInfo({
                    ...serviceInfo,
                    service_fee: (Number(serviceInfo.service_fee) / 1000000).toString()
                  })
              }
              else {
                isAdmin = false;
              }
            } catch (e) {
              isAdmin = false;
            }
        }
        preFetch()
    }, [connectedWallet])

    const submitServiceInfo = async (event: any) => {
        event.preventDefault();
        await props.onUpdateServiceInfo(serviceInfo);
    }

    const onValueChange = (event: any) => {
        // @ts-ignore;
        setServiceInfo({
            ...serviceInfo,
            [event.target.id]: event.target.value
        });
    }


    return (
        <Card className="ServiceInfoForm">
            <CardHeader action={
                <Button className="SubmitActionButton"
                    variant="contained"
                    startIcon={<Add />}
                    onClick={submitServiceInfo}
                    disableRipple>Update Service Info</Button>
                }
            />
            <CardContent className="CardContent">
                <Grid container
                    spacing={6}
                    marginBottom="2em">
                    <Grid item xs={12}>
                        <TextField fullWidth
                            id="service_fee"
                            type="number"
                            label="Service Fee (Tokens)"
                            onChange={(event) => onValueChange(event)}
                            required
                            variant="standard"
                            value={serviceInfo.service_fee} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth
                            id="dist_percent"
                            type="number"
                            label="Distribution Percent"
                            onChange={(event) => onValueChange(event)}
                            required
                            variant="standard"
                            value={serviceInfo.dist_percent} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth
                            id="dist_address"
                            type="text"
                            label="Distribution Address"
                            onChange={(event) => onValueChange(event)}
                            required
                            variant="standard"
                            value={serviceInfo.dist_address} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth
                            id="admin_address"
                            type="text"
                            label="Admin Address"
                            onChange={(event) => onValueChange(event)}
                            required
                            variant="standard"
                            value={serviceInfo.admin_address} />
                    </Grid>
                </Grid>
                
                
            </CardContent>
        </Card>
    )
}

export default ServiceInfoForm;