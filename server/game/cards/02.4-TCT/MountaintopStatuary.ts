import DrawCard from '../../DrawCard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MountaintopStatuary extends DrawCard {
    static id = 'mountaintop-statuary';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Move this to stronghold province',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            effect: 'move it to their stronghold province',
            gameAction: ability.actions.moveCard({ destination: Locations.StrongholdProvince })
        });
        this.action({
            title: 'Send a 2 or lower cost character home',
            cost: ability.costs.sacrificeSelf(),
            condition: context => context.source.isInConflictProvince(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking() && card.costLessThan(3),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default MountaintopStatuary;
