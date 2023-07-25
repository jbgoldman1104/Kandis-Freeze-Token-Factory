import { LCDClient, MsgExecuteContract, Coins, Coin, Fee, CreateTxOptions } from "@terra-money/terra.js";
import { ConnectedWallet, Wallet } from "@terra-money/wallet-provider";
import { SubmitTokenData } from "../components/TokenDialog";
import { Address } from "../models/address";
import { TokenData } from "../models/query";
import { Token, TokenUtils } from "../models/token";
import { factoryAddress, tokenAddress } from "./address";
import { useCallback, useMemo } from "react"
import { useWallet } from "@terra-money/wallet-provider"
import Axios from "axios"
import BN from "bignumber.js"
import { isNil } from "ramda"
import { setupCache } from "axios-cache-adapter"
import { getServiceInfo } from "./query";

const cache = setupCache({
  maxAge: 2500,
  exclude: {
    query: false,
    methods: ["post", "patch", "put", "delete"],
  },
})

const axios = Axios.create({
  adapter: cache.adapter,
})


const isFinite = (n?: BN.Value): boolean =>
  !isNil(n) && new BN(n).isFinite()

const ceil = (n: BN.Value): string =>
  new BN(n).integerValue(BN.ROUND_CEIL).toString()

const times = (a?: BN.Value, b?: BN.Value): string =>
  new BN(a || 0).times(b || 0).toString()

const min = (array: BN.Value[]): string =>
  BN.min.apply(null, array.filter(isFinite)).toString()

// ==== utils ====

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;
const DECIMALS = 6;

interface TokenResult {
  name: string
  symbol: string
  decimals: number
  total_supply: string
  contract_addr: string
  icon: string
  verified: boolean
}

interface GasPriceResponse {
  uluna: string
  uusd: string
  usdr: string
  ukrw: string
  umnt: string
  uaud: string
  ucad: string
  uchf: string
  ucny: string
  ueur: string
  ugbp: string
  uhkd: string
  uinr: string
  ujpy: string
  usgd: string
  uthb: string
}

interface TaxResponse {
  height: string
  result: string
}

const loadGasFee = async () => {
  const fcd = "https://terra-classic-fcd.publicnode.com"
  const url = `${fcd}/v1/txs/gas_prices`
  const res: GasPriceResponse = (await axios.get(url)).data
  return res.uluna;
}

const loadTokensInfo = async () => {
  const url = `https://api-classic.terraswap.io/v2/tokens`
  const res: TokenResult[] = (await axios.get(url)).data
  return res
}

const loadTaxRate = async () => {
  let taxRate = "0"
  try {
    const fcd = "https://terra-classic-fcd.publicnode.com"
    const url = `${fcd}/treasury/tax_rate`
    const res: TaxResponse = (await axios.get(url)).data
    taxRate = res.result
  } catch (error) {
    console.error(error)
  }

  return taxRate
}

const loadTaxInfo = async (contract_addr: string) => {
  if (!contract_addr) {
    return ""
  }

  let taxCap = ""
  try {
    const fcd = "https://terra-classic-fcd.publicnode.com"
    const url = `${fcd}/treasury/tax_cap/${contract_addr}`
    const res: TaxResponse = (await axios.get(url)).data
    taxCap = res.result
  } catch (error) {
    console.error(error)
  }

  return taxCap
}

const calcTax = (amount: string, taxCap: string, taxRate: string) => {
  if (taxCap === "") {
    return ceil(times(amount, taxRate))
  }

  return ceil(min([times(amount, taxRate), taxCap]))
}


const toAmount = (value: string, contract_addr?: string) => {
  let decimals = 6
  const e = Math.pow(10, decimals)
  return value ? new BN(value).times(e).integerValue().toString() : "0"
}

