import { Card, CardContent } from "@mui/material";
import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from "@terra-money/wallet-provider";
import "./InfoCard.scss";
import { useEffect, useState } from "react";
import { getServiceInfo } from "../../contract/query";
import { tokenAddress } from "../../contract/address";

function InfoCard() {
    const { status } = useWallet();
    const [serviceFee, setServiceFee] = useState<string>("");
    const [tokenAddr, setTokenAddr] = useState<string>("");
    const connectedWallet = useConnectedWallet() as ConnectedWallet

    useEffect(() => {
        const serviceFee = async () => {
            if (status === WalletStatus.WALLET_CONNECTED) {
                try {
                    const serviceFee = await getServiceInfo(connectedWallet);
                    const tk = tokenAddress();
                    setServiceFee((Number(serviceFee.service_fee)/1000000).toString())
                    setTokenAddr(tk)
                } catch (e) {
                    console.log(e);
                }
            }
            else {
                setServiceFee("");    
            }
        }
        serviceFee()
    }, [status]);
    

    return (
        <Card className="InfoCard">
            <CardContent>
                <h2>CW20 Tokens Factory</h2>
                <div className="InfoCardDivider"/>
                <div>
                    <b>Create</b> a new token.<br/><br/>
                    <b>Mint</b> already existent tokens.<br/><br/>
                    <b>Burn</b> tokens. <br/><br/>
                    Service Fee : {serviceFee} TOKENS  <br/><br/>
                    Token Address : {tokenAddr}
                </div>
                <h3 style={{
                    opacity: status === WalletStatus.WALLET_NOT_CONNECTED ? "1" : "0"
                }}>
                    First... Remember to connect the wallet
                </h3>
            </CardContent>
        </Card>
    );
}
export default InfoCard;