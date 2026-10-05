import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TogashiYoshi extends DrawCard {
    static id = 'togashi-yoshi';

    setupCardAbilities() {
        this.reaction('Gain 1 fate from an unclaimed ring')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            })
            .gameAction(AbilityDsl.actions.selectRing(context => ({
                ringCondition:  ring => ring.fate >= 1 && ring.isUnclaimed(),
                target: context.ring,
                gameAction: AbilityDsl.actions.takeFateFromRing()
            })))
            .effect('gain 1 fate from the {1}', (context) => [context.ring]);
    }
}


export default TogashiYoshi;