const _exec =
  (msgs: MsgExecuteContract[]) =>
    async (wallet: Wallet, connectedWallet: ConnectedWallet) => {

      console.log("MSGS >>>", JSON.stringify(msgs[0]))

      const lcd = new LCDClient({
        URL: connectedWallet.network.lcd,
        chainID: connectedWallet.network.chainID,
        gasPrices: [new Coin('uluna', 30)]
      });
      let txOptions:CreateTxOptions = {
        msgs,
        memo: "",
        gasPrices:"",
        // fee: new Fee(0, [new Coin('uluna', 0)])
      }
      const signMsg = await lcd.tx.create([{ address: connectedWallet.walletAddress }], txOptions)
      let fee = signMsg.auth_info.fee.amount
      
      if ( msgs[0].coins.toArray().length > 0 ) {
        const taxRate = await loadTaxRate()
        const taxCap = await loadTaxInfo("uluna")
        const amount = msgs[0].coins.get("uluna")?.toData().amount || ""
        const tax = new Coins([new Coin('uluna', calcTax(amount, taxCap, taxRate))]);
        
        fee = signMsg.auth_info.fee.amount.add(tax)
        console.log(">>>", tax.toString())
        console.log(">>>", signMsg.auth_info.fee.amount.toString())
        console.log(">>>", fee.toString())
      }

      txOptions.fee = new Fee(signMsg.auth_info.fee.gas_limit, fee)

      const { result } = await wallet.post(
        { ...txOptions },
        connectedWallet.walletAddress
      );

while (true) {
  try {
    return await lcd.tx.txInfo(result.txhash);
  } catch (e) {
    if (Date.now() < untilInterval) {
      await sleep(500);
    } else if (Date.now() < until) {
      await sleep(1000 * 10);
    } else {
      throw new Error(
        `Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
      );
    }
  }
}
};


// ==== execute contract ====
export const mintToken = async (
  tokenData: TokenData,
  userData: SubmitTokenData,
  wallet: Wallet,
  connectedWallet: ConnectedWallet
) => {
  const executeMsg = [
    new MsgExecuteContract(
      connectedWallet.walletAddress,
      factoryAddress(connectedWallet),
      {
        deposit: {
          mint: {
            token_address: tokenData.address,
            recipient: userData.address,
            // allowance_address: factoryAddress(connectedWallet)
          }
        }
      },
      [new Coin("uluna", (Number(userData.amount) * (10 ** DECIMALS)).toString())]
    )
  ]
  return _exec(executeMsg)(wallet, connectedWallet);
}

export const createNewToken = async (token: Token, wallet: Wallet, connectedWallet: ConnectedWallet) => {

  let serviceFee = await getServiceInfo(connectedWallet);
  let msg = btoa(JSON.stringify({
    instantiate: token
  }))
  console.log("msg >>> ", msg);

  const executeMsg = [
    new MsgExecuteContract(
      connectedWallet.walletAddress,
      tokenAddress(connectedWallet),
      {
        send: {
          contract: factoryAddress(connectedWallet),
          amount: serviceFee.service_fee,
          msg
        }
      }
    )
  ]
  return _exec(executeMsg)(wallet, connectedWallet);
}

export const burnToken = async (
  tokenData: TokenData,
  userData: SubmitTokenData,
  wallet: Wallet,
  connectedWallet: ConnectedWallet
) => {
  const executeMsg = [
    new MsgExecuteContract(
      connectedWallet.walletAddress,
      tokenData.address as string,
      {
        increase_allowance: {
          spender: factoryAddress(connectedWallet),
          amount: (Number(userData.amount) * 10 ** DECIMALS).toString()
        }
      }
    ),
    new MsgExecuteContract(
      connectedWallet.walletAddress,
      factoryAddress(connectedWallet),
      {
        burn: {
          token_address: tokenData.address,
          amount: (Number(userData.amount) * 10 ** DECIMALS).toString()
        }
      }
    ),
    new MsgExecuteContract(
      connectedWallet.walletAddress,
      tokenData.address as string,
      {
        decrease_allowance: {
          spender: factoryAddress(connectedWallet),
          amount: (Number(userData.amount) * 10 ** DECIMALS).toString()
        }
      }
    )
  ]
  return _exec(executeMsg)(wallet, connectedWallet);
}


export const updateServiceInfo = async (
  service_fee: string, dist_percent: string, dist_address: string, admin_address: string,
  wallet: Wallet,
  connectedWallet: ConnectedWallet
) => {
  const executeMsg = [
    new MsgExecuteContract(
      connectedWallet.walletAddress,
      factoryAddress(connectedWallet),
      {
        update_service_info: {
          service_fee, dist_percent, dist_address, admin_address
        }
      }
    )
  ]
  return _exec(executeMsg)(wallet, connectedWallet);
}
