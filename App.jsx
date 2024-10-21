import React from "react"
import ResultsModal from "./components/ResultsModal"
import EmojiLists from "./components/EmojiLists"
import emojis from "./data/emojis"
import { nanoid } from "nanoid"

const openaiApi = import.meta.env.VITE_OPENAI_API_KEY;

export default function App() {
	const [likedEmojis, setLikedEmojis] = React.useState([])
	const [passedEmojis, setPassedEmojis] = React.useState([])
	const [currentEmojis, setCurrentEmojis] = React.useState(getRandomEmojis)
	const [showResults, setShowResults] = React.useState(false)
	const [resultsReady, setResultsReady] = React.useState(false)
	const [personalityResult, setPersonalityResult] = React.useState("super !")

	function handleClick(e) {
		// console.log(e.target.textContent)
		setLikedEmojis(prevEmojis => [...prevEmojis, e.target.textContent])
		const selectedEmoji = e.target.textContent;
		const arrayPassedEmojis = currentEmojis.filter((emoji) => emoji != selectedEmoji)
		setPassedEmojis(prevPassedEmojis => [...prevPassedEmojis, [...arrayPassedEmojis] ])
		setCurrentEmojis(getRandomEmojis)
	}
	
		// 	console.log(likedEmojis)
		// console.log(passedEmojis)
	

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
		if (showResults) {
			const fetchPersonality = async () => {
				try {
					const emojiString = likedEmojis.join(' ');
					const response = await fetch('https://api.openai.com/v1/chat/completions', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${openaiApi}`,
						},
						body: JSON.stringify({
							model: 'gpt-4',
							messages: [
								{
									role: 'user',
									content: `En te basant sur les emojis suivants aimés par un utilisateur : ${emojiString}, génére une description courte et personnalisée de sa personnalité. utilise un ton amical en tutoyant l'utilisateur. Ta réponse ne doit jamaias dépasser 70 mots` 
								}
							],
							max_tokens: 120,
						}),
					});
	
					const data = await response.json();
					// Récupérer la réponse générée par GPT-4
					console.log(data.choices[0]?.message.content);
					const generatedText = data.choices[0]?.message.content || "Your personality is great!"; 
	
					// Stocker le résultat
					setResultsReady(true);
					setPersonalityResult(generatedText); // Mettre à jour l'état avec la réponse API
				} catch (error) {
					console.error("Erreur lors de l'appel à l'API GPT-4", error);
					setResultsReady(true);
					// setPersonalityResult("Your personality is great!"); // Fallback en cas d'erreur
				}
			};
	
			fetchPersonality(); // Call the function to fetch personality
		}
	}, [showResults, likedEmojis]);
	
	
	

	function generateListItems(element) {
		return <li key={nanoid()}>{element}</li>
	}

	return (
		<div className="wrapper">
			<div className="results-counter">{likedEmojis.length} / 10</div>

			<ResultsModal
				personalityResult={personalityResult}
				showResults={showResults}
				getResults={getResults}
				resultsReady={resultsReady}
				reset={reset}
				generateListItems={generateListItems}
				likedEmojis={likedEmojis}
			/>

			<h1>Test d'Emoji Personnalité </h1>

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
