import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useState } from "react";
import { TokenHolder } from "../../models/query";
import AddressComponent from "../AddressComponent";
import Loader from "../Loader";
import "./TokenHoldersList.scss";
import { useNavigate } from 'react-router-dom';

type Props = {
    holders: Array<TokenHolder>,
    decimals: number,
    symbol: string,
    totalSupply: number,
    pageLoading: boolean,
    loading: boolean
}

function TokenHoldersList(props: Props) {
    const { holders, pageLoading, decimals, totalSupply, loading } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer className="TokenHoldersList"
            component={Paper}>
            {!pageLoading && loading && <Loader></Loader>}
            <Table style={{ marginBottom: "auto" }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Holder address</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell align="right">Holding (%)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {holders.map((holder, index) => (
                        <TableRow className="AccountBalanceRow" key={index}>
                            <TableCell component="th" style={{cursor:"pointer"}}
                                onClick={()=>{window.open(`https://finder.terra.money/classic/address/${holder.address}`)}}>
                                <AddressComponent maxWidth="240px" address={holder.address} />
                            </TableCell>
                            <TableCell>
                                <span>{(holder.balance / (10 ** decimals)).toFixed(2)} {props.symbol}</span>
                            </TableCell>
                            <TableCell align="right">
                                <span>{(holder.balance / totalSupply * 100).toFixed(2)} %</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination className="TokenPagination"
                component="div"
                rowsPerPageOptions={[5, 10, 15, 25]}
                count={holders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage} />
        </TableContainer>
    );
}

export default TokenHoldersList;