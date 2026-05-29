import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes, Elements } from '../../Constants.js';

const elementKey = 'isawa-eju-air';

class IsawaEju extends DrawCard {
    static id = 'isawa-eju';

    setupCardAbilities() {
        this.action<ProvinceCard>({
            title: 'Discard all cards in a province and refill it faceup',
            condition: context => this.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player),
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province
            },
            gameAction: AbilityDsl.actions.moveCard<ProvinceCard>(context => ({
                destination: Locations.DynastyDiscardPile,
                target: context.target?.controller.getDynastyCardsInProvince(context.target.location) ?? []
            })),
            effect: 'discard {1} and refill the province faceup',
            effectArgs: context => [context.target?.controller.getDynastyCardsInProvince(context.target.location) ?? []],
            then: context => {
                const target = context?.target as ProvinceCard;
                return {
                    gameAction: AbilityDsl.actions.refillFaceup(() => ({
                        target: target.controller,
                        location: target.location
                    }))
                };
            },
            limit: AbilityDsl.limit.perRound(3)
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Air
        });
        return symbols;
    }
}


export default IsawaEju;
