import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ServiceInfoForm from "../components/ServiceInfoForm"
import { Token } from "../models/token";
import * as execute from "./../contract/execute";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function Admin() {
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

  const onUpdateServiceInfo = async (service_info: any): Promise<any> => {
    setLoading(true);
    try {
      const {service_fee, dist_percent, dist_address, admin_address} = service_info;

      if ( dist_percent < 0 || dist_percent > 99 ) {
        enqueueSnackbar(`Invalid dist percent`, {variant: "error"});
          return;
      }

      if ( service_fee < 0  ) {
        enqueueSnackbar(`Invalid dist percent`, {variant: "error"});
          return;
      }

      const service_fee_denoms = Number(service_fee) * 1000000;
      const response = await execute.updateServiceInfo( service_fee_denoms.toString(), dist_percent.toString(), dist_address, admin_address, wallet, connectedWallet);


      if (response.logs) {
        enqueueSnackbar(`successfully updated service info`, {variant: "success"});
        if ( admin_address != connectedWallet.walletAddress ) {
          navigate(`/`);
          return;
        }
      }
    }
    catch(e) {
      console.log(e);
      enqueueSnackbar(`${e}`, {variant: "error"});
    }
    setLoading(false);
  }

  return (
    <div className="Tokens">
      {loading && <Loader />}
      <ServiceInfoForm onUpdateServiceInfo={onUpdateServiceInfo} />
    </div>
  )
}
export default Admin;