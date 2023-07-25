import './StakeTokenForm.scss';
import { useEffect, useState } from 'react'
import { Token, TokenData, TokenUtils } from './../../models/token';
import { Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { Add, PersonAdd, PlaylistRemove } from '@mui/icons-material';
import { factoryAddress } from '../../contract/address';
import { useConnectedWallet } from '@terra-money/wallet-provider';



function StakeTokenForm() {
    
    return (
        <Grid className="TokenHeader"
            container
            spacing={3}>
            sdf
        </Grid>
    )
}

export default StakeTokenForm;