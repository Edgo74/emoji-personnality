import React from "react"
import gear from "../images/gear.svg"
export default function ResultsModal(props) {
	const message = !props.resultsReady ? (
		<div className="modal-inner-container">
			<img src= {gear} /> <p>Analyse...</p>{" "}
		</div>
	) : (
		<>
		<div className="modal-inner-container">
			<ul className="bounce-top">
				{props.likedEmojis.map(props.generateListItems)}
			</ul>
			<button className="try-again-button" onClick={props.reset}>
				Je réessaye !
			</button>
		</div>
		<div className="modal-inner-container w-text">
			<p>
				Ta personnalité: <span> {props.personalityResult} </span>
			</p>
		</div>
		</>
	)

	if (props.likedEmojis.length >= 10) {
		return (
			<div className="results-modal-container">
				{!props.showResults ? (
					<div className="modal-inner-container">
						<button className="get-results-button" onClick={props.getResults}>
							Obtenir le résultat
						</button>
					</div>
				) : (
					message
				)}
			</div>
		)
	} else {
		return null
	}
}


