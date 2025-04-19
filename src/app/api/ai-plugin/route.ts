import { ACCOUNT_ID, PLUGIN_URL } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Morpho Labs API",
            description: "API for interacting with Morpho Labs Vaults and Markets on Ethereum",
            version: "1.0.0",
        },
        servers: [
            {
                url: 'https://morpho-agent.vercel.app',
            },
        ],
        "x-mb": {
            "account-id": '0x58754047b0D25ffB23F05D5fc6dD9ccE1d5ACC58',
            assistant: {
                name: "Morpho Assistant",
                description: "An assistant that allows interaction with Morpho Labs Vaults and Markets on Ethereum, providing deposit, withdrawal, loan, metrics query, and more functionality.",
                instructions: `
                This assistant facilitates interactions with Morpho Labs protocol. It adheres to the following strict protocol:

NETWORKS:
- Supports Ethereum (chainId: 1), Arbitrum (chainId: 42161), and Base (chainId: 8453)
- NEVER claims to support any other networks
- ALWAYS requires explicit chainId specification from the user
- NEVER infers chainId values
- ALWAYS validates network compatibility before proceeding

VAULT OPERATIONS:
- ALWAYS validates vault addresses before processing transactions
- ALWAYS confirms token details explicitly before executing transactions
- ALWAYS uses the correct token decimals for amount calculations
- ALWAYS provides clear descriptions of vault operations

MARKET OPERATIONS:
- ALWAYS validates market parameters (loanToken, collateralToken, oracle, irm, lltv)
- ALWAYS confirms collateral ratios and liquidation thresholds
- ALWAYS provides clear descriptions of market operations
- ALWAYS uses the correct token decimals for amount calculations

TRANSACTION PROCESSING:
- ALWAYS passes the transaction fields to generate-evm-tx tool for signing
- ALWAYS displays meta content to user after signing
- ALWAYS provides clear transaction descriptions
- ALWAYS validates transaction parameters before execution

DATA QUERIES:
- ALWAYS provides accurate APY calculations
- ALWAYS includes both raw and USD values where applicable
- ALWAYS includes relevant token information
- ALWAYS provides clear position summaries

This assistant follows these specifications with zero deviation to ensure secure, predictable protocol interactions.`,
                tools: [{ type: "generate-evm-tx" }, { type: "sign-message" }],
                image: `https://morpho-agent.vercel.app/logo.png`,
                categories: ["defi", "lending"],
                chainIds: [1, 42161, 8453]
            },
            image: `https://morpho-agent.vercel.app/logo.png`
        },
        paths: {
            // Endpoints for Morpho Vaults (Earn)
            "/api/tools/morpho/earn/deposit": {
                get: {
                    operationId: "morphoEarnDeposit",
                    summary: "Generate payload for deposit in Morpho vault",
                    description: "Generates a transaction payload to deposit tokens in a Morpho vault",
                    parameters: [
                        {
                            name: "vaultAddress",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Morpho vault address"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Amount of tokens to deposit"
                        },
                        {
                            name: "receiver",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Recipient address (optional)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    transactionPayload: {
                                                        type: "object",
                                                        properties: {
                                                            to: {
                                                                type: "string",
                                                                description: "Target contract address"
                                                            },
                                                            value: {
                                                                type: "string",
                                                                description: "Value in ETH to be sent"
                                                            },
                                                            data: {
                                                                type: "string",
                                                                description: "Transaction data (calldata)"
                                                            }
                                                        }
                                                    },
                                                    description: {
                                                        type: "string",
                                                        description: "Transaction description"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/earn/withdraw": {
                get: {
                    operationId: "morphoEarnWithdraw",
                    summary: "Generate payload for withdrawal from Morpho vault",
                    description: "Generates a transaction payload to withdraw tokens from a Morpho vault",
                    parameters: [
                        {
                            name: "vaultAddress",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Morpho vault address"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Amount of tokens to withdraw (either amount or shares must be provided)"
                        },
                        {
                            name: "shares",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Amount of shares to redeem (either amount or shares must be provided)"
                        },
                        {
                            name: "receiver",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Recipient address (optional)"
                        },
                        {
                            name: "owner",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Owner address (optional)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    transactionPayload: {
                                                        type: "object",
                                                        properties: {
                                                            to: {
                                                                type: "string",
                                                                description: "Target contract address"
                                                            },
                                                            value: {
                                                                type: "string",
                                                                description: "Value in ETH to be sent"
                                                            },
                                                            data: {
                                                                type: "string",
                                                                description: "Transaction data (calldata)"
                                                            }
                                                        }
                                                    },
                                                    description: {
                                                        type: "string",
                                                        description: "Transaction description"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/earn/claim-rewards": {
                get: {
                    operationId: "morphoEarnClaimRewards",
                    summary: "Generate payload for claiming rewards",
                    description: "Generates a transaction payload to claim rewards from Morpho vaults",
                    parameters: [
                        {
                            name: "urdAddress",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Universal Rewards Distributor address"
                        },
                        {
                            name: "account",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Account address"
                        },
                        {
                            name: "claimable",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Claimable amount"
                        },
                        {
                            name: "proof",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Merkle proof (JSON array of hexadecimal strings)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    transactionPayload: {
                                                        type: "object",
                                                        properties: {
                                                            to: {
                                                                type: "string",
                                                                description: "Target contract address"
                                                            },
                                                            value: {
                                                                type: "string",
                                                                description: "Value in ETH to be sent"
                                                            },
                                                            data: {
                                                                type: "string",
                                                                description: "Transaction data (calldata)"
                                                            }
                                                        }
                                                    },
                                                    description: {
                                                        type: "string",
                                                        description: "Transaction description"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/earn/get-vaults": {
                get: {
                    operationId: "morphoEarnGetVaults",
                    summary: "List available vaults",
                    description: "Returns a list of available Morpho vaults",
                    parameters: [
                        {
                            name: "first",
                            in: "query",
                            required: false,
                            schema: {
                                type: "integer"
                            },
                            description: "Number of results to return"
                        },
                        {
                            name: "orderBy",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Field to order by"
                        },
                        {
                            name: "orderDirection",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["asc", "desc"]
                            },
                            description: "Order direction"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    vaults: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                address: {
                                                                    type: "string",
                                                                    description: "Vault address"
                                                                },
                                                                symbol: {
                                                                    type: "string",
                                                                    description: "Vault symbol"
                                                                },
                                                                name: {
                                                                    type: "string",
                                                                    description: "Vault name"
                                                                },
                                                                whitelisted: {
                                                                    type: "boolean",
                                                                    description: "Indicates if the vault is whitelisted"
                                                                },
                                                                asset: {
                                                                    type: "object",
                                                                    properties: {
                                                                        address: {
                                                                            type: "string",
                                                                            description: "Asset token address"
                                                                        },
                                                                        decimals: {
                                                                            type: "integer",
                                                                            description: "Asset token decimals"
                                                                        }
                                                                    }
                                                                },
                                                                chain: {
                                                                    type: "string",
                                                                    description: "Blockchain network"
                                                                }
                                                            }
                                                        }
                                                    },
                                                    count: {
                                                        type: "integer",
                                                        description: "Total number of vaults returned"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            // Endpoints for Morpho Markets (Borrow)
            "/api/tools/morpho/borrow/supply-collateral": {
                get: {
                    operationId: "morphoBorrowSupplyCollateral",
                    summary: "Generate payload for supplying collateral",
                    description: "Generates a transaction payload to supply collateral in a Morpho market",
                    parameters: [
                        {
                            name: "morphoAddress",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Morpho contract address"
                        },
                        {
                            name: "loanToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Loan token address"
                        },
                        {
                            name: "collateralToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Collateral token address"
                        },
                        {
                            name: "oracle",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Oracle address"
                        },
                        {
                            name: "irm",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Interest rate model address"
                        },
                        {
                            name: "lltv",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Liquidation loan-to-value ratio"
                        },
                        {
                            name: "assets",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Amount of tokens to supply as collateral"
                        },
                        {
                            name: "onBehalf",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Address to supply on behalf of (optional)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    transactionPayload: {
                                                        type: "object",
                                                        properties: {
                                                            to: {
                                                                type: "string",
                                                                description: "Target contract address"
                                                            },
                                                            value: {
                                                                type: "string",
                                                                description: "Value in ETH to be sent"
                                                            },
                                                            data: {
                                                                type: "string",
                                                                description: "Transaction data (calldata)"
                                                            }
                                                        }
                                                    },
                                                    description: {
                                                        type: "string",
                                                        description: "Transaction description"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/borrow/borrow": {
                get: {
                    operationId: "morphoBorrowBorrow",
                    summary: "Generate payload for borrowing",
                    description: "Generates a transaction payload to borrow from a Morpho market",
                    parameters: [
                        {
                            name: "morphoAddress",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Morpho contract address"
                        },
                        {
                            name: "loanToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Loan token address"
                        },
                        {
                            name: "collateralToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Collateral token address"
                        },
                        {
                            name: "oracle",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Oracle address"
                        },
                        {
                            name: "irm",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Interest rate model address"
                        },
                        {
                            name: "lltv",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Liquidation loan-to-value ratio"
                        },
                        {
                            name: "assets",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Amount of tokens to borrow"
                        },
                        {
                            name: "receiver",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Recipient address"
                        },
                        {
                            name: "onBehalf",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Address to borrow on behalf of (optional)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    transactionPayload: {
                                                        type: "object",
                                                        properties: {
                                                            to: {
                                                                type: "string",
                                                                description: "Target contract address"
                                                            },
                                                            value: {
                                                                type: "string",
                                                                description: "Value in ETH to be sent"
                                                            },
                                                            data: {
                                                                type: "string",
                                                                description: "Transaction data (calldata)"
                                                            }
                                                        }
                                                    },
                                                    description: {
                                                        type: "string",
                                                        description: "Transaction description"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/borrow/repay": {
                get: {
                    operationId: "morphoBorrowRepay",
                    summary: "Generate payload for repaying loan",
                    description: "Generates a transaction payload to repay a loan in a Morpho market",
                    parameters: [
                        {
                            name: "morphoAddress",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Morpho contract address"
                        },
                        {
                            name: "loanToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Loan token address"
                        },
                        {
                            name: "collateralToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Collateral token address"
                        },
                        {
                            name: "oracle",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Oracle address"
                        },
                        {
                            name: "irm",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Interest rate model address"
                        },
                        {
                            name: "lltv",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Liquidation loan-to-value ratio"
                        },
                        {
                            name: "assets",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Amount of tokens to repay"
                        },
                        {
                            name: "onBehalf",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Address to repay on behalf of (optional)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    transactionPayload: {
                                                        type: "object",
                                                        properties: {
                                                            to: {
                                                                type: "string",
                                                                description: "Target contract address"
                                                            },
                                                            value: {
                                                                type: "string",
                                                                description: "Value in ETH to be sent"
                                                            },
                                                            data: {
                                                                type: "string",
                                                                description: "Transaction data (calldata)"
                                                            }
                                                        }
                                                    },
                                                    description: {
                                                        type: "string",
                                                        description: "Transaction description"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/borrow/withdraw-collateral": {
                get: {
                    operationId: "morphoBorrowWithdrawCollateral",
                    summary: "Generate payload for withdrawing collateral",
                    description: "Generates a transaction payload to withdraw collateral from a Morpho market",
                    parameters: [
                        {
                            name: "morphoAddress",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Morpho contract address"
                        },
                        {
                            name: "loanToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Loan token address"
                        },
                        {
                            name: "collateralToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Collateral token address"
                        },
                        {
                            name: "oracle",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Oracle address"
                        },
                        {
                            name: "irm",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Interest rate model address"
                        },
                        {
                            name: "lltv",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Liquidation loan-to-value ratio"
                        },
                        {
                            name: "assets",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Amount of tokens to withdraw"
                        },
                        {
                            name: "receiver",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Recipient address"
                        },
                        {
                            name: "onBehalf",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Address to withdraw on behalf of (optional)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    transactionPayload: {
                                                        type: "object",
                                                        properties: {
                                                            to: {
                                                                type: "string",
                                                                description: "Target contract address"
                                                            },
                                                            value: {
                                                                type: "string",
                                                                description: "Value in ETH to be sent"
                                                            },
                                                            data: {
                                                                type: "string",
                                                                description: "Transaction data (calldata)"
                                                            }
                                                        }
                                                    },
                                                    description: {
                                                        type: "string",
                                                        description: "Transaction description"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/borrow/get-markets": {
                get: {
                    operationId: "morphoBorrowGetMarkets",
                    summary: "List available markets",
                    description: "Returns a list of available Morpho markets",
                    parameters: [
                        {
                            name: "first",
                            in: "query",
                            required: false,
                            schema: {
                                type: "integer"
                            },
                            description: "Number of results to return"
                        },
                        {
                            name: "orderBy",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Field to order by"
                        },
                        {
                            name: "orderDirection",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["asc", "desc"]
                            },
                            description: "Order direction"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    markets: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                id: {
                                                                    type: "string",
                                                                    description: "Market ID"
                                                                },
                                                                loanToken: {
                                                                    type: "object",
                                                                    properties: {
                                                                        address: {
                                                                            type: "string",
                                                                            description: "Loan token address"
                                                                        },
                                                                        symbol: {
                                                                            type: "string",
                                                                            description: "Loan token symbol"
                                                                        },
                                                                        decimals: {
                                                                            type: "integer",
                                                                            description: "Loan token decimals"
                                                                        }
                                                                    }
                                                                },
                                                                collateralToken: {
                                                                    type: "object",
                                                                    properties: {
                                                                        address: {
                                                                            type: "string",
                                                                            description: "Collateral token address"
                                                                        },
                                                                        symbol: {
                                                                            type: "string",
                                                                            description: "Collateral token symbol"
                                                                        },
                                                                        decimals: {
                                                                            type: "integer",
                                                                            description: "Collateral token decimals"
                                                                        }
                                                                    }
                                                                },
                                                                oracle: {
                                                                    type: "string",
                                                                    description: "Oracle address"
                                                                },
                                                                irm: {
                                                                    type: "string",
                                                                    description: "Interest rate model address"
                                                                },
                                                                lltv: {
                                                                    type: "string",
                                                                    description: "Liquidation loan-to-value ratio"
                                                                }
                                                            }
                                                        }
                                                    },
                                                    count: {
                                                        type: "integer",
                                                        description: "Total number of markets returned"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            // Endpoints for data queries
            "/api/tools/morpho/data/get-apy": {
                get: {
                    operationId: "morphoDataGetApy",
                    summary: "Query APYs",
                    description: "Returns APYs for vaults or markets",
                    parameters: [
                        {
                            name: "vaultAddress",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Vault address (optional)"
                        },
                        {
                            name: "marketId",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Market ID (optional)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                description: "APY data (format varies depending on parameters)"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "404": {
                            description: "Not found",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/data/get-user-positions": {
                get: {
                    operationId: "morphoDataGetUserPositions",
                    summary: "Query user positions",
                    description: "Returns a user's positions in vaults and markets",
                    parameters: [
                        {
                            name: "userAddress",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "User address"
                        },
                        {
                            name: "type",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                enum: ["earn", "borrow", "all"]
                            },
                            description: "Position type (earn, borrow, or all)"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    earnPositions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "Position type (earn)"
                                                                },
                                                                address: {
                                                                    type: "string",
                                                                    description: "Vault address"
                                                                },
                                                                symbol: {
                                                                    type: "string",
                                                                    description: "Vault symbol"
                                                                },
                                                                assetSymbol: {
                                                                    type: "string",
                                                                    description: "Asset symbol"
                                                                },
                                                                assets: {
                                                                    type: "string",
                                                                    description: "Amount of tokens"
                                                                },
                                                                assetsUsd: {
                                                                    type: "string",
                                                                    description: "Value in USD"
                                                                },
                                                                shares: {
                                                                    type: "string",
                                                                    description: "Amount of shares"
                                                                }
                                                            }
                                                        }
                                                    },
                                                    borrowPositions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "Position type (borrow)"
                                                                },
                                                                marketId: {
                                                                    type: "string",
                                                                    description: "Market ID"
                                                                },
                                                                loanToken: {
                                                                    type: "object",
                                                                    properties: {
                                                                        address: {
                                                                            type: "string",
                                                                            description: "Loan token address"
                                                                        },
                                                                        symbol: {
                                                                            type: "string",
                                                                            description: "Loan token symbol"
                                                                        }
                                                                    }
                                                                },
                                                                collateralToken: {
                                                                    type: "object",
                                                                    properties: {
                                                                        address: {
                                                                            type: "string",
                                                                            description: "Collateral token address"
                                                                        },
                                                                        symbol: {
                                                                            type: "string",
                                                                            description: "Collateral token symbol"
                                                                        }
                                                                    }
                                                                },
                                                                borrowed: {
                                                                    type: "string",
                                                                    description: "Borrowed amount"
                                                                },
                                                                borrowedUsd: {
                                                                    type: "string",
                                                                    description: "Borrowed value in USD"
                                                                },
                                                                collateral: {
                                                                    type: "string",
                                                                    description: "Collateral amount"
                                                                },
                                                                collateralUsd: {
                                                                    type: "string",
                                                                    description: "Collateral value in USD"
                                                                }
                                                            }
                                                        }
                                                    },
                                                    totalPositions: {
                                                        type: "integer",
                                                        description: "Total number of positions"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/data/get-vault-metrics": {
                get: {
                    operationId: "morphoDataGetVaultMetrics",
                    summary: "Query vault metrics",
                    description: "Returns detailed metrics for a specific vault",
                    parameters: [
                        {
                            name: "vaultAddress",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Vault address"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    address: {
                                                        type: "string",
                                                        description: "Vault address"
                                                    },
                                                    symbol: {
                                                        type: "string",
                                                        description: "Vault symbol"
                                                    },
                                                    name: {
                                                        type: "string",
                                                        description: "Vault name"
                                                    },
                                                    totalAssets: {
                                                        type: "string",
                                                        description: "Total assets"
                                                    },
                                                    totalAssetsUsd: {
                                                        type: "string",
                                                        description: "Total assets in USD"
                                                    },
                                                    totalSupply: {
                                                        type: "string",
                                                        description: "Total supply"
                                                    },
                                                    apy: {
                                                        type: "string",
                                                        description: "APY"
                                                    },
                                                    netApy: {
                                                        type: "string",
                                                        description: "Net APY"
                                                    },
                                                    netApyWithoutRewards: {
                                                        type: "string",
                                                        description: "Net APY without rewards"
                                                    },
                                                    dailyApy: {
                                                        type: "string",
                                                        description: "Daily APY"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "404": {
                            description: "Not found",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/morpho/data/get-market-metrics": {
                get: {
                    operationId: "morphoDataGetMarketMetrics",
                    summary: "Query market metrics",
                    description: "Returns detailed metrics for a specific market",
                    parameters: [
                        {
                            name: "marketId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "Market ID"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    loanToken: {
                                                        type: "string",
                                                        description: "Loan token address"
                                                    },
                                                    collateralToken: {
                                                        type: "string",
                                                        description: "Collateral token address"
                                                    },
                                                    totalBorrowed: {
                                                        type: "string",
                                                        description: "Total borrowed"
                                                    },
                                                    totalBorrowedUsd: {
                                                        type: "string",
                                                        description: "Total borrowed in USD"
                                                    },
                                                    totalCollateral: {
                                                        type: "string",
                                                        description: "Total collateral"
                                                    },
                                                    totalCollateralUsd: {
                                                        type: "string",
                                                        description: "Total collateral in USD"
                                                    },
                                                    borrowRate: {
                                                        type: "string",
                                                        description: "Borrow rate"
                                                    },
                                                    utilizationRate: {
                                                        type: "string",
                                                        description: "Utilization rate"
                                                    },
                                                    lltv: {
                                                        type: "string",
                                                        description: "Liquidation loan-to-value ratio"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Invalid request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "404": {
                            description: "Not found",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Internal error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                description: "Indicates if the operation was successful"
                                            },
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    return NextResponse.json(pluginData);
}
