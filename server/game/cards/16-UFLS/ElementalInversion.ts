import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ElementalInversion extends DrawCard {
    static id = 'elemental-inversion';

    setupCardAbilities() {
        this.action('Switch the contested ring')
            .condition(context => context.game.isDuringConflict())
            .ringTarget('target', {
                activePromptTitle: 'Choose an uncontested ring',
                ringCondition: ring => !ring.isContested() && !ring.isRemovedFromGame()
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.placeFateOnRing(context => ({
                    origin: context.ring,
                    target: context.game.currentConflict?.ring,
                    amount: context.ring?.fate
                })),
                AbilityDsl.actions.switchConflictElement()
            ]))
            .effect('move all fate from the {0} and switch it with the contested ring');
    }
}


export default ElementalInversion;
