import DrawCard from '../../DrawCard.js';
import { Location, Duration, Phase } from '../../Constants.js';
import { restartDynastyPhase } from '../../effects.js';
import { discardCard, playerLastingEffect, refillFaceup, sequential } from '../../GameActions/GameActions.js';

class ASeasonOfWar extends DrawCard {
    static id = 'a-season-of-war';

    setupCardAbilities() {
        this.action('Discard all cards from provinces, refill faceup, and start a new dynasty phase')
            .gameAction(sequential([
                discardCard(context => ({
                    target: context.player.getDynastyCardsInProvince(Location.Provinces).concat(context.player.opponent ?
                        context.player.opponent.getDynastyCardsInProvince(Location.Provinces) : [])
                })),
                refillFaceup(context => ({
                    target: context.player,
                    location: [Location.StrongholdProvince, Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree, Location.ProvinceFour]
                })),
                refillFaceup(context => ({
                    target: context.player.opponent,
                    location: [Location.StrongholdProvince, Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree, Location.ProvinceFour]
                })),
                playerLastingEffect(context => ({
                    duration: Duration.Custom,
                    until: {
                        onPhaseStarted: event => event.phase === Phase.Dynasty
                    },
                    effect: restartDynastyPhase(context.source)
                }))
            ]))
            .chatText('discard all cards in all provinces, and refill each province faceup');
    }
}


export default ASeasonOfWar;
