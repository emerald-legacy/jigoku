import { CardType, Duration, RestrictionType } from '../../../Constants.js';
import { loseFaction, playerCannot } from '../../../effects.js';
import { cardLastingEffect, multiple, playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class DisputedLineage extends DrawCard {
    static id = 'disputed-lineage';

    setupCardAbilities() {
        this.action('Choose a character')
            .playOnlyIf((context) => context.player.cardsInPlay.some((card) => card.type === CardType.Character && card.hasTrait('courtier')))
            .target({
                cardType: CardType.Character
            }, multiple([
                cardLastingEffect((context) => ({
                    effect: loseFaction(context.target.printedFaction),
                    duration: Duration.UntilEndOfRound
                })),
                playerLastingEffect((context) => ({
                    duration: Duration.UntilEndOfRound,
                    target: context.target.controller,
                    condition: () => context.target.isParticipating(),
                    effect: playerCannot({
                        cannot: RestrictionType.Honor
                    })
                }))
            ]))
            .chatText((context) => msg`remove ${context.chatTarget()}'s printed faction and prevent ${context.player.opponent} from honoring characters while ${context.chatTarget()} is participating in a conflict`)
            .afterwardsIf((context) => context.player.imperialFavor !== '')
            .draw(1)
            .message((context) => msg`${context.player} draws a card`);
    }
}
