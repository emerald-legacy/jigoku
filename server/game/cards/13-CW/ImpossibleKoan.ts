import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { setBaseMilitarySkill, setBasePoliticalSkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

class ImpossibleKoan extends DrawCard {
    static id = 'impossible-koan';

    setupCardAbilities() {
        this.conflictAction('Make all participating characters have base skills of 1/1')
            .cardLastingEffect(context => ({
                target: context.game.findAnyCardsInPlay((card) => card.type === CardType.Character),
                effect: [
                    setBaseMilitarySkill(1),
                    setBasePoliticalSkill(1)
                ]
            }))
            .effect(() => msg`make all characters have base skills of 1${'military'}/1${'political'}`);
    }
}


export default ImpossibleKoan;
