import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

const enum Timing {
    BEFORE_PENALTY,
    AFTER_PENALTY
}

export default class DaidojiAmbusher extends DrawCard {
    static id = 'daidoji-ambusher';

    public setupCardAbilities() {
        this.action('Give someone -2 military')
            .condition((context) => context.game.isDuringConflict('military') && context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyMilitarySkill(-2)
                }),
                AbilityDsl.actions.conditional({
                    condition: (context) => this.triggerKickerEffect(context, Timing.AFTER_PENALTY),
                    trueGameAction: AbilityDsl.actions.conditional({
                        condition: (context) => this.shouldDiscardTarget(context),
                        trueGameAction: AbilityDsl.actions.discardFromPlay(),
                        falseGameAction: AbilityDsl.actions.removeFate()
                    }),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            ]))
            .effect('give {0} -2{1}{2}', (context) => [
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
                ? target.getMilitarySkill() <= 2
                : target.getMilitarySkill() === 0;

        return isDishonored && targetZero;
    }

    private shouldDiscardTarget(context: AbilityContext): boolean {
        return context.target?.getFate() === 0;
    }
}
