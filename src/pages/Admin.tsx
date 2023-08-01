import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from "@terra-money/wallet-provider";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ServiceInfoForm from "../components/ServiceInfoForm"
import { Token } from "../models/token";
import * as execute from "./../contract/execute";
import * as query from "./../contract/query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import WidthdrawDialog, { CloseType } from "../components/WithdrawDialog"

function Admin() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0 as Number)
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
    fetchTokenBalance()
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

  const fetchTokenBalance = async () => {
    if (wallet.status === WalletStatus.WALLET_CONNECTED) {
      try {
        const response = await query.getFactoryTokenBalance();  
        setTotalAmount(Number(response.balance) / (10 ** 6));
      } catch (err) {
        console.log(err);
        setTotalAmount(0);
      }
    }
  }

  const onSubmitData = async (closeType : CloseType, amount: Number) => {
    try {
        if(closeType === 'SUBMIT'){
            setLoading(true);
            await execute.widthraw(amount, wallet, connectedWallet);
            enqueueSnackbar(`KLT Tokens withdrawn successfully`, {variant: "success"});
        }
        fetchTokenBalance();
    }
    catch(e) {
        enqueueSnackbar(`${e}`, {variant: "error"});
    }

    setLoading(false);
    setDialogOpen(false);
}


  return (
    <div className="Tokens">
      {loading && <Loader />}
      <ServiceInfoForm onUpdateServiceInfo={onUpdateServiceInfo} totalAmount={totalAmount} onShowDialog={()=>setDialogOpen(true)}/>
      <WidthdrawDialog open={dialogOpen} totalAmount={totalAmount} onSubmitData={onSubmitData}/>
    </div>
  )
}
export default Admin;