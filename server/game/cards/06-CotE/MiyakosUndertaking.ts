import { copyCard } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { msg } from '../../GameChat.js';

export default class MiyakosUndertaking extends DrawCard {
    static id = 'miyako-s-undertaking';

    setupCardAbilities() {
        this.action('Make a character a copy')
            .target({
                name: 'cardToCopy',
                cardType: CardType.Character,
                controller: Players.Opponent,
                location: Location.DynastyDiscardPile,
                cardCondition: (card) => !card.isUnique()
            })
            .target({
                name: 'myCharacter',
                dependsOn: 'cardToCopy',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: copyCard(context.targets.cardToCopy)
            })))
            .effect((context) => msg`make ${context.targets.myCharacter} into a copy of ${context.targets.cardToCopy}`);
    }

    canPlay(context: AbilityContext) {
        return context.player.honor <= 6 && super.canPlay(context);
    }
}
