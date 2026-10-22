import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { Location, CardType, Element } from '../../Constants.js';
import { claimedRingSymbols, hasClaimedRing } from '../claimedRings.js';

const elementSymbol = { key: 'isawa-eju-air', element: Element.Air };

class IsawaEju extends DrawCard {
    static id = 'isawa-eju';

    override setupCardAbilities() {
        this.action('Discard all cards in a province and refill it faceup')
            .ifCondition((context) => hasClaimedRing(this, elementSymbol.key, context.player))
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                // the stronghold province is never refilled
                cardCondition: (card) => card.location !== Location.StrongholdProvince && card.controller.getDynastyCardsInProvince(card.location).length > 0
            })
            .moveCard((context) => ({
                destination: Location.DynastyDiscardPile,
                target: context.target?.controller.getDynastyCardsInProvince(context.target.location) ?? []
            }))
            .chatText((context) => msg`discard ${context.target.controller.getDynastyCardsInProvince(context.target.location)} and refill the province faceup`)
            .limit(perRound(3))
            .then()
            .refillFaceup((context) => ({ target: context.target.controller, location: context.target.location }));
    }

    override getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }
}


export default IsawaEju;
