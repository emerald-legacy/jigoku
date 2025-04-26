import AbilityDsl from '../../../abilitydsl';
import { AbilityTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { ActionProps } from '../../../Interfaces';

export default class SigilOfCondemnation extends DrawCard {
    static id = 'sigil-of-condemnation';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Move home',
                cost: AbilityDsl.costs.dishonorSelf(),
                gameAction: AbilityDsl.actions.sendHome((context) => ({ target: context.source }))
            } as ActionProps<this>)
        });

        this.action({
            title: 'Discard the attached character',
            condition: (context) =>
                this.game.isDuringConflict('military') &&
                (context.source.parent as undefined | DrawCard)?.isDefending() &&
                context.player.isAttackingPlayer() &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent) <
                    context.game.currentConflict.getNumberOfParticipantsFor(context.player),
            gameAction: AbilityDsl.actions.discardFromPlay((context) => ({ target: context.source.parent }))
        });
    }
}
