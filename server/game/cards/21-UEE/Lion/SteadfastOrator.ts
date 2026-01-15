import type { AbilityLimit } from '../../../AbilityLimit';
import { CardTypes } from '../../../Constants';
import type { Cost } from '../../../Costs';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class SteadfastOrator extends DrawCard {
    static id = 'steadfast-orator';

    setupCardAbilities() {
        const limit = AbilityDsl.limit.perRound(1);
        abilityWithCost(
            this,
            limit,
            AbilityDsl.costs.discardCard(),
            'Discard a card to move the character back to the conflict'
        );
        abilityWithCost(
            this,
            limit,
            AbilityDsl.costs.discardImperialFavor(),
            'Discard the imperial favor to move the character back to the conflict'
        );
    }
}

function abilityWithCost(self: SteadfastOrator, limit: AbilityLimit, cost: Cost, title: string) {
    self.reaction({
        title,
        when: {
            onSendHome: (event, context) =>
                event.card.type === CardTypes.Character && event.card.controller === context.player
        },
        cost,
        cannotBeMirrored: true,
        gameAction: AbilityDsl.actions.moveToConflict((context) => ({ target: (context as any).event.card })),
        limit: limit
    });
}
