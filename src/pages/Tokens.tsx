import * as query from '../contract/query';
import { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { TokenData } from '../models/query';
import TokensTable from './../components/TokensTable';
import { Address } from '../models/address';
import { useNavigate } from 'react-router-dom';
import TokensListHeader from './TokensListHeader';
import CreateTokenHeader from './CreateTokenHeader';

function Tokens() {
    const [tokens, setTokens] = useState(new Array<TokenData>())
    const [loading, setLoading] = useState(true);
    const connectedWallet = useConnectedWallet() as ConnectedWallet
    const { status } = useWallet()
    const navigate = useNavigate();

    useEffect(() => {
        const preFetch = async () => {
            if (status === WalletStatus.WALLET_CONNECTED) {
                const tokensAddresses = await query.getMintedTokens(connectedWallet);

                const tokensPromises = tokensAddresses.minted_tokens.map(tokenAddress => {
                    return query.getTokenInfo(tokenAddress, connectedWallet);
                });

                let tokens = await Promise.all(tokensPromises);

                tokens = tokens.map(token => {
                    return {
                        ...token, 
                        total_supply: Number(token.total_supply)
                    }
                });

                setTokens(tokens);
                setLoading(false);
            }
            else {
                setLoading(true);
            }
        }
        preFetch()
    }, [status, connectedWallet]);

    const onRowClick =  (address : Address) => navigate(`/tokens/${address}`);

    return (
        <div className="Tokens">
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <TokensListHeader/>
                <Button disableRipple style={{backgroundImage: "none", backgroundColor:"transparent"}}
                    onClick={()=>{ navigate("/create-token");}}>
                    <CreateTokenHeader/>
                </Button>
            </div>
            <TokensTable tokens={tokens}
                loading={loading}
                onRowClick={onRowClick} />
        </div>
    )
}
export default Tokens
