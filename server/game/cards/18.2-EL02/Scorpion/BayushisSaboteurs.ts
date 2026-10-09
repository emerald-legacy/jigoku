import { msg } from '../../../GameChat.js';
import { Location, Players } from '../../../Constants.js';
import { discardCard, refillFaceup, sequential, turnFacedown } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import type { AbilityContext } from '../../../AbilityContext.js';

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
        this.reaction('Discard or flip facedown cards in the defender\'s provinces')
            .when({
                onConflictDeclared: (event, context) => event.attackers?.includes(context.source),
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source),
                onMoveToConflict: (event, context) => event.card === context.source
            })
            .select({
                player: (context) =>
                    context.player !== context.game.currentConflict?.defendingPlayer ? Players.Opponent : Players.Self
            }, {
                [DISCARD]: sequential([
                    discardCard((context) => ({
                        target: defender(context).getDynastyCardsInProvince(Location.Provinces)
                    })),
                    refillFaceup((context) => ({
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
                [FLIP]: turnFacedown((context) => ({
                    target: defender(context).getDynastyCardsInProvince(Location.Provinces)
                }))
            })
            .chatText((context) => msg`${context.select === DISCARD ? 'discard' : 'flip facedown'} all of ${defender(context)}'s dynasty cards`);
    }
}
