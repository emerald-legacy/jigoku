import type { AbilityContext } from '../../../AbilityContext.js';
import { CardTypes, ConflictTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class JadeInfusedArrows extends DrawCard {
    static id = 'jade-infused-arrows';

    setupCardAbilities() {
        this.action({
            title: 'Give attached character a skill bonus',
            condition: (context) => context.source.parent?.isParticipating(ConflictTypes.Military) ?? false,
            cost: AbilityDsl.costs.payFate(1),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyMilitarySkill(this.#bonusAmount(context))
            })),
            effect: 'give +{1}{2} to {3}{4}',
            effectArgs: (context) => [
                this.#bonusAmount(context),
                'military',
                context.source.parent ?? '',
                this.#isAgainstEvil(context) ? ' - the jade is potent against the spawns of jigoku!' : ''
            ],
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    #isAgainstEvil(context: AbilityContext): boolean {
        return context.player.opponent?.cardsInPlay.some(
            (card: DrawCard) =>
                card.getType() === CardTypes.Character &&
                card.isParticipating() &&
                (card.isTainted || card.hasTrait('shadowlands'))
        ) ?? false;
    }

    #bonusAmount(context: AbilityContext): number {
        return this.#isAgainstEvil(context) ? 4 : 2;
    }
}
