import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
window.ethereum.autoRefreshOnNetworkChange = false;
function App() {
	const [manager, setManager] = useState('');
	const [players, setPlayers] = useState([]);
	const [balance, setBalance] = useState('');
	const [value, setValue] = useState('');
	const [message, setMessage] = useState('');
	const [lastWinner, setLastWinner] = useState('');
	useEffect(async () => {
		let address = await lottery.methods.manager().call();
		let currentPlayers = await lottery.methods.getPlayers().call();
		let newBalance = await web3.eth.getBalance(lottery.options.address);
		setManager(address);
		setPlayers(currentPlayers);
		setBalance(newBalance);
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		const accounts = await web3.eth.getAccounts();

		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(value, 'ether'),
		});
	};
	const pickWinner = async (e) => {
		if (players.length == 0) return null;
		const accounts = await web3.eth.getAccounts();
		setMessage('picking a winner...');

		await lottery.methods.pickWinner().send({
			from: accounts[0],
		});
		const winner = await lottery.methods.lastWinner().call();
		setLastWinner(winner);
		setMessage('picked Winner!');
	};
	return (
		<div className="App">
			<h2>Lottery Contract</h2>
			<p>
				This Contract is managed by {manager}
				There are currently {players.length} people entered, competing to win{' '}
				{web3.utils.fromWei(balance, 'ether')} ether!
			</p>
			<hr />
			<form onSubmit={onSubmit}>
				<h4>Want to try your luck?</h4>
				<div>
					<label>Amount of Ether to enter</label>
					<input onChange={(e) => setValue(e.target.value)} value={value} />
				</div>
				<button>Enter</button>
			</form>
			<hr />
			<h4>Ready to pick a Winner?</h4>
			<button onClick={pickWinner}>Pick a Winner!</button>
			<hr />
			<h1>Last Winner: {lastWinner}</h1>
			<hr />
			<h1>{message}</h1>
		</div>
	);
}

export default App;
