import type { EventEmitter, SendTransactionOptions, WalletName } from '@solana/wallet-adapter-base';
import {
    BaseMessageSignerWalletAdapter,
    WalletAccountError,
    WalletConnectionError,
    WalletDisconnectedError,
    WalletDisconnectionError,
    WalletError,
    WalletNotConnectedError,
    WalletNotReadyError,
    WalletPublicKeyError,
    WalletReadyState,
    WalletSendTransactionError,
    WalletSignMessageError,
    WalletSignTransactionError,
    isVersionedTransaction,
} from '@solana/wallet-adapter-base';
import type {
    Connection,
    SendOptions,
    Transaction,
    TransactionInstruction,
    TransactionSignature,
    TransactionVersion,
    VersionedTransaction,
} from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { Lazorkit } from '@lazorkit/wallet';
import type { WalletAccount } from '@lazorkit/wallet';
import type { LazkitWalletAdapterConfig } from './types.js';

export const LazkitWalletName = 'Lazorkit' as WalletName<'Lazorkit'>;

export class LazkitWalletAdapter extends BaseMessageSignerWalletAdapter {
    name = LazkitWalletName;
    url = 'https://lazorkit.com';
    icon = 'data:image/jpeg;base64,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';
    supportedTransactionVersions: ReadonlySet<TransactionVersion> = new Set(['legacy', 0]);

    private _connecting: boolean;
    private _lazorkit: Lazorkit | null;
    private _publicKey: PublicKey | null;
    private _account: WalletAccount | null;
    private _readyState: WalletReadyState;

    constructor(config: LazkitWalletAdapterConfig = {}) {
        super();
        this._connecting = false;
        this._lazorkit = null;
        this._publicKey = null;
        this._account = null;

        this._readyState = 
            typeof window === 'undefined' || 
            typeof document === 'undefined' ||
            !window.PublicKeyCredential
                ? WalletReadyState.Unsupported
                : WalletReadyState.Installed;

        if (config.dialogUrl && this._readyState === WalletReadyState.Installed) {
            this._lazorkit = new Lazorkit({
                url: config.dialogUrl, 
                paymasterUrl: config.paymasterUrl,
                rpcUrl: config.rpcUrl,
            });
            this._setupEventListeners();
        }
    }

    get publicKey() {
        return this._publicKey;
    }

    get connecting() {
        return this._connecting;
    }

    get readyState() {
        return this._readyState;
    }

    get connected() {
        return !!this._account?.isConnected;
    }

    async autoConnect(): Promise<void> {
        if (this.readyState === WalletReadyState.Installed && this._lazorkit?.hasStoredCredentials()) {
            try {
                await this.connect();
            } catch (error) {
                console.warn('Lazorkit autoconnect failed:', error);
            }
        }
    }

