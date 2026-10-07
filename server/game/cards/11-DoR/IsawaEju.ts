import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { Location, CardType, Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'isawa-eju-air', element: Element.Air };

class IsawaEju extends DrawCard {
    static id = 'isawa-eju';

    setupCardAbilities() {
        this.action('Discard all cards in a province and refill it faceup')
            .condition(context => hasClaimedRing(this, elementSymbol.key, context.player))
            .target({
                location: Location.Provinces,
                cardType: CardType.Province
            })
            .gameAction(moveCard(context => ({
                destination: Location.DynastyDiscardPile,
                target: context.target?.controller.getDynastyCardsInProvince(context.target.location) ?? []
            })))
            .effect('discard {1} and refill the province faceup', context => [context.target.controller.getDynastyCardsInProvince(context.target.location)])
            .limit(AbilityDsl.limit.perRound(3))
            .then()
            .refillFaceup((context) => ({ target: context.target.controller, location: context.target.location }));
    }

    getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default IsawaEju;
