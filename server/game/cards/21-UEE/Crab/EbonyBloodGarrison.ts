import { CardTypes, Locations, Phases, Players } from '../../../Constants';
import type { ProvinceCard } from '../../../ProvinceCard';
import { StrongholdCard } from '../../../StrongholdCard';
import AbilityDsl from '../../../abilitydsl';
import ThenAbility from '../../../ThenAbility';
import { SimpleStep } from '../../../gamesteps/SimpleStep';

const MY_PROVINCE = 'myProvince';
const OPP_PROVINCE = 'oppProvince';

export default class EbonyBloodGarrison extends StrongholdCard {
    static id = 'ebony-blood-garrison';

    setupCardAbilities() {
        this.reaction({
            title: 'Break a province from each player',
            when: {
                onPhaseEnded: (event, context) => event.phase === Phases.Dynasty && context.game.roundNumber === 1
            },
            cost: AbilityDsl.costs.bowSelf(),
            targets: {
                [MY_PROVINCE]: {
                    controller: Players.Self,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    cardCondition: (card: ProvinceCard) =>
                        card.facedown && card.location !== Locations.StrongholdProvince
                },
                [OPP_PROVINCE]: {
                    dependsOn: MY_PROVINCE,
                    controller: Players.Opponent,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    cardCondition: (card: ProvinceCard) =>
                        card.facedown && card.location !== Locations.StrongholdProvince
                }
            },
            handler: (context) => {
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
            },
            effect: 'drag {1} into chaos, as a crisis strikes {2} and {3}',
            effectArgs: (context) => [
                context.player.opponent,
                context.targets[MY_PROVINCE],
                context.targets[OPP_PROVINCE]
            ]
        });
    }
}
