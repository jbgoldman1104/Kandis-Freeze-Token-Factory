import "./TokensTable.scss";
import { useState } from 'react'
import { TokenData } from '../../models/query';
import { Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { Address } from "../../models/address";
import TokensTableHeader, { Order, HeaderData, HeadCell } from "./../TokensTableHeader";
import Loader from "../Loader";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';



type Props = {
    tokens: Array<TokenData>,
    loading: boolean,
    onRowClick: (id: Address) => void;
}
const headCells: Array<HeadCell> = [
    {
        id: 'logo',
        disablePadding: true,
        label: '',
    },
    {
        id: 'symbol',
        disablePadding: false,
        label: 'Symbol',
    },
    {
        id: 'name',
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'total_supply',
        numeric: true,
        disablePadding: false,
        label: 'Total supply',
    },
    {
        id: 'description',
        disablePadding: false,
        label: 'Address',
    },
];

function TokensTable(props: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof HeaderData>("symbol");
    const { enqueueSnackbar } = useSnackbar();

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key,
    ): (
            a: { [key in Key]: number | string },
            b: { [key in Key]: number | string },
        ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }


    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: keyof HeaderData,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const getElipsisedAddr = (address: string) => {
        const length = address.length;
        return address.substring(0, 10) + "..." + address.substring(length-10, length)
    }

    const onTokenClick = (token : any) => () => props.onRowClick(token.address as any)

    return (
        <TableContainer className="TokensTable"
            component={Paper}>

            {props.loading && <Loader />}
            <Table style={{ marginBottom: "auto", backgroundColor: "transparent" }}>
                <TokensTableHeader
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    headCells={headCells} />
                <TableBody>
                    {stableSort((props as any).tokens, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((token, index) => (
                            <TableRow className="TokenRow"
                                key={index}
                                >
                                <TableCell style={{ "width": "50px" }} onClick={onTokenClick(token )}>
                                    {(token.logo as any)?.url &&
                                        <img src={((token.logo as any)?.url)}
                                            alt="logo"
                                            style={{ maxWidth: "48px", maxHeight: "48px" }} />
                                    }

                                </TableCell>
                                <TableCell style={{ "width": "100px" }} onClick={onTokenClick(token )}>{token.symbol}</TableCell>
                                <TableCell style={{ "width": "100px" }} onClick={onTokenClick(token )}>{token.name}</TableCell>
                                <TableCell style={{ "textAlign": "center"}} onClick={onTokenClick(token )}>{token.total_supply &&
                                    <span>{(Number(token.total_supply) / (10 ** Number(token.decimals)))}</span>
                                }</TableCell>
                                <TableCell className="DescriptionTableCell"  onClick={(e)=> {
                                    e.preventDefault();
                                    navigator.clipboard.writeText(token.address as string);
                                    enqueueSnackbar("Copied address", {variant: "info"});
                                }}>
                                    <div><span>{getElipsisedAddr(token.address as string)} </span>
                                        <ContentCopyIcon style={{"width":"18px", "height":"18px"}}/></div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination className="TokenPagination"
                component="div"
                rowsPerPageOptions={[5, 10, 15, 25]}
                count={props.tokens.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage} />
        </TableContainer>
    )
}
export default TokensTable;
