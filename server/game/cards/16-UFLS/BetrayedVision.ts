import { copyCard } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Players, type PlayType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { controlsShugenja } from '../controlsShugenja.js';
import { msg } from '../../GameChat.js';

export default class BetrayedVision extends DrawCard {
    static id = 'betrayed-vision';

    setupCardAbilities() {
        this.action('Make a character a copy')
            .target({
                name: 'cardToCopy',
                activePromptTitle: 'Choose a character to copy',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => !card.isUnique()
            })
            .target({
                name: 'myCharacter',
                dependsOn: 'cardToCopy',
                activePromptTitle: 'Choose a character to turn into the copy',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && card !== context.targets.cardToCopy
            }, cardLastingEffect((context) => ({
                effect: copyCard(context.targets.cardToCopy)
            })))
            .chatText((context) => msg`make ${context.targets.myCharacter} into a copy of ${context.targets.cardToCopy}`);
    }

    canPlay(context: AbilityContext, playType?: PlayType) {
        return controlsShugenja(context.player) && super.canPlay(context, playType);
    }
}
