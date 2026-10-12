import DrawCard from '../../../DrawCard.js';
import { CardType, Location, Players, Stage } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { gainHonor, joint, putIntoPlay } from '../../../GameActions/GameActions.js';

export default class ACleansingDeath extends DrawCard {
    static id = 'a-cleansing-death';

    setupCardAbilities() {
        this.action('Put a character into play')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    const cardsInProvinces = [
                        ...context.player.getDynastyCardsInProvince(Location.ProvinceOne),
                        ...context.player.getDynastyCardsInProvince(Location.ProvinceTwo),
                        ...context.player.getDynastyCardsInProvince(Location.ProvinceThree),
                        ...context.player.getDynastyCardsInProvince(Location.ProvinceFour),
                        ...context.player.getDynastyCardsInProvince(Location.StrongholdProvince)
                    ];

                    const contextCopy = context.createCopy({
                        stage: Stage.Target
                    });

                    const faceupCharacters = cardsInProvinces.filter((a) => a.isFaceup() && a.type === CardType.Character);

                    const hasValidCharacters = faceupCharacters.some((a) => {
                        return (a.printedCost || 0) <= (card.printedCost || 0) &&
                            putIntoPlay().canAffect(a, contextCopy);
                    });
                    return hasValidCharacters;
                }
            }))
            .target({
                cardType: CardType.Character,
                // before the sacrifice is chosen (legality check), any character up to cost 10 counts
                cardCondition: (card, context) => {
                    const sacrificed = context.costs.sacrificeStateWhenChosen;
                    return (card.printedCost ?? 0) <= (sacrificed ? (sacrificed.printedCost ?? 0) : 10);
                },
                location: Location.Provinces,
                controller: Players.Self
            }, joint([
                putIntoPlay(),
                gainHonor((context) => ({
                    target: context.player
                }))
            ]))
            .chatText('put {0} into play and gain 1 honor')
            .cannotTargetFirst();
    }
}
