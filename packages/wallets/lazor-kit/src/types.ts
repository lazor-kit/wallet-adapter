import type { WalletName } from '@solana/wallet-adapter-base';

export const LazkitWalletName = 'Lazorkit' as WalletName<'Lazorkit'>;

export interface LazkitWalletAdapterConfig {
    /**
     * URL of the Lazorkit dialog/portal for wallet interactions
     */
    dialogUrl?: string;
    
    /**
     * Optional paymaster URL for gasless transactions
     */
    paymasterUrl?: string;
    
    /**
     * RPC URL for Solana network connection
     */
    rpcUrl?: string;
    
    /**
     * Dialog mode for wallet interactions
     * @default 'auto'
     */
    dialogMode?: 'iframe' | 'popup' | 'auto';
    
    /**
     * Timeout for wallet operations in milliseconds
     * @default 30000
     */
    timeout?: number;
    
    /**
     * Enable debug logging
     * @default false
     */
    debug?: boolean;
    
    /**
     * Mobile-specific configuration
     */
    mobile?: {
        /**
         * URL scheme for mobile deep linking
         */
        scheme?: string;
        
        /**
         * Android package name for deep linking
         */
        androidPackage?: string;
        
        /**
         * iOS bundle ID for deep linking
         */
        iosBundleId?: string;
    };
}

/**
 * Events emitted by the Lazorkit wallet adapter
 */
export interface LazkitWalletEvents {
    connect(...args: unknown[]): unknown;
    disconnect(...args: unknown[]): unknown;
    accountChanged(...args: unknown[]): unknown;
    error(error: Error): unknown;
}

/**
 * Configuration for passkey creation and management
 */
export interface PasskeyConfig {
    /**
     * Relying Party (RP) identifier - typically your domain
     */
    rpId?: string;
    
    /**
     * Human-readable name for the relying party
     */
    rpName?: string;
    
    /**
     * User display name for passkey creation
     */
    userDisplayName?: string;
    
    /**
     * Timeout for passkey operations
     */
    timeout?: number;
    
    /**
     * Preferred authenticator attachment
     */
    authenticatorAttachment?: 'platform' | 'cross-platform';
    
    /**
     * User verification requirement
     */
    userVerification?: 'required' | 'preferred' | 'discouraged';
}

/**
 * Smart wallet configuration options
 */
export interface SmartWalletOptions {
    /**
     * Custom program ID for smart wallet
     */
    programId?: string;
    
    /**
     * Authority public key for smart wallet operations
     */
    authority?: string;
    
    /**
     * Enable account abstraction features
     */
    enableAccountAbstraction?: boolean;
    
    /**
     * Gas sponsorship configuration
     */
    gasSponsorship?: {
        enabled: boolean;
        maxAmount?: number;
        whitelist?: string[];
    };
}

/**
 * Complete configuration for the Lazorkit wallet adapter
 */
export interface LazkitAdapterOptions extends LazkitWalletAdapterConfig {
    /**
     * Passkey-specific configuration
     */
    passkey?: PasskeyConfig;
    
    /**
     * Smart wallet configuration
     */
    smartWallet?: SmartWalletOptions;
    
    /**
     * Auto-connect behavior
     */
    autoConnect?: boolean;
    
    /**
     * Theme preference for wallet UI
     */
    theme?: 'light' | 'dark' | 'auto';
    
    /**
     * Locale for wallet UI
     */
    locale?: string;
}
