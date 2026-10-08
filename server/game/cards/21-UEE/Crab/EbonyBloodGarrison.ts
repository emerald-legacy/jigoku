import { msg } from '../../../GameChat.js';
import { CardType, Location, Phase, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { breakProvince, reveal } from '../../../GameActions/GameActions.js';

const MY_PROVINCE = 'myProvince';
const OPP_PROVINCE = 'oppProvince';

export default class EbonyBloodGarrison extends StrongholdCard {
    static id = 'ebony-blood-garrison';

    setupCardAbilities() {
        this.reaction('Break a province from each player')
            .when({
                onPhaseEnded: (event, context) => event.phase === Phase.Dynasty && context.game.roundNumber === 1
            })
            .cost(costs.bowSelf())
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
                context.game.queueSimpleStep(() => reveal({ target: provinces }).resolve(provinces, context));
                context.game.queueSimpleStep(() => breakProvince({ target: provinces }).resolve(provinces, context));
            })
            .chatText((context) => msg`drag ${context.player.opponent} into chaos, as a crisis strikes ${context.targets[MY_PROVINCE]} and ${context.targets[OPP_PROVINCE]}`);
    }
}
