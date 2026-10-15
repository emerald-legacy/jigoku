import { CardType, Trait } from '../../../Constants.js';
import { taint } from '../../../GameActions/GameActions.js';
import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import { msg } from '../../../GameChat.js';

export default class EyesOfTheSerpent extends DrawCard {
    static id = 'eyes-of-the-serpent';

    override setupCardAbilities() {
        this.conflictAction('Taint a character')
            .playOnlyIf((context) => controlsShugenja(context.player))
            .cost(costs.chooseOne({
                'Spend 1 honor': costs.payHonor(1),
                'Spend 1 fate': costs.payFate(1)
            }))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.isDishonored
            }, taint())
            .onAffinity(Trait.Air, { chatText: () => msg`gain 1 honor` })
            .gainHonor()
            .chatText((context) => msg`taint ${context.target}`);
    }
}
