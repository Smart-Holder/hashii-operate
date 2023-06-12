import { BigNumber } from "bignumber.js";
import { Contract as web3Contract } from "web3-eth-contract";

export interface IContractProps extends web3Contract {
	methods: Contract.Methods;
}

export namespace Contract {
	export interface Methods {
		// export function mintUniqueTokenTo(address: string, tokenId: string, str: string, boo: boolean) {}
		// export function encodeABI(): Promise<string> {}
		mintUniqueTokenTo: (address: string, tokenId: string, str: string, boo: boolean) => IMintUniqueTokenToResult;
		ownerOf: (tokenId: BigNumber.Value) => IOwnerOfResult;
		transferFrom: (address: string, walletAddress: string, tokenId: string) => IMintUniqueTokenToResult;
	}

	interface IMintUniqueTokenToResult {
		encodeABI: () => Promise<string>;
	}

	interface IOwnerOfResult {
		call: () => Promise<string>;
	}

	export interface IMintUniqueTokenToProps {
		address: string;
		tokenId: string;
		str: string;
		boo: boolean;
	}
}
