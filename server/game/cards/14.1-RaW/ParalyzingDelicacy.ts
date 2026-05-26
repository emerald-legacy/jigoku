import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes } from '../../Constants.js';

class ParalyzingDelicacy extends DrawCard {
    static id = 'paralyzing-delicacy';

    setupCardAbilities() {
        this.action({
            title: '-X military equal to facedown provinces',

            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(-this.getFaceDownProvinceCards(context))
                }))
            },
            effect: 'give {1} -{2}{3}',
            effectArgs: context => [context.target, this.getFaceDownProvinceCards(context), 'military']
        });
    }

    getFaceDownProvinceCards(context: any) {
        return context.target.controller
            .getDynastyCardsInProvince(Locations.Provinces)
            .filter((card: any) => card.isFacedown() && card.controller === context.target.controller).length;
    }
}


export default ParalyzingDelicacy;
