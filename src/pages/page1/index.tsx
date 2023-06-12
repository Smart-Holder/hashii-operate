import { Row, Col, Input } from "antd";
import WalletConnect from "@walletconnect/client";
import { useState } from "react";
import { convertUtf8ToHex } from "@walletconnect/utils";
import WalletConnectProvider from "@walletconnect/web3-provider";
import "./index.scss";
import React from "react";
import { getChainData, sanitizeHex } from "../../helpers/utilities";
// import ERC20Icon from "../..assets/ERC20Icon";
import { convertAmountFromRawNumber, convertStringToHex } from "../../helpers/bignumber";
import { providers } from "ethers";
import { IConnector } from "@walletconnect/types";
import Web3 from "web3";
import abi from "../../helpers/abi";
import { v4 } from "uuid";
import * as ethUtil from "ethereumjs-util";
import BigNumber from "bignumber.js";
import topholderBytecode from "../../helpers/topholder.bytecode";
import Button from "../../components/button/index";
import { IContractProps } from "./interface";
interface ITxOptionProps {
	from: string;
	to: string;
	nonce: string | number;
	gasPrice: string | number;
	gasLimit: string;
	value: string;
	data: string;
	gas?: number | string;
}
const METIS_TEST_ERC721 = "0x15725fd34d1a984b95aee7a66ad06b9c297e99b9"; // 合约地址
const METIS_ERC721 = "0xFDa242143f172D1ad549c4bbF21F0A20b196060B";
const GOERLI_ERC721 = "0x8D66056FF0984832b9790A05618c21801C723951";

const contractAddress: { [key: number]: string } = {
	588: METIS_TEST_ERC721,
	1088: METIS_ERC721,
	5: GOERLI_ERC721,
};

type IGetData = "transferFrom" | "deploy" | "mintUniqueTokenTo";

