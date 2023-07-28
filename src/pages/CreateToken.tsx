import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import NewTokenForm from "../components/NewTokenForm"
import { Token } from "../models/token";
import * as execute from "./../contract/execute";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { TokenData } from '../models/query';
import * as query from '../contract/query';

function CreateToken() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const connectedWallet = useConnectedWallet() as ConnectedWallet
  const [tokens, setTokens] = useState(0)
  const wallet = useWallet()
  

  useEffect(() => {
    const preFetch = async () => {
      if (wallet.status === WalletStatus.WALLET_CONNECTED) {
        const tokensAddresses = await query.getMintedTokens(connectedWallet);

        setTokens(tokensAddresses.minted_tokens.length);
        setLoading(false)
      }
      else {
        setLoading(true)
      }
    }
    preFetch()
  }, [wallet, connectedWallet])

  const onCreateNewToken = async (token: Token): Promise<any> => {
    setLoading(true);
    try {
      const newTokenResponse = await execute.createNewToken(token, wallet, connectedWallet);

      if (newTokenResponse.logs) {
        const tokenId = newTokenResponse?.logs[0].events[1].attributes[0].value;
        enqueueSnackbar(`Token '${token.name}' successfully created`, {variant: "success"});
        navigate(`/tokens/${tokenId}`);
      }
      return newTokenResponse;
    }
    catch(e) {
      console.log(e);
      enqueueSnackbar(`Failed to Create Token.Check the token parameters and your wallet balance.`, {variant: "error"});
    }
    setLoading(false);
  }

  return (
    <div className="Tokens">
      {loading && <Loader />}
      <NewTokenForm onCreateNewToken={onCreateNewToken} tokens={tokens}/>
    </div>
  )
}
export default CreateToken;