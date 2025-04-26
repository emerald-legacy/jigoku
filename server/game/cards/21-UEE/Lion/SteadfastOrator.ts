import AbilityDsl from '../../../abilitydsl';
import type { AbilityLimit } from '../../../AbilityLimit';
import { CardTypes } from '../../../Constants';
import { Cost } from '../../../Costs';
import DrawCard from '../../../drawcard';

export default class SteadfastOrator extends DrawCard {
    static id = 'steadfast-orator';

    setupCardAbilities() {
        const limit = AbilityDsl.limit.perRound(1);
        this.#abilityWithCost(
            limit,
            AbilityDsl.costs.discardCard(),
            'Discard a card to move the character back to the conflict'
        );
        this.#abilityWithCost(
            limit,
            AbilityDsl.costs.discardImperialFavor(),
            'Discard the imperial favor to move the character back to the conflict'
        );
    }

    #abilityWithCost(limit: AbilityLimit, cost: Cost, title: string) {
        this.reaction({
            title,
            when: {
                onSendHome: (event, context) =>
                    event.card.type === CardTypes.Character &&
                    event.card.controller === context.player &&
                    context.player.opponent &&
                    event.context.player === context.player.opponent
            },
            cost,
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.moveToConflict((context) => ({ target: (context as any).event.card })),
            limit: limit
        });
    }
}
