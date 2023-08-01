import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Address } from "../../models/address";
import Loader from "../Loader";
import "./WithdrawDialog.scss";

export type CloseType = "SUBMIT" | "CLOSE";

export interface SubmitTokenData {
    amount?: number,
    address?: Address,
};

type TokenProps = {
    open: boolean,
    totalAmount: Number,
    onSubmitData: (closeType : CloseType, amount: Number) => void
};

function WithdrawDialog(props: TokenProps) {
    const { open, totalAmount } = props;
    const [amount, setAmount] = useState(0 as Number);
    const [loading, setLoading] = useState(false);

    const onSubmitData = async (type : CloseType) => {
        setLoading(true);
        await props.onSubmitData(type, amount);
        setAmount(0);
        setLoading(false);
    }

    const onValueChange = (e: any) => {
        setAmount(e.target.value);
    }

    const onUseAllHoldings = () => {
        setAmount(totalAmount);
    }
    return (
        <Dialog className="TokenDialog"
            open={open}
            onClose={()=>onSubmitData("CLOSE")}>
            <DialogTitle>
                Withdraw KLT Tokens : Total : {totalAmount.toString()} Tokens
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Withdrawn tokens will be send to the wallet address.
                </DialogContentText>
                <Grid container
                    spacing={2}>
                    
                    <Grid item
                        xs={8}>
                        <TextField
                            id="amount"
                            value={amount}
                            onChange={onValueChange}
                            placeholder="0"
                            label="Amount"
                            variant="standard"
                            fullWidth />
                    </Grid>
                    <Grid className="ButtonWrapper" 
                        item 
                        xs={4}>
                        <Button variant="contained" 
                            onClick={onUseAllHoldings}>All tokens</Button>
                    </Grid>
                
                </Grid>
            </DialogContent>
            <DialogActions className="TokenDialogActions">
                <Button variant="contained" 
                    onClick={()=>onSubmitData("CLOSE")}>Cancel</Button>
                <Button variant="contained" 
                    onClick={()=>onSubmitData("SUBMIT")}>
                        Withdraw Tokens
                    </Button>
            </DialogActions>
            {loading && <Loader/>}
        </Dialog>
    );
}
export default WithdrawDialog;