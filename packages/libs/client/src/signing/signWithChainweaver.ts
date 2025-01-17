import { IPactCommand } from '../interfaces/IPactCommand';
import { IUnsignedTransaction } from '../interfaces/IUnsignedTransaction';
import { ICommandBuilder } from '../pact';

import fetch from 'cross-fetch';
import type { Debugger } from 'debug';
import _debug from 'debug';

/**
 * @alpha
 */
export type IChainweaverSig = string;

/**
 * @alpha
 */
export interface IChainweaverSignedCommand {
  sigs: { [pubkey: string]: IChainweaverSig };
  cmd: string;
}

/**
 * @alpha
 */
export interface IChainweaverQuickSignRequestBody {
  reqs: IUnsignedTransaction[];
}

const debug: Debugger = _debug('pactjs:signWithChainweaver');

/**
 * @alpha
 */
export async function signWithChainweaver<T1 extends string, T2>(
  ...transactions: (IPactCommand & ICommandBuilder<Record<T1, T2>>)[]
): Promise<(IPactCommand & ICommandBuilder<Record<T1, T2>>)[]> {
  const quickSignRequest: IChainweaverQuickSignRequestBody = {
    reqs: transactions.map((t) => {
      const command = t.createCommand();
      return {
        cmd: command.cmd,
        hash: command.hash,
        sigs: t.signers.reduce((sigsObject, signer, i) => {
          const sig = t.sigs[i]?.sig;
          sigsObject[signer.pubKey] = sig === undefined ? null : sig;
          return sigsObject;
        }, {} as Record<string, string | null>),
      };
    }),
  };
  const body: string = JSON.stringify(quickSignRequest);

  debug('calling sign api:', body);

  const response = await fetch('http://127.0.0.1:9467/v1/quickSign', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });

  const bodyText = await response.text();

  // response is not JSON when not-ok, that's why we use try-catch
  try {
    const result = JSON.parse(bodyText) as {
      results: IChainweaverSignedCommand[];
    };
    result.results.map((signedCommand, i) => {
      transactions[i].addSignatures(
        ...Object.keys(signedCommand.sigs).reduce(
          (sigs, pubkey) => {
            const sig = signedCommand.sigs[pubkey];
            sigs.push({ pubkey, sig });
            return sigs;
          },
          [] as {
            pubkey: string;
            sig: string;
          }[],
        ),
      );
    });
    return transactions;
  } catch (error) {
    throw new Error(
      'An error occurred when adding signatures to the command' +
        `\nResponse from v1/quickSign was \`${bodyText}\`. ` +
        `\nCode: \`${response.status}\`` +
        `\nText: \`${response.statusText}\` ` +
        `${error}`,
    );
  }
}
