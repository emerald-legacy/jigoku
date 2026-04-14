import DrawCard from '../../drawcard';
import { Durations } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class AustereExemplar extends DrawCard {
    static id = 'austere-exemplar';

    setupCardAbilities() {
        this.action({
            title: 'Take three actions',
            limit: AbilityDsl.limit.perConflict(1),
            cost: AbilityDsl.costs.payFateToRing(),
            condition: (context) => context.source.isAttacking(),
            effect: 'take three actions',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Durations.UntilPassPriority,
                effect: AbilityDsl.effects.additionalAction(3)
            }))
        });
    }
}


export default AustereExemplar;
