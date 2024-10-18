import React from "react"
import ResultsModal from "./components/ResultsModal"
import EmojiLists from "./components/EmojiLists"
import emojis from "./data/emojis"
import { nanoid } from "nanoid"

export default function App() {
	const [likedEmojis, setLikedEmojis] = React.useState([])
	const [passedEmojis, setPassedEmojis] = React.useState([])
	const [currentEmojis, setCurrentEmojis] = React.useState(getRandomEmojis)
	const [showResults, setShowResults] = React.useState(false)
	const [resultsReady, setResultsReady] = React.useState(false)

	function handleClick(e) {
		// console.log(e.target.textContent)
		setLikedEmojis(prevEmojis => [...prevEmojis, e.target.textContent])
		const selectedEmoji = e.target.textContent;
		const arrayPassedEmojis = currentEmojis.filter((emoji) => emoji != selectedEmoji)
		setPassedEmojis(prevPassedEmojis => [...prevPassedEmojis, [...arrayPassedEmojis] ])
		setCurrentEmojis(getRandomEmojis)
	}
	
			console.log(likedEmojis)
		console.log(passedEmojis)
	

	function getRandomEmojis() {
		function chooseRandomEmoji() {
			return emojis[Math.floor(Math.random() * emojis.length)]
		}
		return new Array(3).fill("").map((item) => chooseRandomEmoji())
	}

	function getResults() {
		setShowResults(true)
	}

	function reset() {
		setLikedEmojis([])
		setPassedEmojis([])
		setShowResults(false)
		setResultsReady(false)
	}

	React.useEffect(() => {
		showResults &&
			setTimeout(() => {
				setResultsReady(true)
			}, 2000)
	}, [showResults])

	function generateListItems(element) {
		return <li key={nanoid()}>{element}</li>
	}

	return (
		<div className="wrapper">
			<div className="results-counter">{likedEmojis.length} / 10</div>

			<ResultsModal
				showResults={showResults}
				getResults={getResults}
				resultsReady={resultsReady}
				reset={reset}
				generateListItems={generateListItems}
				likedEmojis={likedEmojis}
			/>

			<h1>Emoji Personality Test</h1>

			<div className="overall-emojis-container">
				<button onClick={handleClick}>
					{currentEmojis[0]}
				</button>
				<button onClick={handleClick}>
					{currentEmojis[1]}
				</button>
				<button onClick={handleClick}>
					{currentEmojis[2]}
				</button>
			</div>

			<EmojiLists
				likedEmojis={likedEmojis}
				passedEmojis={passedEmojis}
				generateListItems={generateListItems}
			/>
		</div>
	)
}
