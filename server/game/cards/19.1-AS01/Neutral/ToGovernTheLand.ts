import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, ConflictType, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class ToGovernTheLand extends DrawCard {
    static id = 'to-govern-the-land';

    public setupCardAbilities() {
        this.action({
            title: 'Send home and bow based on bushi\'s power',
            condition: (context) => this.conditionToTrigger(ConflictType.Political, context),
            target: {
                cardType: CardType.Character,
                mode: TargetMode.Single,
                cardCondition: (card, context) => this.conditionToTarget(ConflictType.Political, card, context),
                gameAction: this.gameAction()
            }
        });

        this.action({
            title: 'Send home and bow based on courtier\'s power',
            condition: (context) => this.conditionToTrigger(ConflictType.Military, context),
            target: {
                cardType: CardType.Character,
                mode: TargetMode.Single,
                cardCondition: (card, context) => this.conditionToTarget(ConflictType.Military, card, context),
                gameAction: this.gameAction()
            }
        });
    }

    private governSkill(conflictType: ConflictType, card: BaseCard): number {
        switch(conflictType) {
            case ConflictType.Political:
                return (card as DrawCard).getMilitarySkill();
            case ConflictType.Military:
                return (card as DrawCard).getPoliticalSkill();
            default:
                return NaN;
        }
    }

    private governFulfillTrait(conflictType: ConflictType, context: AbilityContext, card: BaseCard): boolean {
        if(card.controller !== context.player) {
            return false;
        }

        switch(conflictType) {
            case ConflictType.Political:
                return card.hasTrait('bushi');
            case ConflictType.Military:
                return card.hasTrait('courtier');
            default:
                return false;
        }
    }

    private conditionToTrigger(conflictType: ConflictType, context: AbilityContext): boolean {
        return (
            context.game.isDuringConflict(conflictType) &&
            (context.game.currentConflict?.getParticipants() as BaseCard[] ?? []).some((card) =>
                this.governFulfillTrait(conflictType, context, card)
            )
        );
    }

    private conditionToTarget(conflictType: ConflictType, card: DrawCard, context: AbilityContext): boolean {
        if(!card.isParticipating()) {
            return false;
        }

        const maxSkillExclusive = (context.game.currentConflict?.getParticipants() as BaseCard[] ?? []).reduce(
            (max, myCard) => {
                if(!this.governFulfillTrait(conflictType, context, myCard)) {
                    return max;
                }

                const milSkill = this.governSkill(conflictType, myCard);
                return milSkill > max ? milSkill : max;
            },
            0
        );
        return this.governSkill(conflictType, card) < maxSkillExclusive;
    }

    private gameAction(): GameAction {
        return AbilityDsl.actions.multiple([AbilityDsl.actions.sendHome(), AbilityDsl.actions.bow()]);
    }
}
