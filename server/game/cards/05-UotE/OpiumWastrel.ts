import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class OpiumWastrel extends DrawCard {
    static id = 'opium-wastrel';

    setupCardAbilities() {
        this.reaction('Set a character\'s glory to 0')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source && this.game.isDuringConflict()
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.setGlory(0)
            }))
            .effect('set {0}\'s glory to 0 until the end of the conflict');
    }

    canPlay(context: AbilityContext, playType: string): boolean {
        return !!context.player.opponent && context.player.isLessHonorable() && super.canPlay(context, playType);
    }
}


export default OpiumWastrel;
