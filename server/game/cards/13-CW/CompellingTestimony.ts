import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CompellingTestimony extends DrawCard {
    static id = 'compelling-testimony';

    setupCardAbilities() {
        this.action('Give a character -4 political')
            .condition(() => this.game.isDuringConflict('political'))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyPoliticalSkill(-4)
            }))
            .effect('give {0} -4{1}', () => ['political']);
    }
}


export default CompellingTestimony;
