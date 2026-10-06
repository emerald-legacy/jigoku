import DrawCard from '../../../DrawCard.js';
import { delayedEffect, doesNotBow } from '../../../effects.js';
import {
    cardLastingEffect,
    discardStatusToken,
    joint,
    loseFate,
    menuPrompt,
    sequentialContext
} from '../../../GameActions/GameActions.js';
import { CardType, Players, Duration } from '../../../Constants.js';

class SurgingWave extends DrawCard {
    static id = 'surging-wave';

    setupCardAbilities() {
        this.action('Prevent bowing after conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            }, sequentialContext((context) => {
                const kihoPlayed = context.player.isKihoPlayedThisConflict(context, this);
                const gameActions = [];
                gameActions.push(
                    cardLastingEffect(() => ({
                        duration: Duration.UntilEndOfPhase,
                        effect: delayedEffect({
                            when: {
                                onConflictFinished: () => true
                            },
                            message: '{0} {3} removed from {1} due to the delayed effect of {2}',
                            messageArgs: [
                                context.target.statusTokens,
                                context.target,
                                context.source,
                                context.target.statusTokens.length > 1 ? 'are' : 'is'
                            ],
                            gameAction: discardStatusToken(() => ({
                                target: context.target.statusTokens
                            }))
                        })
                    }))
                );
                if(kihoPlayed) {
                    gameActions.push(
                        menuPrompt(() => ({
                            activePromptTitle:
                                    'Spend 1 fate to prevent ' +
                                    context.target.name +
                                    ' from bowing at the end of the conflict?',
                            choices: ['Yes', 'No'],
                            choiceHandler: (choice, displayMessage) => {
                                if(displayMessage) {
                                    context.game.addMessage(
                                        '{0} chooses {1}to spend a fate to prevent {2} from bowing during conflict resolution',
                                        context.player,
                                        choice === 'No' ? 'not ' : '',
                                        context.target
                                    );
                                }
                                return { amount: choice === 'Yes' ? 1 : 0 };
                            },
                            gameAction: joint([
                                loseFate({ target: context.player }),
                                cardLastingEffect(() => ({
                                    effect: doesNotBow(),
                                    target: context.target
                                }))
                            ])
                        }))
                    );
                }

                return {
                    gameActions: gameActions
                };
            }))
            .effect('discard all status tokens from {0} at the end of the conflict');
    }
}


export default SurgingWave;
