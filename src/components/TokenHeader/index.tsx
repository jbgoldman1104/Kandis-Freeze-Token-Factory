import { Button, Card, Grid } from "@mui/material";
import "./TokenHeader.scss";
import AddIcon from '@mui/icons-material/Add';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink } from "react-router-dom";

type Props = {
    onOpenMintToken: () => void,
    onOpenBurnToken: () => void
};

function TokenHeader(props: Props) {
    return (
        <Grid className="TokenHeader"
            container
            spacing={3}>
            <Grid item xs={8}>
                <Card className="TokenCardHeader">
                    <NavLink className="NavBackAction" to="/tokens">
                        <ArrowBackIcon/>
                        <h3>Back to tokens list</h3>
                    </NavLink>
                </Card>
            </Grid>
            <Grid item xs={2}>
                <Card className="TokenHeaderCardAction">
                    {/* <Button disableRipple 
                        fullWidth
                        onClick={props.onOpenMintToken}>
                        <AddIcon/>
                        <span>Mint</span>
                    </Button> */}
                </Card>
            </Grid>
            <Grid item xs={2}>
                <Card className="TokenHeaderCardAction">

                    {/* <Button disableRipple 
                        fullWidth
                        onClick={props.onOpenBurnToken}>
                        <LocalFireDepartmentIcon/>
                        <span>Burn</span>
                    </Button> */}
                </Card>
            </Grid>
            <Grid item xs={12}> </Grid>
        </Grid>
    );
}
export default TokenHeader;