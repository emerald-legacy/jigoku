import DrawCard from '../../DrawCard.js';
import { CardType, Location, Phases, Players, PlayType } from '../../Constants.js';
import { flipDynasty, playCard, selectCard, sequential } from '../../GameActions/GameActions.js';

class WayfarersCamp extends DrawCard {
    static id = 'wayfarer-s-camp';

    setupCardAbilities() {
        this.action('Play two characters')
            .gameAction(sequential([
                selectCard({
                    activePromptTitle: 'Choose a character to play',
                    cardType: CardType.Character,
                    location: Location.Provinces,
                    controller: Players.Self,
                    gameAction: playCard({ resetOnCancel: true, source: this, playType: PlayType.PlayFromProvince })
                }),
                selectCard({
                    activePromptTitle: 'Choose a character to play',
                    cardType: CardType.Character,
                    location: Location.Provinces,
                    controller: Players.Self,
                    gameAction: playCard({ resetOnCancel: true, source: this, playType: PlayType.PlayFromProvince })
                }),
                selectCard({
                    activePromptTitle: 'Choose a card to turn faceup',
                    location: Location.Provinces,
                    controller: Players.Self,
                    gameAction: flipDynasty(),
                    message: '{0} turns {1} faceup',
                    messageArgs: (card, player) => [player, card]
                })
            ]))
            .effect('play two cards from their provinces')
            .phase(Phases.Dynasty);
    }
}


export default WayfarersCamp;
