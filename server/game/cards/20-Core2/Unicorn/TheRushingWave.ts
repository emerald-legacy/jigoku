import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Durations, Locations } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';

function provinceLog(province: ProvinceCard) {
    return province.facedown ? province.location : province;
}

function adjacentProvinces(centralProvince: ProvinceCard): Array<string | ProvinceCard> {
    return centralProvince.controller
        .getProvinces((province: ProvinceCard) =>
            centralProvince.controller.areLocationsAdjacent(centralProvince.location, province.location)
        )
        .map(provinceLog);
}

export default class TheRushingWave extends DrawCard {
    static id = 'the-rushing-wave';

    setupCardAbilities() {
        this.action<ProvinceCard>({
            title: 'Set a province to zero strength',
            condition: (context) =>
                context.player.cardsInPlay.some(
                    (card: DrawCard) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
                ),
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                gameAction: AbilityDsl.actions.onAffinity<ProvinceCard>({
                    trait: 'water',
                    gameAction: AbilityDsl.actions.cardLastingEffect(({ target }: { target: ProvinceCard }) => ({
                        target: target.controller.getProvinces(
                            (province: ProvinceCard) =>
                                target.location === province.location ||
                                target.controller.areLocationsAdjacent(target.location, province.location)
                        ),
                        targetLocation: Locations.Provinces,
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.setProvinceStrength(0)
                    })),
                    noAffinityGameAction: AbilityDsl.actions.cardLastingEffect({
                        targetLocation: Locations.Provinces,
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.setProvinceStrength(0)
                    }),
                    effect: 'also set the strength of {0} to 0',
                    effectArgs: (context) => [context.target ? adjacentProvinces(context.target as ProvinceCard) : []]
                })
            },
            effect: 'set {1}\'s strength to 0 until the end of the phase',
            effectArgs: (context) => [context.target ? provinceLog(context.target) : '']
        });
    }
}
