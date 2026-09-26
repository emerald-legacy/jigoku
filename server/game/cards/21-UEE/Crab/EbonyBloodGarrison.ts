import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import { CardType, EventName, Location, Phases, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';

import { SimpleStep } from '../../../gamesteps/SimpleStep.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
const MY_PROVINCE = 'myProvince';
const OPP_PROVINCE = 'oppProvince';

export default class EbonyBloodGarrison extends StrongholdCard {
    static id = 'ebony-blood-garrison';

    setupCardAbilities() {
        this.reaction('Break a province from each player')
            .when({
                onPhaseEnded: (event: EventPayload<EventName.OnPhaseEnded>, context: TriggeredAbilityContext) => event.phase === Phases.Dynasty && context.game.roundNumber === 1
            })
            .cost(AbilityDsl.costs.bowSelf())
            .target(MY_PROVINCE, {
                controller: Players.Self,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) =>
                    card.facedown && card.location !== Location.StrongholdProvince
            })
            .target(OPP_PROVINCE, {
                dependsOn: MY_PROVINCE,
                controller: Players.Opponent,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) =>
                    card.facedown && card.location !== Location.StrongholdProvince
            })
            .handler((context) => {
                const provinces = [context.targets[MY_PROVINCE], context.targets[OPP_PROVINCE]];
                context.game.queueStep(
                    new SimpleStep(context.game, () =>
                        AbilityDsl.actions.reveal({ target: provinces }).resolve(provinces, context)
                    )
                );

                context.game.queueStep(
                    new SimpleStep(context.game, () =>
                        AbilityDsl.actions.breakProvince({ target: provinces }).resolve(provinces, context)
                    )
                );

                // context.game.queueStep(
                //     new SimpleStep(context.game, () =>
                //         AbilityDsl.actions.draw({ target: context.player }).resolve(context.player, context)
                //     )
                // );
                //
                // context.game.queueStep(
                //     new SimpleStep(context.game, () =>
                //         AbilityDsl.actions.gainFate({ target: context.player }).resolve(context.player, context)
                //     )
                // );
            })
            .effect('drag {1} into chaos, as a crisis strikes {2} and {3}', (context) => [
                context.player.opponent,
                context.targets[MY_PROVINCE],
                context.targets[OPP_PROVINCE]
            ]);
    }
}
