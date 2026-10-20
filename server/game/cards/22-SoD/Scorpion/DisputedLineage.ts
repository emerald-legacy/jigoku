import { CardType, Duration, RestrictionType, Trait } from '../../../Constants.js';
import { loseFaction, playerCannot } from '../../../effects.js';
import { cardLastingEffect, conditional, draw, multiple, playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class DisputedLineage extends DrawCard {
    static id = 'disputed-lineage';

    override setupCardAbilities() {
        this.action('Choose a character')
            .playOnlyIf((context) => context.player.cardsInPlay.some((card) => card.type === CardType.Character && card.hasTrait(Trait.Courtier)))
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
            .gameAction(conditional((context) => ({
                condition: context.player.imperialFavor !== '',
                trueGameAction: draw({ target: context.player })
            })))
            .chatText((context) => msg`remove ${context.chatTarget()}'s printed faction and prevent ${context.target.controller} from honoring characters while ${context.chatTarget()} is participating in a conflict${context.player.imperialFavor !== '' ? ' and draw a card' : ''}`);
    }
}