const Page1 = () => {
	const [connector, setconnector] = useState<WalletConnect | IConnector>();
	const [providerConnector, setproviderConnector] = useState<IConnector>();
	const [chainId, setchainId] = useState<number>(0);
	const [address, setaddress] = useState<string>("");
	const [provider, setprovider] = useState<WalletConnectProvider>();
	const [web3Provider, setweb3Provider] = useState<providers.Web3Provider>();
	const [balance, setbalance] = useState<number | string>();

	const [tokenId, settokenId] = useState<string>("");
	const [walletAddress, setwalletAddress] = useState<string>("");
	const connect2 = async () => {
		// let rpc = SUPPORTED_CHAINS.map(item => {
		// 	return { [item.chain_id]: item.rpc_url }
		// });

		// const rpc: any = SUPPORTED_CHAINS.reduce((pre, cur) => {
		// 	return { ...pre, [cur.chain_id]: cur.rpc_url }
		// });
		// aeefe756fb024b8d834e3db679a678f7
		//  Create WalletConnect Provider
		const provider: WalletConnectProvider = new WalletConnectProvider({
			// rpc,
			rpc: {
				// 5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
				// 1: "https://mainnet.infura.io/v3/aeefe756fb024b8d834e3db679a678f7",
				1088: "https://andromeda.metis.io/?owner=1088",
				588: "https://stardust.metis.io/?owner=588",
			},

			// rpcUrl:'asdasd',
			infuraId: "aeefe756fb024b8d834e3db679a678f7",
			// qrcode: false
		});

		setprovider(provider);
		//  Wrap with Web3Provider from ethers.js
		const web3Provider = new providers.Web3Provider(provider);
		//  Enable session (triggers QR Code modal)

		console.log(provider, "provider");
		// Subscribe to chainId change
		provider.on("chainChanged", (chainId: number) => {
			console.log(chainId, "chainChanged");
		});

		provider.connector.on("connect", (error, payload) => {
			console.log(`connector.on("connect")`, payload, "payload");
		});

		// Subscribe to accounts change
		provider.on("accountsChanged", (accounts: string[]) => {
			console.log(accounts, "accountsChanged");
		});

		provider.connector.on("display_uri", () => {
			console.log("display_uridisplay_uridisplay_uridisplay_uri");
		});

		// Subscribe to session disconnection
		provider.on("disconnect", (code: number, reason: string) => {
			console.log(code, reason, "disconnect");
			onDisconnect();
		});

		await provider.enable();

		const accounts = provider.accounts[0];
		setchainId(provider.chainId);
		setaddress(accounts);
		setproviderConnector(provider.connector);
		setconnector(provider.connector);
		const balance = await web3Provider.getBalance(provider.accounts[0]);

		setbalance(convertAmountFromRawNumber(String(balance) || 0));
		// const data = await web3Provider.getTransactionCount(accounts);
		// console.log(handleSignificantDecimals(convertAmountFromRawNumber(String(data) || 0, 18), 8), convertAmountFromRawNumber(String(data) || 0));
		// console.log(Number(data) / Math.pow(10, 18));
		// const gasPrices = await web3Provider?.getGasPrice();
		// console.log(gasPrices, 'gasPrices');

		setweb3Provider(web3Provider);
	};

	const mintUniqueTokenTo = async () => {
		const web3provider = new Web3.providers.HttpProvider(String(provider?.rpcUrl));
		const web3 = new Web3(web3provider);
		// const abi = abi; // 合约abi，相当于合约提供的对接文档
		const contract: IContractProps = new web3.eth.Contract(abi, contractAddress[chainId]);
		// console.log(contract.methods.mintUniqueTokenTo, 'contract', v4());
		const { mintUniqueTokenTo } = contract.methods;
		const { toBuffer, keccak256, bufferToHex } = ethUtil;
		const tokenId = bufferToHex(keccak256(toBuffer(convertUtf8ToHex(v4()))));
		console.log(address, tokenId, "tokenId");
		const res = await mintUniqueTokenTo(address, tokenId, "", false).encodeABI();
		console.log(res, "res");
		// web3.eth.estimateGas()
		return res;
	};

	const checkOwnerOf = async () => {
		const web3provider = new Web3.providers.HttpProvider(String(provider?.rpcUrl));
		console.log(String(provider?.rpcUrl), "String(provider?.rpcUrl)");

		const web3 = new Web3(web3provider);
		// const abi = abi; // 合约abi，相当于合约提供的对接文档
		const contract: IContractProps = new web3.eth.Contract(abi, contractAddress[chainId]);
		// console.log(contract.methods.mintUniqueTokenTo, 'contract', v4());
		const { ownerOf } = contract.methods;
		const res = await ownerOf(new BigNumber(`${tokenId}`)).call();
		console.log(res, "res");
	};

	const deploy = () => {
		const web3provider = new Web3.providers.HttpProvider(String(provider?.rpcUrl));
		console.log(String(provider?.rpcUrl), "String(provider?.rpcUrl)");
		const web3 = new Web3(web3provider);
		const contract = new web3.eth.Contract(abi, contractAddress[chainId]);
		const res = contract.deploy({ data: topholderBytecode.bytecode }).encodeABI();
		console.log(res);
		return res;
	};

	const transferFrom = async () => {
		const web3provider = new Web3.providers.HttpProvider(String(provider?.rpcUrl));
		console.log(String(provider?.rpcUrl), "String(provider?.rpcUrl)");
		const web3 = new Web3(web3provider);
		const contract: IContractProps = new web3.eth.Contract(abi, contractAddress[chainId]);
		const { transferFrom } = contract.methods;
		console.log(address, walletAddress, tokenId, "address, walletAddress, tokenId");

		const res = await transferFrom(address, walletAddress, tokenId).encodeABI();
		console.log(res, "res");
		return res;
	};

	const testSendTransaction2 = async (type: IGetData, toAddress?: string) => {
		if (!providerConnector) {
			return;
		}
		const getData = {
			transferFrom,
			deploy,
			mintUniqueTokenTo,
		};

		const getTo = {
			transferFrom: contractAddress[chainId],
			deploy: "",
			mintUniqueTokenTo: contractAddress[chainId],
		};
		// from
		const from = address;

		// to
		// const to = '0x723E23cFcEb04D2398562c30fF1F74A217772792' || +address;
		const to = getTo[type];

		// nonce
		const _nonce = await web3Provider?.getTransactionCount(address);
		// const _nonce = await apiGetAccountNonce(address, chainId);
		const nonce = sanitizeHex(convertStringToHex(_nonce || 0));

		// gasPrice
		const gasPrices = await web3Provider?.getGasPrice();
		console.log(gasPrices, "gasPrices");

		// const gasPrices = await apiGetGasPrices();
		const _gasPrice = gasPrices?._hex || 0;
		// const _gasPrice = gasPrices.slow.price;
		const gasPrice = sanitizeHex(convertStringToHex(_gasPrice));

		// gasLimit
		const _gasLimit = type === "deploy" ? 5000000 : 4000000;
		const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

		// value
		const _value = 0;
		const value = sanitizeHex(convertStringToHex(_value));

		// data
		const data = await getData[type]();
		// test transaction
		const tx = {
			from,
			to,
			nonce,
			gasPrice,
			gasLimit,
			value,
			data,
		};
		console.log(tx);
		// const signer = await web3Provider?.getSigner();
		// console.log(signer, 'signer');

		// const result = await signer?.sendTransaction(tx);

		const result: string = (await connector?.sendTransaction(tx)) as string;
		// const signTx = signer?.signTransaction(tx);
		console.log(result, "tx");

		// web3Provider?.sendTransaction(res);
	};

	const testSendTransactionDeploy = async () => {
		await testSendTransaction2("deploy");
	};

	const transferFromNft = async () => {
		await testSendTransaction2("transferFrom");
	};

	const testSignTransaction = async () => {
		// const { connector, address, chainId } = this.state;
		console.log(providerConnector, "connector");

		if (!providerConnector) {
			return;
		}

		// from
		const from = address;

		// to
		const to = contractAddress[chainId] || address;

		// nonce
		//  const _nonce = await apiGetAccountNonce(address, chainId);
		const _nonce = (await web3Provider?.getTransactionCount(address)) || 0;

		const nonce = sanitizeHex(convertStringToHex(_nonce));

		// gasPrice
		// const gasPrices = await apiGetGasPrices();
		const gasPrices = await web3Provider?.getGasPrice();
		const _gasPrice = gasPrices?._hex || 0;
		const gasPrice = sanitizeHex(convertStringToHex(_gasPrice));

		// gasLimit
		const _gasLimit = 4000000;
		const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

		// value
		const _value = 0;
		const value = sanitizeHex(convertStringToHex(_value));

		// data
		const data = await mintUniqueTokenTo();

		// test transaction
		const tx: ITxOptionProps = {
			from,
			to,
			nonce,
			gasPrice,
			gasLimit,
			value,
			data,
		};

		// debugger
		// const gas = await web3Provider?.estimateGas(tx);
		// console.log(gas, 'gas');
		// const gas = await web3Eth?.estimateGas({ ...tx, nonce: _nonce });
		// console.log(gas, 'res');
		// if (gas) {
		// 	const newgasLimit = parseInt(String(Number(gas) * 1.2), 10);
		// 	gasLimit = sanitizeHex(convertStringToHex(newgasLimit));
		// 	tx.gasLimit = gasLimit;
		// 	tx.gas = Number(gas);
		// }

		console.log(tx, "tx");

		try {
			// open modal
			// this.toggleModal();

			// toggle pending request indicator
			// this.setState({ pendingRequest: true });
			// send transaction
			const result = (await connector?.signTransaction(tx)) as string;
			// const signer = await web3Provider?.getSigner();
			// const result = signer?.signTransaction(tx);
			console.log(result, "result");

			// format displayed result

			// display result
			// this.setState({
			// 	connector,
			// 	pendingRequest: false,
			// 	result: formattedResult || null,
			// });
		} catch (error) {
			console.error(error);
			// this.setState({ connector, pendingRequest: false, result: null });
		}
	};

	const killSession2 = async () => {
		console.log(provider?.connector, "provider?.connector");
		await provider?.connector.killSession();
	};

	// 断开链接事件
	const onDisconnect = () => {
		resetApp();
	};

	// 重置状态
	const resetApp = () => {
		setchainId(0);
		setaddress("");
		setconnector(undefined);
	};

	return (
		<div className="page1">
			<div className="page1_wapper">
				{/* <Button onClick={connect2}>点击显示二维码</Button> */}
				<Button onClick={connect2}>connect2</Button>

				<div className="account">
					<Row justify="space-between">
						<Col>{chainId && getChainData(chainId)?.name}</Col>
						<Col style={{ textAlign: "right" }}>
							<div>{address}</div>
							<Button onClick={killSession2}>断开链接</Button>
						</Col>
					</Row>
				</div>

				<div className="actions">
					<div className="title">Actions</div>
					<Row justify="space-around" gutter={16}>
						<Col>
							<Button
								onClick={() => testSendTransaction2("mintUniqueTokenTo")}
								size="large"
								type="primary"
							>
								eth_sendTransaction
							</Button>
						</Col>
						<Col>
							<Button onClick={testSendTransactionDeploy} size="large" type="primary">
								eth_sendTransactionDeploy
							</Button>
						</Col>
						<Col>
							<Button onClick={testSignTransaction} size="large" type="primary">
								eth_signTransaction
							</Button>
						</Col>
						<Col>
							<Button size="large" type="primary">
								eth_signTypedData
							</Button>
						</Col>
					</Row>
					<Row justify="space-around">
						<Col>
							<Button size="large" type="primary">
								eth_sign (legacy)
							</Button>
						</Col>
						<Col>
							<Button size="large" type="primary">
								eth_sign (standard)
							</Button>
						</Col>
					</Row>
					<Row justify="space-around">
						<Col>
							<Button onClick={mintUniqueTokenTo} size="large" type="primary">
								create token
							</Button>
						</Col>
						<Col>
							<Button onClick={checkOwnerOf} size="large" type="primary">
								ownerOf
							</Button>
							<Input
								placeholder="tokenId"
								value={tokenId}
								onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
									settokenId(e.target.value)
								}
								allowClear
							/>
						</Col>
						<Col>
							<Button onClick={deploy} size="large" type="primary">
								deploy
							</Button>
						</Col>
						<Col>
							<Button onClick={transferFromNft} size="large" type="primary">
								transferFromNft
							</Button>
							<Input
								placeholder="setwalletAddress"
								value={walletAddress}
								onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
									setwalletAddress(e.target.value)
								}
								allowClear
							/>
						</Col>
					</Row>
				</div>

				<div className="balances">
					<div className="title">Balances</div>
					{/* {renderAssetsRow()} */}
					<Row justify="space-between" gutter={16}>
						<Col style={{ display: "flex" }}>
							<div>ETH</div>
						</Col>
						<Col>{balance}</Col>
					</Row>
				</div>
			</div>
		</div>
	);
};

export default Page1;
