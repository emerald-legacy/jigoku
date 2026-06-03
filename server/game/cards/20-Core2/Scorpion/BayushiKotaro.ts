import { CardType, Duration, Location, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class BayushiKotaro extends DrawCard {
    static id = 'bayushi-kotaro';

    setupCardAbilities() {
        this.action({
            title: 'Put a character into play',
            condition: (context) => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.reveal((context) => ({
                    target: context.player.getDynastyCardsInProvince(Location.Provinces)
                })),
                AbilityDsl.actions.selectCard((context) => ({
                    activePromptTitle: 'Choose a character to put into the conflict',
                    numCards: 1,
                    targets: true,
                    mode: TargetMode.Exactly,
                    optional: false,
                    cardType: CardType.Character,
                    location: [Location.Provinces],
                    controller: Players.Self,
                    cardCondition: (card) =>
                        !card.facedown &&
                        card.isFaction('scorpion') &&
                        card.allowGameAction('putIntoConflict', context),
                    message: '{0} puts {1} into play into the conflict, aiding {2} with their mission.',
                    messageArgs: (card) => [context.player, card, context.source],
                    subActionProperties: (card) => ({ target: card, x: 11 }),
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.putIntoConflict(),
                        AbilityDsl.actions.cardLastingEffect(() => ({
                            duration: Duration.UntilEndOfPhase,
                            location: [Location.PlayArea],
                            effect: AbilityDsl.effects.delayedEffect({
                                when: { onConflictFinished: () => true },
                                gameAction: AbilityDsl.actions.returnToDeck({ bottom: true })
                            })
                        }))
                    ])
                }))
            ])
        });
    }
}
