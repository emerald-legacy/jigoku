import { CardType, Location, Phases, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';

const MY_PROVINCE = 'myProvince';
const OPP_PROVINCE = 'oppProvince';

export default class EbonyBloodGarrison extends StrongholdCard {
    static id = 'ebony-blood-garrison';

    setupCardAbilities() {
        this.reaction('Break a province from each player')
            .when({
                onPhaseEnded: (event, context) => event.phase === Phases.Dynasty && context.game.roundNumber === 1
            })
            .cost(AbilityDsl.costs.bowSelf())
            .target({
                name: MY_PROVINCE,
                controller: Players.Self,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) =>
                    card.facedown && card.location !== Location.StrongholdProvince
            })
            .target({
                name: OPP_PROVINCE,
                dependsOn: MY_PROVINCE,
                controller: Players.Opponent,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) =>
                    card.facedown && card.location !== Location.StrongholdProvince
            })
            .handler((context) => {
                const provinces = [context.targets[MY_PROVINCE], context.targets[OPP_PROVINCE]];
                context.game.queueSimpleStep(() => AbilityDsl.actions.reveal({ target: provinces }).resolve(provinces, context));
                context.game.queueSimpleStep(() => AbilityDsl.actions.breakProvince({ target: provinces }).resolve(provinces, context));
            })
            .effect('drag {1} into chaos, as a crisis strikes {2} and {3}', (context) => [
                context.player.opponent,
                context.targets[MY_PROVINCE],
                context.targets[OPP_PROVINCE]
            ]);
    }
}
