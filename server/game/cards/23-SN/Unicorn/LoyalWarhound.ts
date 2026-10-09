import { AbilityType, CardType, Duration, EffectName, Players, RestrictionType, RestrictionScope } from '../../../Constants.js';
import { addFlag, blank, cardCannot, changeType, gainAbility } from '../../../effects.js';
import { attach, cardLastingEffect, detach, handler, sequentialContext } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class LoyalWarhound extends DrawCard {
    static id = 'loyal-warhound';

    setupCardAbilities() {
        const DummyHoundAttachment = new DrawCard(this.owner, {
            cost: '0',
            glory: '0',
            side: 'dynasty',
            text: '',
            type: CardType.Attachment,
            name: 'War Hound',
            id: 'loyal-warhound',
            traits: ['creature']
        });

        this.action('Attach this to a character')
            .condition((context) => context.source.type === CardType.Character)
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    attach({ attachment: DummyHoundAttachment }).canAffect(card, context) && card !== context.source
            })
            .gameAction(sequentialContext((context) => {
                const gameActions: GameAction[] = [];

                gameActions.push(cardLastingEffect({
                    target: context.source,
                    duration: Duration.Custom,
                    until: {
                        onCardDetached: (event) => event.card === context.source,
                        onCardLeavesPlay: (event) => event.card === context.source
                    },
                    effect: [
                        blank(true),
                        changeType(CardType.Attachment),
                        gainAbility.action('Detach', (ability) => ability
                            .condition((context) => {
                                const flags = context.source.getEffects(EffectName.AddFlag);
                                return !flags.includes('wasAttachedThisRound');
                            })
                            .gameAction(detach())
                            .chatText('detach itself')),
                        // Matched dynamically so the protection follows this card if it is reattached
                        gainAbility(AbilityType.Persistent, {
                            targetController: Players.Any,
                            match: (card, context) =>
                                card === context?.source.parentCharacter && card.hasTrait('scout'),
                            effect: cardCannot({
                                cannot: RestrictionType.Target,
                                appliesTo: RestrictionScope.OpponentsProvinceEffects
                            })
                        })
                    ]
                }));

                gameActions.push(cardLastingEffect({
                    target: context.source,
                    duration: Duration.UntilEndOfRound,
                    effect: addFlag('wasAttachedThisRound')
                }));

                gameActions.push(attach({
                    attachment: this,
                    target: context.target,
                    wasACharacter: true
                }));

                // It is no longer a character, so it stops contributing to the conflict
                gameActions.push(handler({
                    handler: () => context.game.currentConflict?.removeFromConflict(context.source)
                }));

                return { gameActions };
            }))
            .chatText('attach itself to {0}');
    }
}
