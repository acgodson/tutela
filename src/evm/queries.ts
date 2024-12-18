import {
  TransactionRecordQuery,
  TokenInfoQuery,
  AccountBalanceQuery,
  EntityIdHelper,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";
import axios from "axios";
import { keccak256, toHex } from "viem";

export async function txRecQueryFcn(txId: any, client: any) {
  const recQuery = await new TransactionRecordQuery()
    .setTransactionId(txId)
    .setIncludeChildren(true)
    .execute(client);
  return recQuery;
}

export async function tokenQueryFcn(tkId: any, client: any) {
  let info = await new TokenInfoQuery().setTokenId(tkId).execute(client);
  return info;
}

export async function balanceCheckerFcn(acId: any, tkId: any, client: any) {
  let balanceCheckTx: any = [];
  try {
    balanceCheckTx = await new AccountBalanceQuery()
      .setAccountId(acId)
      .execute(client);
    console.log(
      `- Balance of account ${acId}: ${balanceCheckTx.hbars.toString()} + ${balanceCheckTx.tokens._map.get(
        tkId.toString()
      )} unit(s) of token ${tkId}`
    );
  } catch {
    balanceCheckTx = await new AccountBalanceQuery()
      .setContractId(acId)
      .execute(client);
    console.log(
      `- Balance of contract ${acId}: ${balanceCheckTx.hbars.toString()} + ${balanceCheckTx.tokens._map.get(
        tkId.toString()
      )} unit(s) of token ${tkId}`
    );
  }
}

export function convert(hederaNativeAddress: string) {
  const { shard, realm, num } = EntityIdHelper.fromString(hederaNativeAddress);
  return EntityIdHelper.toSolidityAddress([shard, realm, num]);
}

export async function getContractIdFromEvmAddress(evmAddress: string) {
  const baseUrl = "https://testnet.mirrornode.hedera.com/api/v1/contracts";
  const url = `${baseUrl}/${evmAddress}`;

  try {
    const response = await fetch(url);

    // Handle any non-200 HTTP responses
    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    // Check if the contract_id is available in the response
    if (data.contract_id) {
      return data.contract_id;
    } else {
      throw new Error("Contract ID not found in the response");
    }
  } catch (error: any) {
    console.error("Failed to fetch contract ID:", error.message);
    return null;
  }
}

export async function getAccountIdFromEvmAddress(evmAddress: string) {
  const baseUrl = "https://testnet.mirrornode.hedera.com/api/v1/accounts";
  const url = `${baseUrl}/${evmAddress}`;

  try {
    const response = await fetch(url);

    // Handle any non-200 HTTP responses
    if (!response.ok) {
      throw new Error(
        `Error fetching data: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    // Check if the contract_id is available in the response
    if (data.account) {
      return data.account;
    } else {
      throw new Error("Contract ID not found in the response");
    }
  } catch (error: any) {
    console.error("Failed to fetch contract ID:", error.message);
    return null;
  }
}

export async function transferFtFcn(
  tId: any,
  senderId: any,
  receiverId: any,
  amount: any,
  senderKey: any,
  client: any
) {
  const tokenTransferTx = new TransferTransaction()
    .addTokenTransfer(tId, senderId, amount * -1)
    .addTokenTransfer(tId, receiverId, amount)
    .freezeWith(client);
  const tokenTransferSign = await tokenTransferTx.sign(senderKey);

  const tokenTransferSubmit = await tokenTransferSign.execute(client);
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

  return [tokenTransferRx, tokenTransferTx];
}

export async function trfHBar(senderId: any, senderKey: any, client: any) {
  // Verify the account balance
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(senderId)
    .execute(client);

  console.log(
    "\nNew account balance is: " +
      accountBalance.hbars.toTinybars() +
      " tinybars."
  );

  //Transfer HBAR
  const sendHbarTx = await new TransferTransaction()
    .addHbarTransfer(senderId, Hbar.fromTinybars(-10_000_000_000))
    .addHbarTransfer("0.0.4704575", Hbar.fromTinybars(10_000_000_000)) //Receiving account
    .execute(client);

  // Verify the transaction reached consensus
  const transactionReceipt = await sendHbarTx.getReceipt(client);
  console.log(
    "\nThe transfer transaction from my account to the new account was: " +
      transactionReceipt.status.toString()
  );

  await new Promise((resolve) => setTimeout(resolve, 4000));

  return [transactionReceipt.status.toString()];
}

