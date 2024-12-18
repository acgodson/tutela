export const networks = [
  { id: 'base', name: 'Base Sepolia', chainId: '0x14a34', nativeCurrency: 'ETH' },
  // { id: 'sepolia', name: 'Sepolia', chainId: '0xaa36a7', nativeCurrency: 'ETH' },
  // { id: 'optimism', name: 'Optimism Sepolia', chainId: '0xaa37dc', nativeCurrency: 'ETH' },
  // { id: 'avalanche', name: 'Avalanche Fuji Testnet', chainId: '0xa869', nativeCurrency: 'AVAX' },
];

export type SupportedNetworks = 1 | 2;

export interface NetworkConfig {
  description: string;
  chainSelector: string;
  rpc: string;
  routerAddress: string;
  linkTokenAddress: string;
  wrappedNativeAddress: string;
  ccipBnMAddress: string;
  ccipLnMAddress: string;
  faucetAddress?: string;
}

export const networkConfigs: { [key in SupportedNetworks]: NetworkConfig } = {
  1: {
    description: 'Ethereum Sepolia Testnet',
    chainSelector: '16015286601757825753',
    rpc: 'https://eth-sepolia.g.alchemy.com/v2/PB4BbHeft6sndMHQG464LiXM1jl4n29m',
    routerAddress: '0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59',
    linkTokenAddress: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    wrappedNativeAddress: '0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534',
    ccipBnMAddress: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05',
    ccipLnMAddress: '0x466D489b6d36E7E3b824ef491C225F5830E81cC1',
  },
  2: {
    description: 'Avalanche Fuji Testnet',
    chainSelector: '14767482510784806043',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    routerAddress: '0xF694E193200268f9a4868e4Aa017A0118C9a8177',
    linkTokenAddress: '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846',
    wrappedNativeAddress: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    ccipBnMAddress: '0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4',
    ccipLnMAddress: '0x70F5c5C40b873EA597776DA2C21929A8282A3b35',
  },
};

export function getDummyTokensFromNetwork(network: SupportedNetworks): {
  ccipBnM: string;
  ccipLnM: string;
} {
  const config = networkConfigs[network];
  return { ccipBnM: config.ccipBnMAddress, ccipLnM: config.ccipLnMAddress };
}
