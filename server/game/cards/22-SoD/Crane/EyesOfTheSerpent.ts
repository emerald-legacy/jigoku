import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType } from '../../../Constants.js';
import { gainHonor, multiple, onAffinity, taint } from '../../../GameActions/GameActions.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';
import { msg } from '../../../GameChat.js';

export default class EyesOfTheSerpent extends DrawCard {
    static id = 'eyes-of-the-serpent';

    setupCardAbilities() {
        this.action('Taint a character')
            .cost(AbilityDsl.costs.chooseOne({
                'Spend 1 honor': AbilityDsl.costs.payHonor(1),
                'Spend 1 fate': AbilityDsl.costs.payFate(1)
            }))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.isDishonored
            }, multiple([
                taint(),
                onAffinity({
                    trait: 'air',
                    gameAction: gainHonor(context => ({
                        target: context.player
                    })),
                    effect: 'gain 1 honor'
                })
            ]))
            .effect((context) => msg`taint ${context.target}`);
    }

    canPlay(context: AbilityContext, playType: string) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}
