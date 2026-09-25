import DrawCard from '../../../DrawCard.js';
import { Phases } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class APoisonedBanquet extends DrawCard {
    static id = 'a-poisoned-banquet';

    setupCardAbilities() {
        this.interrupt('Injure everyone poisoned')
            .when({
                onPhaseEnded: event => event.phase === Phases.Conflict
            })
            .gameAction(AbilityDsl.actions.injure((context) => ({
                target: context.game.findAnyCardsInPlay(card => card.attachments.some(attachment => attachment.hasTrait('poison')))
            })))
            .max(AbilityDsl.limit.perRound(1));
    }
}
