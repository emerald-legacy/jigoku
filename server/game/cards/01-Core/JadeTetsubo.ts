import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class JadeTetsubo extends DrawCard {
    static id = 'jade-tetsubo';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Return all fate from a character')
            .cost(ability.costs.bowSelf())
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.militarySkill < (context.source.parentCharacter?.militarySkill ?? 0)
            }, ability.actions.removeFate((context) => ({
                amount: context.target.getFate(),
                recipient: context.target.owner
            })))
            .effect('return all fate from {0} to its owner');
    }
}


export default JadeTetsubo;
