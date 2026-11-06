import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, ConflictType, Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { unlimited } from '../../../AbilityLimit.js';
import { modifyMilitarySkill } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class JadeInfusedArrows extends DrawCard {
    static id = 'jade-infused-arrows';

    override setupCardAbilities() {
        this.conflictAction('Give attached character a skill bonus', { conflictType: ConflictType.Military })
            .cost(costs.payFate(1))
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: modifyMilitarySkill(this.bonusAmount(context))
            }))
            .chatText((context) => msg`give +${this.bonusAmount(context)}${'military'} to ${context.source.parentCharacter ?? ''}${this.isAgainstEvil(context) ? ' - the jade is potent against the spawns of jigoku' : ''}`)
            .limit(unlimited());
    }

    private isAgainstEvil(context: AbilityContext): boolean {
        const opponent = context.player.opponent;
        if(!opponent) {
            return false;
        }
        return this.game.findAnyCardsInPlay(
            (card) =>
                card.type === CardType.Character &&
                card.isParticipatingFor(opponent) &&
                (card.isTainted || card.hasTrait(Trait.Corrupt))
        ).length > 0;
    }

    private bonusAmount(context: AbilityContext): number {
        return this.isAgainstEvil(context) ? 4 : 2;
    }
}
