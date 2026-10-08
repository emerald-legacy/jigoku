import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { copyBaseSkillEffects } from '../copyBaseSkills.js';

class KaitoTempleProtector extends DrawCard {
    static id = 'kaito-temple-protector';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: cardCannot({
                cannot: 'sendHome',
                restricts: 'opponentsCardEffects'
            })
        });

        this.action('Change base skills to match another character\'s')
            .condition(context => context.source.isDefending())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            }, cardLastingEffect((context) => ({
                target: context.source,
                effect: copyBaseSkillEffects(context.target)
            })))
            .chatText('change his base skills to equal {0}\'s current skills');
    }
}


export default KaitoTempleProtector;
