import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, conditional, injure, sequential } from '../../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const enum Timing {
    BEFORE_PENALTY,
    AFTER_PENALTY
}

export default class DaidojiAmbusher extends DrawCard {
    static id = 'daidoji-ambusher';

    public setupCardAbilities() {
        this.conflictAction('Give someone -2 military', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, sequential([
                cardLastingEffect({
                    effect: modifyMilitarySkill(-2)
                }),
                conditional({
                    condition: (context) => this.triggerKickerEffect(context, Timing.AFTER_PENALTY),
                    trueGameAction: injure()
                })
            ]))
            .chatText('give {0} -2{1}{2}', (context) => [
                'military',
                this.triggerKickerEffect(context, Timing.BEFORE_PENALTY)
                    ? ` and ${this.shouldDiscardTarget(context) ? 'discard them' : 'remove a fate from them'}`
                    : ''
            ]);
    }

    private triggerKickerEffect(context: AbilityContext, timing: Timing): boolean {
        const isDishonored = context.source.isDishonored;
        const target = context.target;
        if(!target?.isDrawCard()) {
            return false;
        }
        const targetZero =
            timing === Timing.BEFORE_PENALTY
                ? target.militarySkill <= 2
                : target.militarySkill === 0;

        return isDishonored && targetZero;
    }

    private shouldDiscardTarget(context: AbilityContext): boolean {
        return context.target?.getFate() === 0;
    }
}
