import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Location, Phase, Players, PlayType } from '../../Constants.js';
import { flipDynasty, playCard, selectCard, sequential } from '../../GameActions/GameActions.js';

class WayfarersCamp extends DrawCard {
    static id = 'wayfarer-s-camp';

    override setupCardAbilities() {
        this.action('Play two characters')
            .phase(Phase.Dynasty)
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
                })
            ]))
            .chatText('play two cards from their provinces')
            .then()
            .gameAction(selectCard({
                activePromptTitle: 'Choose a card to turn faceup',
                location: Location.Provinces,
                controller: Players.Self,
                gameAction: flipDynasty(),
                message: (_context, card, player) => msg`${player} turns ${card} faceup`
            }));
    }
}


export default WayfarersCamp;
