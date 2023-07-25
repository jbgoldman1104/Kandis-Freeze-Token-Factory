import { Address } from "./address"

export interface MintedTokensResponse {
    minted_tokens: Array<Address>
}

export interface ServiceInfoResponse {
    service_fee: string,
    dist_percent: number,
    dist_address: string,
    admin_address: string
}


export interface BalanceResponse {
    balance: string
}

export interface TokenInfoResponse {
    name: string,
    symbol: string,
    decimals: number,
    total_supply: string
}

export interface MarketingResponse {
    description?: string,
    logo?: { url?: string},
    project?: string,
}

export interface MinterResponse {
    minter: string,
    cap?: string
}

export interface AllAccountsResponse {
    accounts: Array<Address>
}

export interface TokenData {
    address?: Address,
    name?: string,
    symbol?: string,
    decimals?: number,
    total_supply?: string | number,
    marketing?: string,
    description?: string,
    cap?: string,
    logo?: { url?: string},
    project?: string,
}

export interface TokenHolder {
    address: Address, 
    balance: number
}
