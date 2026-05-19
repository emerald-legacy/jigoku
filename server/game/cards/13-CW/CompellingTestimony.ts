import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CompellingTestimony extends DrawCard {
    static id = 'compelling-testimony';

    setupCardAbilities() {
        this.action({
            title: 'Give a character -4 political',
            condition: () => this.game.isDuringConflict('political'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyPoliticalSkill(-4)
                })
            },
            effect: 'give {0} -4{1}',
            effectArgs: () => ['political']
        });
    }
}


export default CompellingTestimony;
