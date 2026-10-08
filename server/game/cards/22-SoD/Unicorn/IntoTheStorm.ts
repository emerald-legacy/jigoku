import { msg } from '../../../GameChat.js';
import { increaseCost } from '../../../effects.js';
import { gainFate, playerLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Duration, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class IntoTheStorm extends DrawCard {
    static id = 'into-the-storm';

    public setupCardAbilities() {
        this.conflictAction('Increase the cost to play events')
            .gameAction(playerLastingEffect((context) => ({
                targetController: Players.Any,
                effect: increaseCost({
                    amount: 1,
                    match: (card) => card.type === CardType.Event
                }),
                duration: Duration.Custom,
                until: {
                    onCardPlayed: (event) => event.player === context.player && event.card.type === CardType.Event && event.card !== context.source,
                    onConflictFinished: () => true
                },
                endingMessage: 'The storm abates, events no longer cost 1 more'
            })))
            .if((context) => context.player.isCharacterTraitInPlay('scout'))
            .gameAction(gainFate((context) => ({ target: context.player })))
            .chatText((context) => msg`increase the cost of events this conflict by 1${context.player.isCharacterTraitInPlay('scout') ? ' and gain 1 fate' : ''}`);
    }
}
