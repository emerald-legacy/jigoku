import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';

class OpiumWastrel extends DrawCard {
    static id = 'opium-wastrel';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Set a character\'s glory to 0',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source && this.game.isDuringConflict()
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.setGlory(0)
                })
            },
            effect: 'set {0}\'s glory to 0 until the end of the conflict'
        });
    }

    canPlay(context: AbilityContext, playType: string): boolean {
        return !!context.player.opponent && context.player.isLessHonorable() && super.canPlay(context, playType);
    }
}


export default OpiumWastrel;
