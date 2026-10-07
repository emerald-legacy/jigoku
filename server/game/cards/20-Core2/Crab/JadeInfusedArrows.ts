import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { unlimitedPerConflict } from '../../../AbilityLimit.js';
import { modifyMilitarySkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class JadeInfusedArrows extends DrawCard {
    static id = 'jade-infused-arrows';

    setupCardAbilities() {
        this.conflictAction('Give attached character a skill bonus', { conflictType: ConflictType.Military })
            .cost(costs.payFate(1))
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: modifyMilitarySkill(this.bonusAmount(context))
            }))
            .effect('give +{1}{2} to {3}{4}', (context) => [
                this.bonusAmount(context),
                'military',
                context.source.parentCharacter ?? '',
                this.isAgainstEvil(context) ? ' - the jade is potent against the spawns of jigoku' : ''
            ])
            .limit(unlimitedPerConflict());
    }

    private isAgainstEvil(context: AbilityContext): boolean {
        return context.player.opponent?.cardsInPlay.some(
            (card) =>
                card.getType() === CardType.Character &&
                card.isParticipating() &&
                (card.isTainted || card.hasTrait('shadowlands'))
        ) ?? false;
    }

    private bonusAmount(context: AbilityContext): number {
        return this.isAgainstEvil(context) ? 4 : 2;
    }
}
