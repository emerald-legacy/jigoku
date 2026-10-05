import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KaitoTempleProtector extends DrawCard {
    static id = 'kaito-temple-protector';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'sendHome',
                restricts: 'opponentsCardEffects'
            })
        });

        this.action('Change base skills to match another character\'s')
            .condition(context => context.source.isDefending())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            }, AbilityDsl.actions.cardLastingEffect((context) => {
                const effects = [];
                if(context.target.hasDash('military')) {
                    effects.push(AbilityDsl.effects.setBaseDash('military'));
                } else {
                    effects.push(AbilityDsl.effects.setBaseMilitarySkill(context.target.militarySkill));
                }
                if(context.target.hasDash('political')) {
                    effects.push(AbilityDsl.effects.setBaseDash('political'));
                } else {
                    effects.push(AbilityDsl.effects.setBasePoliticalSkill(context.target.politicalSkill));
                }
                return {
                    target: context.source,
                    effect: effects
                };
            }))
            .effect('change his base skills to equal {0}\'s current skills');
    }
}


export default KaitoTempleProtector;
