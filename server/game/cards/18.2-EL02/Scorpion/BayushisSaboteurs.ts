import { EventName, Location, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import type { AbilityContext } from '../../../AbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
const DISCARD = 'Discard all cards from your provinces';
const FLIP = 'Flip all cards in your provinces facedown';

function defender(context: AbilityContext): Player {
    const conflict = context.game.currentConflict;
    if(!conflict) {
        throw new Error('BayushisSaboteurs: no current conflict');
    }
    return conflict.defendingPlayer;
}

export default class BayushisSaboteurs extends DrawCard {
    static id = 'bayushi-s-saboteurs';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard or flip facedown cards in the defender\'s provinces',
            when: {
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => event.attackers?.includes(context.source),
                onDefendersDeclared: (event: EventPayload<EventName.OnDefendersDeclared>, context) => event.defenders?.includes(context.source),
                onMoveToConflict: (event: EventPayload<EventName.OnMoveToConflict>, context) => event.card === context.source
            },
            target: {
                mode: TargetMode.Select,
                player: (context) =>
                    context.player !== context.game.currentConflict?.defendingPlayer ? Players.Opponent : Players.Self,
                choices: {
                    [DISCARD]: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.discardCard((context) => ({
                            target: defender(context).getDynastyCardsInProvince(Location.Provinces)
                        })),
                        AbilityDsl.actions.refillFaceup((context) => ({
                            target: defender(context),
                            location: [
                                Location.StrongholdProvince,
                                Location.ProvinceOne,
                                Location.ProvinceTwo,
                                Location.ProvinceThree,
                                Location.ProvinceFour
                            ]
                        }))
                    ]),
                    [FLIP]: AbilityDsl.actions.turnFacedown((context) => ({
                        target: defender(context).getDynastyCardsInProvince(Location.Provinces)
                    }))
                }
            },
            effect: '{1} all of {2}\'s dynasty cards',
            effectArgs: (context) => [context.select === DISCARD ? 'discard' : 'flip facedown', defender(context)]
        });
    }
}
