import './ConnectWallet.scss';
import { Button } from '@mui/material';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';

export function ConnectWallet() {
  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    disconnect,
  } = useWallet()

  return (
    <div>
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <>
          {availableInstallTypes.map((connectType) => (
            <Button key={`install-${connectType}`}
              onClick={() => install(connectType)}>
              Install {connectType}
            </Button>
          ))}
          {availableConnectTypes.map((connectType) => (
            <Button key={`connect-${connectType}`}
              onClick={() => connect(connectType)}>
              Connect {connectType}
            </Button>
          ))}
        </>
      )}
      {status === WalletStatus.WALLET_CONNECTED && (
        <Button onClick={() => disconnect()}>
          Disconnect
        </Button>
      )}
    </div>
  )
}
