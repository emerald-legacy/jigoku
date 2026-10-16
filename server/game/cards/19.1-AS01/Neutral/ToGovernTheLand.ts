import type { AbilityContext } from '../../../AbilityContext.js';
import { bow, multiple, sendHome } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, ConflictType, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class ToGovernTheLand extends DrawCard {
    static id = 'to-govern-the-land';

    public override setupCardAbilities() {
        this.conflictAction('Send home and bow based on bushi\'s power', { conflictType: ConflictType.Political })
            .condition((context) => this.conditionToTrigger(ConflictType.Political, context))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => this.conditionToTarget(ConflictType.Political, card, context)
            }, this.gameAction());

        this.conflictAction('Send home and bow based on courtier\'s power', { conflictType: ConflictType.Military })
            .condition((context) => this.conditionToTrigger(ConflictType.Military, context))
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => this.conditionToTarget(ConflictType.Military, card, context)
            }, this.gameAction());
    }

    private governSkill(conflictType: ConflictType, card: DrawCard): number {
        switch(conflictType) {
            case ConflictType.Political:
                return card.militarySkill;
            case ConflictType.Military:
                return card.politicalSkill;
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
                return card.hasTrait(Trait.Bushi);
            case ConflictType.Military:
                return card.hasTrait(Trait.Courtier);
            default:
                return false;
        }
    }

    private conditionToTrigger(conflictType: ConflictType, context: AbilityContext): boolean {
        return (context.game.currentConflict?.getParticipants() ?? []).some((card) =>
            this.governFulfillTrait(conflictType, context, card)
        );
    }

    private conditionToTarget(conflictType: ConflictType, card: DrawCard, context: AbilityContext): boolean {
        if(!card.isParticipating()) {
            return false;
        }

        const maxSkillExclusive = (context.game.currentConflict?.getParticipants() ?? []).reduce(
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
        return multiple([sendHome(), bow()]);
    }
}
