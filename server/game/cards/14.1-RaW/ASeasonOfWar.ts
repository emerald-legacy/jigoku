import DrawCard from '../../DrawCard.js';
import { Location, Duration, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ASeasonOfWar extends DrawCard {
    static id = 'a-season-of-war';

    setupCardAbilities() {
        this.action({
            title: 'Discard all cards from provinces,  refill faceup, and start a new dynasty phase',
            effect: 'discard all cards in all provinces, and refill each province faceup',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardCard(context => ({
                    target: context.player.getDynastyCardsInProvince(Location.Provinces).concat(context.player.opponent ?
                        context.player.opponent.getDynastyCardsInProvince(Location.Provinces) : [])
                })),
                AbilityDsl.actions.refillFaceup(context => ({
                    target: context.player,
                    location: [Location.StrongholdProvince, Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree, Location.ProvinceFour]
                })),
                AbilityDsl.actions.refillFaceup(context => ({
                    target: context.player.opponent,
                    location: [Location.StrongholdProvince, Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree, Location.ProvinceFour]
                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    duration: Duration.Custom,
                    until: {
                        onPhaseStarted: event => event.phase === Phases.Dynasty
                    },
                    effect: AbilityDsl.effects.restartDynastyPhase(context.source)
                }))
            ])
        });
    }
}


export default ASeasonOfWar;
