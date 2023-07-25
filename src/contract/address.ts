// sync-ed from root via `tr sync-refs`
import { ConnectedWallet } from "@terra-money/wallet-provider";
import config from "../refs.terrain.json"

export const factoryAddress = (wallet: ConnectedWallet) => {
    // @ts-ignore
    return config[wallet.network.name]["token-factory"].contractAddresses.default;
}

export const tokenAddress = (wallet: ConnectedWallet) => {
    // @ts-ignore
    return config[wallet.network.name]["cw20-factory-token"].contractAddresses.default;
}