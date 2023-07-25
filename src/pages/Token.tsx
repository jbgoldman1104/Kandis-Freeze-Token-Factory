import { useEffect, useState } from 'react'
import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import Loader from './../components/Loader';
import TokenDashboard from './../components/TokenDashboard';
import TokenHoldersList from './../components/TokenHoldersList';
import TokenDialog, { CloseType, SubmitTokenData, TokenPropsType } from './../components/TokenDialog';
import TokenHeader from './../components/TokenHeader';
import { useParams } from 'react-router-dom';
import { getTokenAccountsWithBalance, getTokenData } from '../contract/query';
import { Address } from '../models/address';
import * as execute from "./../contract/execute";
import { TokenData, TokenHolder } from '../models/query';
import { useSnackbar } from "notistack";

function Token() {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [loadingTokeHolders, setLoadingTokeHolders] = useState(true);
    const [dialogType, setDialogType] = useState(null as TokenPropsType);
    const [tokenData, setTokenData] = useState({} as TokenData);
    const [tokenHolders, setTokenHolders] = useState({ holders: Array<TokenHolder>() });
    const [walletHoldings, setWalletHoldings] = useState(0);
    let { id } = useParams();

    const connectedWallet = useConnectedWallet() as ConnectedWallet
    const wallet = useWallet()

    useEffect(() => {
        fetchData()
    }, [wallet, connectedWallet])

    const fetchData = async () => {
        if (wallet.status === WalletStatus.WALLET_CONNECTED) {
            const tokenData = await getTokenData(id as Address, connectedWallet);
            setLoading(false);
            setTokenData(tokenData);

            setLoadingTokeHolders(true);
            const holders = await getTokenAccountsWithBalance(id as Address, connectedWallet);
            const holding = holders.find(holding => holding.address === connectedWallet.terraAddress);
            if(holding && tokenData.decimals){
                setWalletHoldings(holding.balance / (10 ** tokenData.decimals))
            }
            setTokenHolders({ holders });
            setLoadingTokeHolders(false);
        }
        else {
            setLoading(true)
        }
    }

    const onOpenMintToken = () => setDialogType("MINT");

    const onOpenBurnToken = () => setDialogType("BURN");

    const onSubmitData = async (closeType : CloseType, data: SubmitTokenData) => {
        try {
            if(closeType === 'SUBMIT'){
                setLoading(true);
                if(tokenData.address && data.address && data.amount) {
                    if(dialogType === "MINT") {
                        await execute.mintToken(
                            tokenData, 
                            data, 
                            wallet,
                            connectedWallet
                        );
                        enqueueSnackbar(`Tokens ${dialogType?.toLowerCase()}ed successfully`, {variant: "success"});
                    }
                    else {
                        await execute.burnToken(
                            tokenData, 
                            data, 
                            wallet,
                            connectedWallet
                        );
                        enqueueSnackbar(`Tokens ${dialogType?.toLowerCase()}ed successfully`, {variant: "success"});
                    }
                }
            }
            fetchData();
        }
        catch(e) {
            enqueueSnackbar(`${e}`, {variant: "error"});
        }

        setLoading(false);
        setDialogType(null);
    }

    return (
        <div className="Tokens">
            {loading && <Loader />}
            <TokenHeader
                onOpenMintToken={() => onOpenMintToken()}
                onOpenBurnToken={() => onOpenBurnToken()} />
            <TokenDashboard token={tokenData} />
            <TokenHoldersList holders={tokenHolders.holders}
                symbol={tokenData.symbol as string}
                decimals={Number(tokenData.decimals)}
                totalSupply={Number(tokenData.total_supply)}
                pageLoading={loading}
                loading={loadingTokeHolders} />
            <TokenDialog
                type={dialogType}
                symbol={tokenData.symbol}
                holdingAmount={walletHoldings}
                walletAddress={connectedWallet?.terraAddress}
                onSubmitData={onSubmitData} />
        </div>
    )
}
export default Token
