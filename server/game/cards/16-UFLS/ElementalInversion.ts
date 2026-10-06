import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ElementalInversion extends DrawCard {
    static id = 'elemental-inversion';

    setupCardAbilities() {
        this.conflictAction('Switch the contested ring')
            .ringTarget({
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
