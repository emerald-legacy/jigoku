import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, Trait } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import type { AbilityContext } from '../../AbilityContext.js';

const isSpellOrKiho = (card: DrawCard) => card.hasTrait(Trait.Kiho) || card.hasTrait(Trait.Spell);

class ShrineMaiden extends DrawCard {
    static id = 'shrine-maiden';

    setupCardAbilities() {
        this.reaction('Reveal your top 3 conflict cards')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .cost(costs.revealCardsOf((context) => this.revealed(context)))
            .moveCard((context) => ({ target: this.revealed(context).filter(isSpellOrKiho), destination: Location.Hand }))
            .discardCard((context) => ({ target: this.revealed(context).filter((card) => !isSpellOrKiho(card)) }))
            .chatText((context) => {
                const toHand = this.revealed(context).filter(isSpellOrKiho);
                const toDiscard = this.revealed(context).filter((card) => !isSpellOrKiho(card));
                if(toHand.length && toDiscard.length) {
                    return msg`add ${toHand} to their hand and discard ${toDiscard}`;
                }
                return toHand.length ? msg`add ${toHand} to their hand` : msg`discard ${toDiscard}`;
            });
    }

    private revealed(context: AbilityContext): DrawCard[] {
        return context.player.conflictDeck.slice(0, 3);
    }
}


export default ShrineMaiden;
