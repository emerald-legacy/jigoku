import type { AbilityContext } from '../../../AbilityContext.js';
import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { Conflict } from '../../../Conflict.js';
import DrawCard from '../../../DrawCard.js';

export default class TillTheLastOneFalls extends DrawCard {
    static id = 'till-the-last-one-falls-';

    public setupCardAbilities() {
        this.action({
            title: 'Give a character a skill bonus',
            condition: (context) =>
                !!(context.game.isDuringConflict() &&
                context.player.opponent &&
                context.game.currentConflict?.hasMoreParticipants(context.player.opponent, () => true)),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: AbilityDsl.effects.modifyBothSkills(this.#bonus(context))
                }))
            },
            effect: 'give {0} +{1}{2}/+{1}{3}',
            effectArgs: (context) => [this.#bonus(context), 'military', 'political'],
            max: AbilityDsl.limit.perConflict(1)
        });
    }

    #bonus(context: AbilityContext): number {
        const conflict = context.game.currentConflict as Conflict;
        const opponentCount = conflict.getNumberOfParticipantsFor(context.player.opponent);
        return 2 * opponentCount;
    }
}
