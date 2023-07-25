import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import StakeTokenForm from "../components/StakeTokenForm"
import { Token } from "../models/token";
import * as execute from "./../contract/execute";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";


function StakeToken() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const connectedWallet = useConnectedWallet() as ConnectedWallet
  const wallet = useWallet()
  

  useEffect(() => {
    const preFetch = async () => {
      if (wallet.status === WalletStatus.WALLET_CONNECTED) {
        setLoading(false)
      }
      else {
        setLoading(true)
      }
    }
    preFetch()
  }, [wallet, connectedWallet])

  return (
    <div className="Tokens">
      {loading && <Loader />}
      <StakeTokenForm/>
    </div>
  )
}
export default StakeToken;