import { CardType, Duration, Location, Players, TargetMode } from '../../../Constants.js';
import { delayedEffect } from '../../../effects.js';
import {
    cardLastingEffect,
    putIntoConflict,
    returnToDeck,
    reveal,
    selectCards,
    sequential
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class BayushiKotaro extends DrawCard {
    static id = 'bayushi-kotaro';

    setupCardAbilities() {
        this.action('Put a character into play')
            .condition((context) => context.source.isParticipating())
            .gameAction(sequential([
                reveal((context) => ({
                    target: context.player.getDynastyCardsInProvince(Location.Provinces)
                })),
                selectCards((context) => ({
                    activePromptTitle: 'Choose a character to put into the conflict',
                    numCards: 1,
                    targets: true,
                    mode: TargetMode.Exactly,
                    cardType: CardType.Character,
                    location: [Location.Provinces],
                    controller: Players.Self,
                    cardCondition: (card) =>
                        !card.facedown &&
                        card.isFaction('scorpion') &&
                        card.allowGameAction('putIntoConflict', context),
                    message: '{0} puts {1} into play into the conflict, aiding {2} with their mission',
                    messageArgs: (card) => [context.player, card, context.source],
                    gameAction: sequential([
                        putIntoConflict(),
                        cardLastingEffect(() => ({
                            duration: Duration.UntilEndOfPhase,
                            effect: delayedEffect({
                                when: { onConflictFinished: () => true },
                                gameAction: returnToDeck({ bottom: true })
                            })
                        }))
                    ])
                }))
            ]));
    }
}
