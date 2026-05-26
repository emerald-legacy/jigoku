import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, Players, CardTypes } from '../../Constants.js';

class IkomaEiji extends DrawCard {
    static id = 'ikoma-eiji';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Put a character into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === 'political'
            },
            effect: 'put a character into play',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                cardType: CardTypes.Character,
                location: [Locations.Provinces, Locations.DynastyDiscardPile],
                controller: Players.Self,
                cardCondition: card => card.hasTrait('bushi') && card.costLessThan(4),
                message: '{0} puts {1} into play with {2}\'s ability',
                messageArgs: card => [context.player, card, context.source],
                gameAction: ability.actions.putIntoPlay()
            }))
        });
    }
}


export default IkomaEiji;
