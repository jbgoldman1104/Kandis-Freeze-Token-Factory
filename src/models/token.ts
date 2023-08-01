import { AccAddress } from "@terra-money/terra.js"

export interface Token {
    name: string,
    symbol: string,
    decimals: number,
    initial_balances: Array<InitialBalances>,
    mint?: Mint,
    marketing?: MarketingInfo;
}

export interface InitialBalances {
    amount: string,
    address: AccAddress
}

export interface Mint {
    minter: AccAddress | null,
    cap: string
}

export interface MarketingInfo {
    project?: string,
    description?: string,
    marketing?: string,
    logo?: MarketingLogo,
}

export interface MarketingLogo {
    url: string,
    embedded?: string
}

export class TokenUtils {
    static fromTokenData = (tokenData : TokenData, dist_address: String) : Token => {
        const clonedTokenData = {...tokenData};//Object.assign({}, tokenData);
        let token : Token = {
            name: clonedTokenData.name,
            symbol: clonedTokenData.symbol,
            decimals: Number(clonedTokenData.decimals),
            initial_balances: clonedTokenData.initial_balances.map((obj) => {
                let ib = {...obj};
                let amount = Number(ib.amount) * (10 ** Number(clonedTokenData.decimals));
                ib.amount = amount.toString();
                if ( ib.address == dist_address ) {
                    ib.amount = "0";
                }
                return ib;
            }),
            mint: {
                minter: clonedTokenData.minter,
                cap: (Number(clonedTokenData.cap) * (10 ** Number(clonedTokenData.decimals))).toString()
            },
            marketing: {
                marketing: clonedTokenData.minter,
                logo: {
                    url: ""
                }
            }
        }
        
        // if(clonedTokenData.project) {
        //     token.marketing = {
        //         project : clonedTokenData.project
        //     }
        // }

        // if(clonedTokenData.description) {
        //     token.marketing = {
        //         ...token.marketing,
        //         description : clonedTokenData.description
        //     }
        // }
        
        // if(clonedTokenData.logo) {
        //     token.marketing = {
        //         ...token.marketing,
        //         logo: {
        //             url : clonedTokenData.logo
        //         }
        //     }
        // }
        return token;
    }

    static getInitialBalance = (token: Token): number => {
        let initialBalance = 0;

        token.initial_balances.forEach(ib => {
            initialBalance = initialBalance + Number(ib.amount);
        });

        return initialBalance;
    }
}

export interface TokenData {
    name: string;
    symbol: string;
    decimals: number;
    initial_balances: Array<InitialBalances>;
    minter: string;
    cap: number;
    project: string,
    description: string,
    logo: string,
}