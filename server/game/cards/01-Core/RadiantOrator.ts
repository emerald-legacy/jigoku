import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class RadiantOrator extends DrawCard {
    static id = 'radiant-orator';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Send a character home',
            condition: context => !!context.player.opponent && context.source.isParticipating() && (
                // My total glory
                context.player.cardsInPlay.reduce((myTotal: number, card) => myTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0) >
                // is greater than Opponents total glory
                context.player.opponent.cardsInPlay.reduce((oppTotal: number, card) => oppTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0)
            ),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default RadiantOrator;
