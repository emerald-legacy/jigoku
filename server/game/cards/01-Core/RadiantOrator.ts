import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class RadiantOrator extends DrawCard {
    static id = 'radiant-orator';

    setupCardAbilities() {
        this.action('Send a character home')
            .condition(context => !!context.player.opponent && context.source.isParticipating() && (
                context.player.cardsInPlay.reduce((myTotal, card) => myTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0) >
                context.player.opponent.cardsInPlay.reduce((oppTotal, card) => oppTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0)
            ))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent
            }, AbilityDsl.actions.sendHome());
    }
}


export default RadiantOrator;
