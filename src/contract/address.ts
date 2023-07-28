// sync-ed from root via `tr sync-refs`
import { ConnectedWallet } from "@terra-money/wallet-provider";
import config from "../refs.terrain.json"

export const factoryAddress = () => {
    // @ts-ignore
    return config["classic"]["token-factory"].contractAddresses.default;
}

export const tokenAddress = () => {
    // @ts-ignore
    return config["classic"]["cw20-factory-token"].contractAddresses.default;
}

export const networkLCD = "https://terra-classic-lcd.publicnode.com";
export const chainID = "columbus-5";
