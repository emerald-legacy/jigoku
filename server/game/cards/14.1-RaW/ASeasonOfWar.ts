import DrawCard from '../../DrawCard.js';
import { Locations, Durations, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ASeasonOfWar extends DrawCard {
    static id = 'a-season-of-war';

    setupCardAbilities() {
        this.action({
            title: 'Discard all cards from provinces,  refill faceup, and start a new dynasty phase',
            effect: 'discard all cards in all provinces, and refill each province faceup',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardCard(context => ({
                    target: context.player.getDynastyCardsInProvince(Locations.Provinces).concat(context.player.opponent ?
                        context.player.opponent.getDynastyCardsInProvince(Locations.Provinces) : [])
                })),
                AbilityDsl.actions.refillFaceup(context => ({
                    target: context.player,
                    location: [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour]
                })),
                AbilityDsl.actions.refillFaceup(context => ({
                    target: context.player.opponent,
                    location: [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour]
                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    duration: Durations.Custom,
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
