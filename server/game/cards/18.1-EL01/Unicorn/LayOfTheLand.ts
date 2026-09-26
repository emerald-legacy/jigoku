import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class LayOfTheLand extends DrawCard {
    static id = 'lay-of-the-land';

    setupCardAbilities() {
        this.action('Reveal a province and discard status tokens')
            .target('target', {
                activePromptTitle: 'Choose an unbroken province',
                cardType: CardType.Province,
                controller: Players.Any,
                location: Location.Provinces,
                cardCondition: (card) => !(card).isBroken && card.location !== Location.StrongholdProvince
            }, AbilityDsl.actions.reveal(), AbilityDsl.actions.turnFacedown())
            .effect('{1} {2}', (context) => {
                const target = context.target;
                if(!target) {
                    return ['reveal', ''];
                }
                return target.isFaceup() ? ['flip facedown', target] : ['reveal', target.location];
            });
    }
}
