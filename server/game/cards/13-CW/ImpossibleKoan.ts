import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ImpossibleKoan extends DrawCard {
    static id = 'impossible-koan';

    setupCardAbilities() {
        this.action({
            title: 'Make all participating characters have base skills of 1/1',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.findAnyCardsInPlay((card: any) => card.type === CardTypes.Character),
                effect: [
                    AbilityDsl.effects.setBaseMilitarySkill(1),
                    AbilityDsl.effects.setBasePoliticalSkill(1)
                ]
            })),
            effect: 'make all characters have base skills of 1{1}/1{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}


export default ImpossibleKoan;
