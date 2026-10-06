import { CardType, Duration } from '../../../Constants.js';
import { loseFaction, playerCannot } from '../../../effects.js';
import { cardLastingEffect, multiple, playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class DisputedLineage extends DrawCard {
    static id = 'disputed-lineage';

    setupCardAbilities() {
        this.action('Choose a character')
            .target({
                cardType: CardType.Character
            }, multiple([
                cardLastingEffect((context) => ({
                    effect: loseFaction(context.target.printedFaction),
                    duration: Duration.UntilEndOfRound
                })),
                playerLastingEffect((context) => ({
                    duration: Duration.UntilEndOfRound,
                    targetController: context.target.controller,
                    condition: () => context.target.isParticipating(),
                    effect: playerCannot({
                        cannot: 'honor'
                    })
                }))
            ]))
            .effect('remove {0}\'s printed faction and prevent {1} from honoring characters while {0} is participating in a conflict', (context) => context.player.opponent ? [context.player.opponent] : [])
            .thenIf((context) => context.player.imperialFavor !== '')
            .draw(1)
            .message((context) => msg`${context.player} draws a card`);
    }

    canPlay(context: AbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card) => card.getType() === CardType.Character && card.hasTrait('courtier')
            ) && super.canPlay(context, playType)
        );
    }
}
