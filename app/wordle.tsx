import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';

interface Square {
	letter: string;
	color?: string;
	last?: boolean;
}

interface Row {
	squares: Square[];
}

interface Grid {
	rows: Row[];
}

const defaultGrid: Grid = {
	rows: Array(6).fill(0).map(() => ({
		squares: Array(5).fill(0).map(() => ({
			letter: '',
		})),
	})),
}

const Wordle: React.FC = () => {
	const answer = 'apple';
		const [endGame, setEndGame] = useState<boolean>(false);
	const [grid, setGrid] = useState<Grid>(defaultGrid);

		const restartGrid = () => {
			console.log("restartGrid")
			setGrid(defaultGrid);
		}

		useEffect(() => {
			console.log("grid", grid);
		}, [setGrid, grid]);

	const checkGuess = () => {
		const answerArray = answer.split('');

		const newGrid = { ...grid };
		newGrid.rows.forEach((row) => {
			row.squares.forEach((square, squareIndex) => {
				if (square.letter === '') {
					return;
				}

				if (square.letter === answerArray[squareIndex]) {
					square.color = 'green';
				} else if (answerArray.includes(square.letter)) {
					square.color = 'yellow';
				} else {
					square.color = 'red';
				}
			});
		});

			setGrid(newGrid);
		if (newGrid.rows.find(row => row.squares.every(square => square.color === 'green'))) {
			setEndGame(true);
			if (confirm("You win! Congratulations!\nDo you want to play again?")) {
				restartGrid();
			} 
		}
	};

	const handleKeyPress = (key: string) => {
		const newGrid = { ...grid };
		const currentRow = newGrid.rows.find(row => row.squares.some(square => square.letter === ''));
		const currentRowIndex = grid.rows.findIndex(row => row === currentRow);

		if (!currentRow) {
			if (key === 'enter') {
				if (confirm("You lose!\nDo you want to play again?")) {
					restartGrid();
				} 
				}
			else if (key === 'del') {
				newGrid.rows[5].squares[4].letter = '';
				setGrid(newGrid);
			} 

				setEndGame(true);
			return;
		}

		if (key === 'del') {
			if (currentRowIndex > 0 && newGrid.rows[currentRowIndex-1].squares[4].letter !== '' && !newGrid.rows[currentRowIndex-1].squares[4].last) {
				newGrid.rows[currentRowIndex-1].squares[4].letter = '';
				setGrid(newGrid);
				return;
			}
			for (let i = currentRow.squares.length - 1; i >= 0; i--) {
				if (currentRow.squares[i].letter !== '') {
					currentRow.squares[i].letter = '';
					break;
				}
			}
		} else if (key === 'enter') {
			if (currentRowIndex > 0 && !newGrid.rows[currentRowIndex-1].squares[4].last && currentRowIndex > 0 && grid.rows[currentRowIndex-1].squares.every(square => square.letter !== '') && currentRow.squares.every(square => square.letter === '')) {
				newGrid.rows[currentRowIndex-1].squares[4].last = true;

				setGrid(newGrid);
				checkGuess();
			}
		} else {
			if (currentRow.squares.every(square => square.last === undefined)) { 
				if (currentRowIndex > 0 && !newGrid.rows[currentRowIndex-1].squares[4].last && newGrid.rows[currentRowIndex-1].squares.every(square => square.letter !== '') && currentRow.squares.every(square => square.letter === '')) {
					return;
				}
				for (let i = 0; i < currentRow.squares.length; i++) {
					if (currentRow.squares[i].letter === '') {
						currentRow.squares[i].letter = key;
						break;
					}
				}
			}
		}

			setGrid(newGrid);
	};

	return (
		<View style={styles.container}>
			<Text style={{color: 'white', flexGrow: 1, fontSize: 30, marginTop: 25}}>Wordle!</Text>
			<View style={styles.grid}>
				{grid.rows.map((row, i) => (
					<View style={styles.row} key={i}>
						{row.squares.map((square, j) => (
							<View key={j} style={{justifyContent: 'center'}}>
								<Text style={[styles.letter, square.color === 'green' && styles.green, square.color === 'yellow' && styles.yellow, square.color === 'red' && styles.red]}>
									{square.letter}
								</Text>
							</View>
						))}
					</View>
				))}
			</View>
			<Keyboard onKeyPress={handleKeyPress} disabled={endGame} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#0e0e0f'
	},
	grid: {
		justifyContent: 'center',
		alignItems: 'center',
		flexGrow: 2,
	},
	row: {
		flexDirection: 'row',
	},
	letter: {
		width: Dimensions.get('window').width / 14,
		minWidth: 60,
		maxWidth: 80,
		height: Dimensions.get('window').width / 14,
		minHeight: 60,
		maxHeight: 80,
		backgroundColor: '#0e0e0f',
		margin: 4,
		borderColor: '#3a3a3c',
		borderWidth: 3,
		textTransform: 'uppercase',
		fontSize: 35,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
		alignContent: 'center',
		...Platform.select({
			ios: {
				height: Dimensions.get('window').height / 14,
				lineHeight: 55,
			},
			android: {
				height: Dimensions.get('window').height / 14,
			}
		}),

	},
		green: {
			backgroundColor: 'green',
		},
		yellow: {
			backgroundColor: '#adad15',
		}, 
		red: {
			backgroundColor: '#c00303',
		},
	keyboard: {
		justifyContent: 'center',
		alignItems: 'center',
		flexGrow: 3,
	},
	rowKey: {
		flexDirection: 'row',
	},
	key: {
		width: Dimensions.get('window').width / 13,
		maxWidth: 40,
		height: 60,
		margin: 4,
		backgroundColor: '#656767',
		borderRadius: 5,
		color: 'white',
		fontSize: 20,
		textTransform: 'uppercase',
		textAlign: 'center',
		textAlignVertical: 'center',
		alignContent: 'center',
		...Platform.select({
			ios: {
				lineHeight: 55,
				overflow: 'hidden',
			},
			android: {
				overflow: 'hidden',
			}
		}),
	},
	actionKey: {
		width: Dimensions.get('window').width / 8,
		maxWidth: 60,
		fontSize: 12,
	}
});

export default Wordle;

const Keyboard: React.FC<{ onKeyPress: (key: string) => void, disabled: boolean }> = ({ onKeyPress, disabled }) => {
	const rows = [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
		['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del']
	];

	return (
		<View style={styles.keyboard}>
			{rows.map((row, i) => (
				<View style={styles.rowKey} key={i}>
					{row.map((key) => (
						<TouchableOpacity key={key} onPress={() => onKeyPress(key)} disabled={disabled}>
							<Text style={[styles.key, (key === 'enter' || key === 'del') && styles.actionKey]}>{key}</Text>
						</TouchableOpacity>
					))}
				</View>
			))}
		</View>
	);
};
