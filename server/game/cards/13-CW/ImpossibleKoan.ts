import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { setBaseMilitarySkill, setBasePoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class ImpossibleKoan extends DrawCard {
    static id = 'impossible-koan';

    setupCardAbilities() {
        this.conflictAction('Make all participating characters have base skills of 1/1')
            .gameAction(cardLastingEffect(context => ({
                target: context.game.findAnyCardsInPlay((card) => card.type === CardType.Character),
                effect: [
                    setBaseMilitarySkill(1),
                    setBasePoliticalSkill(1)
                ]
            })))
            .effect('make all characters have base skills of 1{1}/1{2}', () => ['military', 'political']);
    }
}


export default ImpossibleKoan;
