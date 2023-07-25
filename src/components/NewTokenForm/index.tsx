import './NewTokenForm.scss';
import { useEffect, useState } from 'react'
import { Token, TokenData, TokenUtils } from './../../models/token';
import { Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import { Add, PersonAdd, PlaylistRemove } from '@mui/icons-material';
import { factoryAddress } from '../../contract/address';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import NewAddressButton from '../../pages/NewAddressButton';
import CreateTokenHeader from '../../pages/CreateTokenHeader';

type Props = {
    onCreateNewToken: (token: Token) => Promise<any>;
    tokens: Number;
};

function NewTokenForm(props: Props) {
    const connectedWallet = useConnectedWallet();
    const [tokenData, setTokenData] = useState({
        decimals: 6,
        initial_balances: Array(1).fill({
            address: "",
            amount: ""
        })
    } as TokenData);

    useEffect(()=> {
        if(connectedWallet) {
            setTokenData({
                ...tokenData,
                minter: factoryAddress(connectedWallet)
            })
        }
    },[connectedWallet])

    const submitCreateToken = async (event: any) => {
        event.preventDefault();
        const token = TokenUtils.fromTokenData(tokenData);
        await props.onCreateNewToken(token);
    }

    const onValueChange = (event: any) => {
        // @ts-ignore;
        setTokenData({
            ...tokenData,
            [event.target.id]: event.target.value
        });
    }

    const onIncreaseInitialBalance = (event: any) => {
        let initial_balances = tokenData.initial_balances;
        initial_balances.push({
            amount: "",
            address: ""
        });

        setTokenData({
            ...tokenData,
            initial_balances: initial_balances
        })
    }

    const onInitialBalanceValueChange = (event: any, index: number) => {
        let initial_balance = tokenData.initial_balances[index];
        initial_balance = {
            ...initial_balance,
            [event.target.id]: event.target.value
        };
        tokenData.initial_balances[index] = initial_balance;
        setTokenData(tokenData)
    }

    const onClickRemoveInitialBalance = (index: number) => {
        let initial_balances = tokenData.initial_balances;
        initial_balances.splice(index,1);
        setTokenData({
            ...tokenData,
            initial_balances: initial_balances
        })
    }


    return (
        <Card className="NewTokenForm">
            <CardContent className="CardContent">
                <div style={{display:"flex", justifyContent:"center"}}>
                    <div className='CardHeader'>
                        <div>
                            Create your own tokens with one click!
                        </div>
                        <div style={{display:"flex", justifyContent:"center"}}>
                            <div className='YellowBox'/>
                            <div className='NumberBox'>
                                {props.tokens.toString()}
                            </div>
                            <span className='FollowingPhase'>Tokens Created</span>
                        </div>
                    </div>
                </div>
                <div style={{fontWeight:'bold', fontSize: '24px', marginTop: '40px', marginBottom: '30px'}}>
                    Enter Token Parameters
                </div>
                <Grid container
                    columnSpacing={12}
                    rowSpacing={4}
                    marginBottom="2em">
                    <Grid item xs={4}>
                        <span className='InputLabel'>
                            Name*
                        </span>
                        <TextField fullWidth
                            className='InputField'
                            id="name"
                            type="text"
                            label=""
                            onChange={(event) => onValueChange(event)}
                            required
                            variant="outlined"
                            defaultValue={tokenData.name} />
                    </Grid>
                    <Grid item xs={4}>
                        <span className='InputLabel'>
                            Symbol*
                        </span>
                        <TextField fullWidth
                            id="symbol" 
                            type="text"
                            className='InputField'
                            onChange={(event) => onValueChange(event)}
                            required
                            variant="outlined"
                            defaultValue={tokenData.symbol} />
                    </Grid>
                    <Grid item xs={4}>
                        <span className='InputLabel' style={{marginLeft:'15px'}}>
                            Decimals*
                        </span>
                        <TextField fullWidth
                            id="decimals"
                            type="number"
                            className='InputField'
                            onChange={(event) => onValueChange(event)}
                            required
                            disabled
                            variant="outlined"
                            defaultValue={tokenData.decimals} />
                    </Grid>
                    
                    {/* <Grid item xs={4}>
                            <span className='InputLabel'>
                                Project Name
                            </span>
                            <TextField fullWidth
                                id="project"
                                type="text"
                                className='InputField'
                                onChange={(event) => onValueChange(event)}
                                variant="outlined"
                                defaultValue={tokenData.project} />
                        </Grid> */}
                    <Grid item xs={8}>
                            <span className='InputLabel'>
                                Project Description
                            </span>
                        <TextField fullWidth
                            id="description"
                            type="text"
                            className='InputField'
                            onChange={(event) => onValueChange(event)}
                            variant="outlined"
                            defaultValue={tokenData.description} />
                    </Grid>
                    <Grid item xs={4} marginBottom="1em">
                    <span className='InputLabel'>
                    Token Logo URL
                            </span>
                        <TextField fullWidth
                            id="logo"
                            type="text"
                            className='InputField'
                            
                            onChange={(event) => onValueChange(event)}
                            variant="outlined"
                            defaultValue={tokenData.logo} />
                    </Grid>
                </Grid>
                <div className="InitialBalancesHeader">
                    <div style={{fontWeight:'bold', fontSize: '24px', marginTop: '40px', marginBottom: '30px'}}>
                        Initial distribution
                    </div>
                    <Button disableRipple style={{backgroundImage: "none", backgroundColor:"transparent"}}
                        onClick={onIncreaseInitialBalance}>
                        <NewAddressButton/>
                    </Button>

                </div>
                {tokenData.initial_balances.map((initialBalance, index) => (
                    <Grid container
                        className="InitialBalance"
                        spacing={2}
                        key={index}>
                        
                        <Grid item xs={7}>
                            <span className='InputLabel'>
                                Address*
                            </span>
                            <TextField fullWidth
                                id="address"
                                type="text"
                                className='InputField'
                                onChange={(event) => onInitialBalanceValueChange(event, index)}
                                variant="outlined"
                                defaultValue={initialBalance.address}
                                required/>
                        </Grid>
                        <Grid item xs={4}>
                            <span className='InputLabel'>
                                Amount*
                            </span>
                            <TextField fullWidth
                                id="amount"
                                type="number"
                                className='InputField'
                                onChange={(event) => onInitialBalanceValueChange(event, index)}
                                variant="outlined"
                                defaultValue={initialBalance.amount}
                                required/>
                        </Grid>
                        <Grid item xs={1}
                            className="InitialBalanceRemoveItem">
                                {index !== 0 && 
                                    <Button disableRipple
                                        onClick={() => onClickRemoveInitialBalance(index)}>
                                        <PlaylistRemove/>
                                    </Button>
                                }
                        </Grid>
                    </Grid>
                ))}
                <div className="InitialBalancesHeader">
                    <div style={{fontWeight:'bold', fontSize: '24px', marginTop: '40px', marginBottom: '30px'}}>
                        
                    </div>
                    <Button disableRipple style={{backgroundImage: "none", backgroundColor:"transparent"}}
                        onClick={submitCreateToken}>
                        <CreateTokenHeader/>
                    </Button>
                    

                </div>
            </CardContent>
        </Card>
    )
}

export default NewTokenForm;