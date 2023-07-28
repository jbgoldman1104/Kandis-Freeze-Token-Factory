import { LCDClient } from '@terra-money/terra.js'
import { ConnectedWallet } from '@terra-money/wallet-provider'
import { factoryAddress, networkLCD, chainID  } from './address'
import { AllAccountsResponse, MarketingResponse, MintedTokensResponse, MinterResponse, ServiceInfoResponse, TokenData, TokenInfoResponse } from '../models/query';
import { Address} from '../models/address';


export const getMintedTokens = async (wallet: ConnectedWallet): Promise<MintedTokensResponse> => {
    const lcd = new LCDClient({
        URL: networkLCD,
        chainID: chainID,
    })
    return lcd.wasm.contractQuery(factoryAddress(), { get_minted_tokens: {} })
}

export const getServiceInfo = async (wallet: ConnectedWallet): Promise<ServiceInfoResponse> => {
    const lcd = new LCDClient({
        URL: networkLCD,
        chainID,
    })
    return lcd.wasm.contractQuery(factoryAddress(), { get_service_info: {} })
}

export const getTokenInfo = async (tokenAddress: Address, wallet: ConnectedWallet, lcd?: LCDClient): Promise<TokenData> => {
    if (!lcd) {
        lcd = new LCDClient({
            URL: networkLCD,
            chainID,
        });
    }

    let tokenData: TokenData = {
        address: tokenAddress
    };

    try {
        let queryTokenInfo: TokenInfoResponse = await lcd.wasm.contractQuery(tokenAddress, {
            token_info: {}
        });
        tokenData = {
            ...tokenData,
            ...queryTokenInfo
        }
    }
    catch (e) {
        console.error(e);
    }

    try {
        let marketingInfo: MarketingResponse = await lcd.wasm.contractQuery(tokenAddress, {
            marketing_info: {}
        });
        tokenData = {
            ...tokenData,
            ...marketingInfo
        }
    } catch (e) {
        console.error(e);
    }

    return tokenData;
}

export const getTokenData = async (tokenAddress: Address, wallet: ConnectedWallet): Promise<TokenData> => {
    const lcd = new LCDClient({
        URL: networkLCD,
        chainID,
    });
    let tokenData: TokenData = await getTokenInfo(tokenAddress, wallet, lcd);

    try {
        let res: MinterResponse = await lcd.wasm.contractQuery(tokenAddress, {
            minter: {}
        });
        tokenData = {
            ...tokenData,
            ...res
        }
    } catch (e) {
        console.error(e);
    }

    return tokenData;
}

export const getTokenAccountsWithBalance = async (tokenAddress: Address, wallet: ConnectedWallet): Promise<Array<{balance:number, address: Address}>> => {
    const lcd = new LCDClient({
        URL: networkLCD,
        chainID,
    });

    let res: AllAccountsResponse = await lcd.wasm.contractQuery(tokenAddress, {
        all_accounts: {}
    });

    if (res.accounts) {
        const balancePromises = res.accounts.map(account => {
            return getAccountBalance(tokenAddress, account, wallet);
        });
        const balances = await Promise.all(balancePromises);

        const accountsWithBalances = balances.map((balance,index) =>{
            return {
                balance,
                address: res.accounts[index]
            }
        });

        return accountsWithBalances;
    }
    else return new Array();
}

export const getAccountBalance = async (tokenAddress: Address, address: Address, wallet: ConnectedWallet): Promise<number> => {
    const lcd = new LCDClient({
        URL: networkLCD,
        chainID,
    });

    try {
        let res = await lcd.wasm.contractQuery(tokenAddress, {
            balance: { address }
        }) as { balance: string };

        return Number(res.balance);
    } catch (e) {
        console.error(e);
        return 0;
    }
}