import { CardType, Players } from '../../Constants.js';
import { immunity } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class NorthernWallSensei extends DrawCard {
    static id = 'northern-wall-sensei';

    setupCardAbilities() {
        this.action('Grant immunity to events')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.attachments.length > 0
            }, cardLastingEffect({
                effect: immunity({ restricts: 'events' })
            }))
            .chatText('grant immunity to events to {0}');
    }
}
