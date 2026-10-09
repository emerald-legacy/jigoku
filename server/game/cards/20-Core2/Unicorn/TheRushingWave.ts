import { setProvinceStrength } from '../../../effects.js';
import { cardLastingEffect, onAffinity } from '../../../GameActions/GameActions.js';
import { CardType, Duration, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';
import { msg } from '../../../GameChat.js';

function provinceLog(province: ProvinceCard) {
    return province.facedown ? province.location : province;
}

function adjacentProvinces(centralProvince: ProvinceCard): Array<string | ProvinceCard> {
    return centralProvince.controller
        .getProvinces((province) =>
            centralProvince.controller.areLocationsAdjacent(centralProvince.location, province.location)
        )
        .map(provinceLog);
}

export default class TheRushingWave extends DrawCard {
    static id = 'the-rushing-wave';

    setupCardAbilities() {
        this.action('Set a province to zero strength')
            .condition((context) => controlsShugenja(context.player))
            .target({
                location: Location.Provinces,
                cardType: CardType.Province
            }, onAffinity({
                trait: 'water',
                gameAction: cardLastingEffect(({ target }) => ({
                    target: target?.isProvinceCard()
                        ? target.controller.getProvinces(
                            (province) =>
                                target.location === province.location ||
                                    target.controller.areLocationsAdjacent(target.location, province.location)
                        )
                        : [],
                    targetLocation: Location.Provinces,
                    duration: Duration.UntilEndOfPhase,
                    effect: setProvinceStrength(0)
                })),
                noAffinityGameAction: cardLastingEffect({
                    targetLocation: Location.Provinces,
                    duration: Duration.UntilEndOfPhase,
                    effect: setProvinceStrength(0)
                }),
                chatText: 'also set the strength of {0} to 0',
                chatTextArgs: (context) => [context.target?.isProvinceCard() ? adjacentProvinces(context.target) : []]
            }))
            .chatText((context) => msg`set ${provinceLog(context.target)}'s strength to 0 until the end of the phase`);
    }
}
