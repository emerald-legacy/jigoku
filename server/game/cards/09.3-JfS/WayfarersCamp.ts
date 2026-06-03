import DrawCard from '../../DrawCard.js';
import { CardType, Location, Phases, Players, PlayType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayfarersCamp extends DrawCard {
    static id = 'wayfarer-s-camp';

    setupCardAbilities() {
        this.action({
            title: 'Play two characters',
            phase: Phases.Dynasty,
            effect: 'play two cards from their provinces',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to play',
                    cardType: CardType.Character,
                    location: Location.Provinces,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.playCard({ resetOnCancel: true, source: this, playType: PlayType.PlayFromProvince })
                }),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to play',
                    cardType: CardType.Character,
                    location: Location.Provinces,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.playCard({ resetOnCancel: true, source: this, playType: PlayType.PlayFromProvince })
                }),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a card to turn faceup',
                    location: Location.Provinces,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.flipDynasty(),
                    message: '{0} turns {1} faceup',
                    messageArgs: (card, player) => [player, card]
                })
            ])
        });
    }
}


export default WayfarersCamp;
