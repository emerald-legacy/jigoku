import { copyCard } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

export default class MiyakosUndertaking extends DrawCard {
    static id = 'miyako-s-undertaking';

    override setupCardAbilities() {
        this.action('Make a character a copy')
            .playOnlyIf((context) => context.player.honor <= 6)
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
                cardCondition: (card, context) => card.isParticipating() && card.name !== context.targets.cardToCopy?.name
            }, cardLastingEffect((context) => ({
                effect: copyCard(context.targets.cardToCopy)
            })))
            .chatText((context) => msg`make ${context.targets.myCharacter} into a copy of ${context.targets.cardToCopy}`);
    }
}
