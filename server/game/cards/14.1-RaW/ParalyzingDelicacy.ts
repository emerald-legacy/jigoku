import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { Locations, CardTypes } from '../../Constants';

class ParalyzingDelicacy extends DrawCard {
    static id = 'paralyzing-delicacy';

    setupCardAbilities() {
        this.action({
            title: '-X military equal to facedown provinces',

            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(-this.getFaceDownProvinceCards(context))
                }))
            },
            effect: 'give {1} -{2}{3}',
            effectArgs: context => [context.target, this.getFaceDownProvinceCards(context), 'military']
        });
    }

    getFaceDownProvinceCards(context) {
        return context.target.controller
            .getDynastyCardsInProvince(Locations.Provinces)
            .filter(card => card.isFacedown() && card.controller === context.target.controller).length;
    }
}


export default ParalyzingDelicacy;
