import { copyCard } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

export default class ShosuroActor extends DrawCard {
    static id = 'shosuro-actor';

    setupCardAbilities() {
        this.action('Choose a character to copy')
            .condition((context) => context.source.isParticipating())
            .target({
                player: Players.Self,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.isUnique()
            }, cardLastingEffect((context) => ({
                target: context.source,
                effect: context.target ? copyCard(context.target) : []
            })))
            .effect((context) => msg`become a copy of ${context.target}`);
    }
}