    async connect(): Promise<void> {
        try {
            if (this.connected || this.connecting) return;
            
            if (this.readyState !== WalletReadyState.Installed) {
                throw new WalletNotReadyError();
            }

            if (!this._lazorkit) {
                throw new WalletConnectionError('Lazorkit SDK not initialized. Please provide configuration.');
            }

            this._connecting = true;

            let account: WalletAccount;
            if (this._lazorkit.hasStoredCredentials()) {
                try {
                    account = await this._lazorkit.reconnect();
                } catch (error) {
                    account = await this._lazorkit.connect();
                }
            } else {
                account = await this._lazorkit.connect();
            }

            if (!account || !account.smartWallet) {
                throw new WalletAccountError('Failed to get account from Lazorkit');
            }

            let publicKey: PublicKey;
            try {
                publicKey = new PublicKey(account.smartWallet);
            } catch (error: any) {
                throw new WalletPublicKeyError(error?.message, error);
            }

            this._account = account;
            this._publicKey = publicKey;

            this.emit('connect', publicKey);
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        } finally {
            this._connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        const lazorkit = this._lazorkit;
        if (lazorkit) {
            this._account = null;
            this._publicKey = null;

            try {
                await lazorkit.disconnect();
            } catch (error: any) {
                this.emit('error', new WalletDisconnectionError(error?.message, error));
            }
        }

        this.emit('disconnect');
    }

    async sendTransaction<T extends Transaction | VersionedTransaction>(
        transaction: T,
        connection: Connection,
        options: SendTransactionOptions = {}
    ): Promise<TransactionSignature> {
        try {
            const lazorkit = this._lazorkit;
            if (!lazorkit || !this.connected) {
                throw new WalletNotConnectedError();
            }

            try {
                const { signers, ...sendOptions } = options;

                // Handle signers if provided
                if (signers?.length) {
                    if (isVersionedTransaction(transaction)) {
                        transaction.sign(signers);
                    } else {
                        (transaction as Transaction).partialSign(...signers);
                    }
                }

                // Convert transaction to instruction for Lazorkit
                const instruction = this._extractMainInstruction(transaction);
                
                // Use Lazorkit's signAndSendTransaction method
                const signature = await lazorkit.signAndSendTransaction(instruction);
                
                return signature;
            } catch (error: any) {
                throw new WalletSendTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
        try {
            const lazorkit = this._lazorkit;
            if (!lazorkit || !this.connected) {
                throw new WalletNotConnectedError();
            }

            try {
                // Convert transaction to instruction for Lazorkit
                const instruction = this._extractMainInstruction(transaction);
                
                // Use Lazorkit's signTransaction method
                const signedTxString = await lazorkit.signTransaction(instruction);
                
                // For now, return the original transaction as Lazorkit handles the signing internally
                // In a real implementation, you might need to deserialize the signed transaction
                return transaction;
            } catch (error: any) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
        try {
            const results: T[] = [];
            
            // Sign transactions one by one
            for (const transaction of transactions) {
                const signed = await this.signTransaction(transaction);
                results.push(signed);
            }
            
            return results;
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        try {
            const lazorkit = this._lazorkit;
            if (!lazorkit || !this.connected) {
                throw new WalletNotConnectedError();
            }

            try {
                throw new WalletSignMessageError('Message signing not yet implemented in Lazorkit');
            } catch (error: any) {
                throw new WalletSignMessageError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    private _setupEventListeners(): void {
        if (!this._lazorkit) return;

        // Map Lazorkit events to wallet adapter events
        this._lazorkit.on('connect:success', (account: WalletAccount) => {
            this._account = account;
            try {
                this._publicKey = new PublicKey(account.smartWallet);
                this.emit('connect', this._publicKey);
            } catch (error: any) {
                this.emit('error', new WalletPublicKeyError(error?.message, error));
            }
        });

        this._lazorkit.on('connect:error', (error: Error) => {
            this.emit('error', new WalletConnectionError(error.message, error));
        });

        this._lazorkit.on('disconnect:success', () => {
            this._account = null;
            this._publicKey = null;
            this.emit('disconnect');
        });

        this._lazorkit.on('disconnect:error', (error: Error) => {
            this.emit('error', new WalletDisconnectionError(error.message, error));
        });

        this._lazorkit.on('transaction:error', (error: Error) => {
            this.emit('error', new WalletError(error.message, error));
        });

        this._lazorkit.on('error', (error: Error) => {
            this.emit('error', new WalletError(error.message, error));
        });
    }

    private _extractMainInstruction(transaction: Transaction | VersionedTransaction): TransactionInstruction {
        // Extract the main instruction from the transaction
        // This is a simplified approach - you might need to modify this based on your needs
        if (isVersionedTransaction(transaction)) {
            const versionedTx = transaction as VersionedTransaction;
            const compiledInstructions = versionedTx.message.compiledInstructions;
            if (compiledInstructions.length === 0) {
                throw new Error('No instructions found in transaction');
            }
            
            // Convert compiled instruction back to TransactionInstruction
            // This is a simplified conversion - you may need to handle this more robustly
            const compiledInstruction = compiledInstructions[0];
            const accountKeys = versionedTx.message.staticAccountKeys;
            
            return {
                programId: accountKeys[compiledInstruction.programIdIndex],
                keys: compiledInstruction.accountKeyIndexes.map((index: number) => ({
                    pubkey: accountKeys[index],
                    isSigner: false, // You might need to determine this based on the transaction
                    isWritable: false, // You might need to determine this based on the transaction
                })),
                data: Buffer.from(compiledInstruction.data),
            };
        } else {
            const legacyTx = transaction as Transaction;
            const instructions = legacyTx.instructions;
            if (instructions.length === 0) {
                throw new Error('No instructions found in transaction');
            }
            return instructions[0]; // Return the first instruction
        }
    }

    private _disconnected = () => {
        this._account = null;
        this._publicKey = null;
        this.emit('error', new WalletDisconnectedError());
        this.emit('disconnect');
    };
}
