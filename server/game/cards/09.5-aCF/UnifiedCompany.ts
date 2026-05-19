import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players, Locations } from '../../Constants.js';

class UnifiedCompany extends DrawCard {
    static id = 'unified-company';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a 2 cost or less bushi into play from dynasty discard',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller &&
                        context.source.isParticipating() &&
                        context.player.opponent &&
                        context.player.hand.length < context.player.opponent.hand.length;
                }
            },
            gameAction: AbilityDsl.actions.selectCard(() => ({
                cardType: CardTypes.Character,
                location: Locations.DynastyDiscardPile,
                controller: Players.Self,
                cardCondition: (card) => {
                    return card.hasTrait('bushi') &&
                        card.costLessThan(3) &&
                        !card.isUnique();
                },
                gameAction: AbilityDsl.actions.putIntoPlay()
            }))
        });
    }
}


export default UnifiedCompany;
