import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MountaintopStatuary extends DrawCard {
    static id = 'mountaintop-statuary';

    setupCardAbilities() {
        this.reaction('Move this to stronghold province')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.moveCard({ destination: Location.StrongholdProvince }))
            .effect('move it to their stronghold province');
        this.action('Send a 2 or lower cost character home')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => context.source.isInConflictProvince())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isAttacking() && card.costLessThan(3)
            }, AbilityDsl.actions.sendHome());
    }
}


export default MountaintopStatuary;
