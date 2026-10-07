import DrawCard from '../../../DrawCard.js';
import { Phases } from '../../../Constants.js';
import { perRound } from '../../../AbilityLimit.js';
import { injure } from '../../../GameActions/GameActions.js';

export default class APoisonedBanquet extends DrawCard {
    static id = 'a-poisoned-banquet';

    setupCardAbilities() {
        this.interrupt('Injure everyone poisoned')
            .when({
                onPhaseEnded: event => event.phase === Phases.Conflict
            })
            .gameAction(injure((context) => ({
                target: context.game.findAnyCardsInPlay(card => card.attachments.some(attachment => attachment.hasTrait('poison')))
            })))
            .max(perRound(1));
    }
}
